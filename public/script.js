const getCrafts = async () => {
    try {
        return (await fetch("https://server-edit-and-delete-0kvg.onrender.com/api/crafts")).json();
    } catch (error) {
        console.log("error retrieving data");
        return "";
    }
};

let currentCraft;

// displays craft in readonly modal dialog
const displayCraftModal = (craft) => {
    const modal = document.getElementById("myModal");
    const modalTitle = document.getElementById("modal-title");
    const modalDescription = document.getElementById("modal-description");
    const modalSupplies = document.getElementById("modal-supplies");
    const modalImage = document.getElementById("modal-image");
    const modelContent = document.getElementById("modelContent");

    modalTitle.innerHTML = `<strong>${craft.name}</strong>`;

    // Add edit and delete buttons next to the Name
    const editLink = document.createElement("a");
    editLink.innerHTML = "&#9998;";
    modalTitle.append(editLink);
    editLink.id = "edit-link";

    const deleteLink = document.createElement("a");
    deleteLink.innerHTML = "&#x274c;";
    modalTitle.append(deleteLink);
    deleteLink.id = "delete-link";
    deleteLink.onclick = deleteCraftMethod.bind(this, craft);

    modalDescription.textContent = craft.description;

    modalSupplies.innerHTML = "<strong>Supplies:</strong>";
    craft.supplies.forEach((supply) => {
        const listItem = document.createElement("li");
        listItem.textContent = supply;
        modalSupplies.appendChild(listItem);
    });

    modalImage.src = "https://server-edit-and-delete-0kvg.onrender.com/" + craft.img;

    modal.style.display = "block";

    const closeModal = () => {
        modal.style.display = "none";
    };

    const closeButton = document.getElementsByClassName("close")[0];
    closeButton.addEventListener("click", closeModal);

    window.addEventListener("click", (event) => {
        if (event.target == modal) {
            closeModal();
        }
    });
    currentCraft = craft;

    editLink.onclick = showEditCraftForm;
    populateCraftEditForm(craft);
};


const populateCraftEditForm = (craft) => {
    const form = document.getElementById("craft-form");
    form._id.value = craft._id;
    form.name.value = craft.name;
    form.description.value = craft.description;

    document.getElementById("img-prev").src = `/${craft.img}`;
    populateSupplies(craft.supplies);
};


const populateSupplies = (supplies) => {
    const section = document.getElementById("supply-boxes");
    supplies.forEach((supply) => {
        const input = document.createElement("input");
        input.type = "text";
        input.value = supply;
        section.append(input);
    });
};


const deleteCraftMethod = async (craft) => {

    var deleteConfirm = confirm("Are you sure you want to delete?");
    if (deleteConfirm == false) {
        return false;
    }

    let response = await fetch(`https://server-edit-and-delete-0kvg.onrender.com/api/crafts/${craft._id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        }
    });

    if (response.status != 200) {
        console.log("Error Deleting Craft");
        return;
    }

    let result = await response.json();

    
    resetForm();
    clearScreen();
    showCrafts();
    document.getElementById("myModal").style.display = "none";

};


const showCrafts = async () => {
    const craftsJSON = await getCrafts();


    const columns = document.querySelectorAll(".column");
    if (craftsJSON == "") {
        columns.forEach(column => {
            column.innerHTML = "Sorry, no crafts";
        });
        return;
    }
    let columnIndex = 0;
    let columnCount = columns.length;
    let columnHeights = Array.from(columns).map(() => 0); // Array to store column heights

    craftsJSON.forEach((craft, index) => {
        const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
        const galleryItem = document.createElement("div");
        galleryItem.classList.add("gallery-item");
        const img = document.createElement("img");
        img.src = "https://server-edit-and-delete-0kvg.onrender.com/" + craft.img;
        img.alt = craft.name;
        img.addEventListener("click", () => displayCraftModal(craft));
        galleryItem.appendChild(img);
        columns[shortestColumnIndex].appendChild(galleryItem);
        columnHeights[shortestColumnIndex] += galleryItem.offsetHeight;

        if (columnHeights[shortestColumnIndex] >= columns[shortestColumnIndex].offsetHeight) {
            columnIndex++;
            if (columnIndex === columnCount) columnIndex = 0;
            columnHeights[shortestColumnIndex] = 0;
        }
    });
};



// post the craft to the server
const addEditCraft = async (e) => {
    e.preventDefault();
    const form = document.getElementById("craft-form");
    const formData = new FormData(form);
    let response;
    const imgInput = document.getElementById("img");
    if (imgInput.files.length > 0) {
        formData.append("img", imgInput.files[0]);
    }
    formData.append("supplies", getSupplies());

    // Add Method
    try {
        if (form._id.value.trim() == "") {
            console.log("in add method");
            response = await fetch("/api/crafts", {
                method: "POST",
                body: formData,
            });
            if (!response.ok) {
                throw new Error("Error posting data");
            }
        } else { // edit method
            //put request
            console.log("in put");
            response = await fetch(`/api/crafts/${form._id.value}`, {
                method: "PUT",
                body: formData
            });
            if (!response.ok) {
                throw new Error("Error posting data");
            }
        }

        if (response.status != 200) {
            console.log("Error adding / editing craft");
        }

        await response.json();
        resetForm();
        clearScreen();
        showCrafts();
        document.getElementById("dialog").style.display = "none";
        // Call showCrafts only once after adding the craft
       
    }
    catch (error) {
        console.error(error);
    }

};


clearScreen = () => {
    let craftsDiv1 = document.getElementById("craft-list-column1");
    let craftsDiv2 = document.getElementById("craft-list-column2");
    let craftsDiv3 = document.getElementById("craft-list-column3");
    let craftsDiv4 = document.getElementById("craft-list-column4");
    craftsDiv1.innerHTML = "";
    craftsDiv2.innerHTML = "";
    craftsDiv3.innerHTML = "";
    craftsDiv4.innerHTML = "";
}

const getSupplies = () => {
    const inputs = document.querySelectorAll("#supply-boxes input");
    let supplies = [];


    inputs.forEach((input) => {
        supplies.push(input.value);
    });


    return supplies.join(",");
};


document.getElementById("cancel-button").addEventListener("click", (e) => {
    e.preventDefault();
    resetForm();
    document.getElementById("dialog").style.display = "none";
});


const resetForm = () => {
    const form = document.getElementById("craft-form");
    form.reset();
    form._id.value = "";
    document.getElementById("supply-boxes").innerHTML = "";
    document.getElementById("img-prev").src = "";
};


const showAddCraftForm = (e) => {
    e.preventDefault();
    openDialog("craft-form");
    resetForm();
};

const showEditCraftForm = (e) => {
    e.preventDefault();
    document.getElementById("myModal").style.display = "none";
    openDialog("craft-form");
};

const addSupply = (e) => {
    e.preventDefault();
    const section = document.getElementById("supply-boxes");
    const input = document.createElement("input");
    input.type = "text";
    section.append(input);
};


const openDialog = (id) => {
    document.getElementById("dialog").style.display = "block";
    document.querySelectorAll("#dialog-details > *").forEach((item) => {
        item.classList.add("hidden");
    });
    document.getElementById(id).classList.remove("hidden");
};


// when the server is loaded show all the crafts from server
showCrafts();

document.getElementById("craft-form").onsubmit = addEditCraft;
document.getElementById("add-link").onclick = showAddCraftForm;
document.getElementById("add-supply").onclick = addSupply;


document.getElementById("img").onchange = (e) => {
    if (!e.target.files.length) {
        document.getElementById("img-prev").src = "";
        return;
    }
    const reader = new FileReader();
    reader.onload = function (event) {
        const imgPrev = document.getElementById("img-prev");
        imgPrev.src = event.target.result;
        imgPrev.style.width = "200px";
        imgPrev.style.height = "300px";
    };
    reader.readAsDataURL(e.target.files[0]);
};


document.getElementById("img-prev").onerror = function () {
    this.src = 'https://place-hold.it/200x300';
};
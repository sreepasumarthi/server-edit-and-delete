const getCrafts = async () => {
    try {
        return (await fetch("https://server-edit-and-delete-0kvg.onrender.com/api/crafts")).json();
    } catch (error) {
        console.log("error retrieving data");
        return "";
    }
};


const openModal = (craft) => {
    const modal = document.getElementById("myModal");
    const modalTitle = document.getElementById("modal-title");
    const modalDescription = document.getElementById("modal-description");
    const modalSupplies = document.getElementById("modal-supplies");
    const modalImage = document.getElementById("modal-image");


    modalTitle.innerHTML = `<strong>${craft.name}</strong>`;
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
        img.addEventListener("click", () => openModal(craft));
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


showCrafts();


const addCraft = async (e) => {
    e.preventDefault();
    const form = document.getElementById("add-craft-form");
    const formData = new FormData(form);
    let response;
    const imgInput = document.getElementById("img");
    if (imgInput.files.length > 0) {
        formData.append("img", imgInput.files[0]);
    }


    formData.append("supplies", getSupplies());


    try {
        response = await fetch("https://server-edit-and-delete-0kvg.onrender.com/api/crafts", {
            method: "POST",
            body: formData,
        });


        if (!response.ok) {
            throw new Error("Error posting data");
        }


        await response.json();
        resetForm();
        document.getElementById("dialog").style.display = "none";


        // Call showCrafts only once after adding the craft
        showCrafts();
    } catch (error) {
        console.error(error);
    }
};


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
    const form = document.getElementById("add-craft-form");
    form.reset();
    document.getElementById("supply-boxes").innerHTML = "";
    document.getElementById("img-prev").src = "";
};


const showCraftForm = (e) => {
    e.preventDefault();
    openDialog("add-craft-form");
    resetForm();
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


showCrafts();
document.getElementById("add-craft-form").onsubmit = addCraft;
document.getElementById("add-link").onclick = showCraftForm;
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

document.getElementById("edit-craft-btn").addEventListener("click", editCraft);

// Add event listener for the edit button
document.getElementById("edit-craft-btn").addEventListener("click", editCraft);

// Function to handle editing a craft
const editCraft = (craft) => {
    // Hide existing craft details
    document.getElementById("modal-description").style.display = "none";
    document.getElementById("modal-supplies").style.display = "none";
    document.getElementById("edit-craft-btn").style.display = "none";

    // Show edit form
    const editForm = document.createElement("form");
    editForm.id = "edit-craft-form";
    editForm.innerHTML = `
        <label for="edit-name">Name:</label>
        <input type="text" id="edit-name" name="name" required value="${craft.name}" />
        <label for="edit-description">Description:</label>
        <input type="text" id="edit-description" name="description" required value="${craft.description}" />
        <label class="inline">Supplies:</label>
        <a href="#" id="add-supply">Add Supply</a>
        <section id="edit-supply-boxes">
            ${craft.supplies.map(supply => `<input type="text" value="${supply}" />`).join("")}
        </section>
        <input type="file" id="edit-img" name="img" accept="image/*" />
        <button type="button" id="cancel-edit-btn">Cancel</button>
        <button type="submit">Save Edits</button>
    `;
    document.querySelector(".modal-details").appendChild(editForm);

    // Hide original craft image
    document.getElementById("modal-image").style.display = "none";

    // Event listener for cancel edit button
    document.getElementById("cancel-edit-btn").addEventListener("click", cancelEditCraft);

    // Event listener for edit form submission
    editForm.onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(editForm);
        const imgInput = document.getElementById("edit-img");
        if (imgInput.files.length > 0) {
            formData.append("img", imgInput.files[0]);
        }

        const supplies = Array.from(document.querySelectorAll("#edit-supply-boxes input")).map(input => input.value);
        formData.append("supplies", supplies.join(","));

        try {
            const response = await fetch(`https://server-edit-and-delete-0kvg.onrender.com/api/crafts/${craft._id}`, {
                method: "PUT",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Error updating craft");
            }

            // Refresh the page to reflect changes
            location.reload();
        } catch (error) {
            console.error(error);
        }
    };
};

// Function to cancel edit and show original craft details
const cancelEditCraft = () => {
    document.getElementById("modal-description").style.display = "block";
    document.getElementById("modal-supplies").style.display = "block";
    document.getElementById("edit-craft-btn").style.display = "block";
    document.getElementById("edit-craft-form").remove();
    document.getElementById("modal-image").style.display = "block";
};

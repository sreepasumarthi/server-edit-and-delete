// Function to retrieve crafts data from the server asynchronously
const getCrafts = async () => {
    try {
        return (await fetch("https://server-edit-and-delete-0kvg.onrender.com/api/crafts")).json();
    } catch (error) {
        console.log("error retrieving data");
        return "";
    }
};

// Function to open a modal and display details of a specific craft
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

// Function to display crafts on the webpage
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

// Function to add a new craft
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

        showCrafts();
    } catch (error) {
        console.error(error);
    }
};

// Function to retrieve supplies from input fields and concatenate them into a comma-separated string
const getSupplies = () => {
    const inputs = document.querySelectorAll("#supply-boxes input");
    let supplies = [];


    inputs.forEach((input) => {
        supplies.push(input.value);
    });


    return supplies.join(",");
};

// Event listener for cancel button to reset the form and hide the dialog
document.getElementById("cancel-button").addEventListener("click", (e) => {
    e.preventDefault();
    resetForm();
    document.getElementById("dialog").style.display = "none";
});

// Function to reset the form to its initial state
const resetForm = () => {
    const form = document.getElementById("add-craft-form");
    form.reset();
    document.getElementById("supply-boxes").innerHTML = "";
    document.getElementById("img-prev").src = "";
};

// Function to show the craft form in a dialog
const showCraftForm = (e) => {
    e.preventDefault();
    openDialog("add-craft-form");
    resetForm();
};

// Function to add a new supply input field to the form
const addSupply = (e) => {
    e.preventDefault();
    const section = document.getElementById("supply-boxes");
    const input = document.createElement("input");
    input.type = "text";
    section.append(input);
};

// Function to open a dialog with specified id
const openDialog = (id) => {
    document.getElementById("dialog").style.display = "block";
    document.querySelectorAll("#dialog-details > *").forEach((item) => {
        item.classList.add("hidden");
    });
    document.getElementById(id).classList.remove("hidden");
};

// Initial function call to display crafts when the page loads
showCrafts();

// Event listeners for form submission, showing craft form, and adding a supply
document.getElementById("add-craft-form").onsubmit = addCraft;
document.getElementById("add-link").onclick = showCraftForm;
document.getElementById("add-supply").onclick = addSupply;

// Event listener for image file input change to display preview
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

// Event handler for error in image preview
document.getElementById("img-prev").onerror = function () {
    this.src = 'https://place-hold.it/200x300';
};

// Function to toggle between view and edit modes
const toggleEditMode = () => {
    const modalTitle = document.getElementById("modal-title");
    const modalDescription = document.getElementById("modal-description");
    const editPencil = document.getElementById("edit-pencil");
    const saveButton = document.getElementById("save-button");
    const nameInput = document.getElementById("name-input");
    const descriptionInput = document.getElementById("description-input");

    // Toggle visibility of elements between view and edit modes
    modalTitle.classList.toggle("hidden");
    modalDescription.classList.toggle("hidden");
    editPencil.classList.toggle("hidden");
    saveButton.classList.toggle("hidden");
    nameInput.classList.toggle("hidden");
    descriptionInput.classList.toggle("hidden");

    // Pre-fill input fields with current craft details in edit mode
    nameInput.value = modalTitle.innerText;
    descriptionInput.value = modalDescription.innerText;
};

// Function to save edits and update craft details
const saveEdits = async () => {
    const modalTitle = document.getElementById("modal-title");
    const modalDescription = document.getElementById("modal-description");
    const nameInput = document.getElementById("name-input").value;
    const descriptionInput = document.getElementById("description-input").value;
    const craftId = parseInt(modalTitle.dataset.craftId); // Retrieve craft ID from dataset

    try {
        const response = await fetch(`https://server-edit-and-delete-0kvg.onrender.com/api/crafts/${craftId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: nameInput,
                description: descriptionInput
                // Add other fields if needed
            })
        });

        if (!response.ok) {
            throw new Error("Error updating craft details");
        }

        // Update craft details in modal
        modalTitle.innerText = nameInput;
        modalDescription.innerText = descriptionInput;

        // Toggle back to view mode
        toggleEditMode();
    } catch (error) {
        console.error(error);
    }
};

// Add event listener to the edit pencil icon to toggle edit mode
document.getElementById("edit-pencil").addEventListener("click", toggleEditMode);

// Add event listener to the save button to save edits
document.getElementById("save-button").addEventListener("click", saveEdits);


document.getElementById("craft-form").addEventListener("submit", submitCraft);

const submitCraft = async (event) => {
    event.preventDefault();
    const form = document.getElementById("craft-form");
    const formData = new FormData(form);
    
    // Construct FormData object from form data
    const craftData = {};
    formData.forEach((value, key) => {
        craftData[key] = value;
    });

    // Extract _id from craftData
    const craftId = craftData._id;

    try {
        const response = await fetch(`https://server-edit-and-delete-0kvg.onrender.com/api/crafts/${craftId}`, {
            method: "PUT",
            body: JSON.stringify(craftData),
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Error updating craft");
        }

        // Close the modal and refresh crafts list
        closeModal();
        showCrafts();
    } catch (error) {
        console.error(error);
    }
};

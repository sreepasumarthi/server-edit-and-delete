const getCrafts = async () => {
    try {
        return (await fetch("https://server-edit-and-delete-0kvg.onrender.com/api/crafts")).json();
    } catch (error) {
        console.log("error retrieving data");
        return "";
    }
};

const openModal = (craft) => {
    // Get references to modal elements
    const modal = document.getElementById("myModal");
    const modalTitle = document.getElementById("modal-title");
    const modalDescription = document.getElementById("modal-description");
    const modalSupplies = document.getElementById("modal-supplies");
    const modalImage = document.getElementById("modal-image");

    // Set modal content based on the current craft
    modalTitle.innerHTML = `<strong>${craft.name}</strong>`;
    modalDescription.textContent = craft.description;
    modalSupplies.innerHTML = "<strong>Supplies:</strong>";
    craft.supplies.forEach((supply) => {
        const listItem = document.createElement("li");
        listItem.textContent = supply;
        modalSupplies.appendChild(listItem);
    });
    modalImage.src = "https://server-edit-and-delete-0kvg.onrender.com/" + craft.img;

    // Display the modal
    modal.style.display = "block";

    // Define function to close the modal
    const closeModal = () => {
        modal.style.display = "none";
    };

    // Add event listener to close button
    const closeButton = document.getElementsByClassName("close")[0];
    closeButton.addEventListener("click", closeModal);

    // Add event listener to close modal when clicked outside of it
    window.addEventListener("click", (event) => {
        if (event.target == modal) {
            closeModal();
        }
    });

    // Get reference to the edit icon for the current craft
    const editIcon = modal.querySelector(".edit-icon");

    // Add onclick event to edit icon
    editIcon.onclick = () => {
        // Hide existing content inside the modal for the current craft
        modalTitle.style.display = "none";
        modalDescription.style.display = "none";
        modalSupplies.style.display = "none";
    
        // Show "hiii" message
        const message = document.createElement("p");
        message.textContent = "hiii";
        modal.appendChild(message);
    };
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

document.getElementById("img-prev").onerror = function() {
    this.src = 'https://place-hold.it/200x300';
};


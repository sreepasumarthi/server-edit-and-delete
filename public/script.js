document.addEventListener("DOMContentLoaded", function () {
    const fetchCrafts = async () => {
        try {
            return (await fetch("/api/crafts")).json();
        } catch (err) {
            console.log(err);
        }
    };

    const renderCrafts = async () => {
        let craftsData = await fetchCrafts();
        let container = document.getElementById("gallery-container");
        container.innerHTML = "";

        craftsData.forEach((craftData) => {
            const craftSection = document.createElement("section");
            craftSection.classList.add("craft-item");
            container.appendChild(craftSection);

            const craftLink = document.createElement("a");
            craftLink.href = "#";
            craftLink.addEventListener("click", () => showCraftDetails(craftData));
            craftSection.appendChild(craftLink);

            const craftImage = document.createElement("img");
            craftImage.src = `/${craftData.img}`;
            craftLink.appendChild(craftImage);
        });
    };

    const showCraftDetails = (craftData) => {
        openDialog("craft-details");

        const dialogDetails = document.getElementById("craft-details");
        dialogDetails.innerHTML = "";

        const craftTitle = document.createElement("h2");
        craftTitle.textContent = craftData.name;
        dialogDetails.appendChild(craftTitle);

        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = "&#9249";
        dialogDetails.appendChild(deleteButton);

        const editButton = document.createElement("button");
        editButton.innerHTML = "&#9998";
        dialogDetails.appendChild(editButton);

        const craftDescription = document.createElement("p");
        craftDescription.textContent = craftData.description;
        dialogDetails.appendChild(craftDescription);

        const craftImg = document.createElement("img");
        craftImg.src = `/${craftData.img}`;
        craftImg.alt = craftData.name;
        craftImg.style.maxWidth = "350px";
        craftImg.style.maxHeight = "300px";
        craftImg.style.width = "auto";
        craftImg.style.height = "auto";
        dialogDetails.appendChild(craftImg);

        const suppliesList = document.createElement("ul");
        craftData.supplies.forEach((supply) => {
            const listItem = document.createElement("li");
            listItem.textContent = supply;
            suppliesList.appendChild(listItem);
        });
        dialogDetails.appendChild(suppliesList);

        editButton.onclick = showEditCraftForm;
        deleteButton.onclick = deleteCraft.bind(this, craftData);
        populateEditForm(craftData);
    };

    const populateEditForm = (craftData) => {
        if (craftData) {
            const form = document.getElementById("add-craft-form");
            form._id.value = craftData._id;
            form.name.value = craftData.name;
            form.description.value = craftData.description;
            document.getElementById("img-preview").src = `/${craftData.img}`;
            populateSupplies(craftData.supplies);
        } else {
            console.log("Craft data is undefined");
        }
    };

    const populateSupplies = (supplies) => {
        const supplyBox = document.getElementById("supply-boxes");
        supplies.forEach((supply) => {
            const input = document.createElement("input");
            input.type = "text";
            input.value = supply;
            supplyBox.appendChild(input);
        });
    };

    const addOrEditCraft = async (event) => {
        event.preventDefault();
        const form = document.getElementById("add-craft-form");
        const formData = new FormData(form);
        let response;
        formData.append("supplies", getSupplies());

        if (form._id.value.trim() == "") {
            response = await fetch("/api/crafts", {
                method: "POST",
                body: formData,
            });
        } else {
            response = await fetch(`/api/crafts/${form._id.value}`, {
                method: "PUT",
                body: formData,
            });
        }

        if (response.status != 200) {
            console.log("Error adding or editing craft");
        }

        await response.json();
        resetForm();
        document.getElementById("dialog").style.display = "none";
        renderCrafts();
    };

    const deleteCraft = async (craftData) => {
        let response = await fetch(`/api/crafts/${craftData._id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            }
        });

        if (response.status != 200) {
            console.log("Error deleting craft");
            return;
        }

        let result = await response.json();
        resetForm();
        renderCrafts();
        document.getElementById("dialog").style.display = "none";
    };

    const getSupplies = () => {
        const inputs = document.querySelectorAll("#supply-boxes input");
        const supplies = [];

        inputs.forEach((input) => {
            supplies.push(input.value);
        });
        return supplies;
    };

    const resetForm = () => {
        const form = document.getElementById("add-craft-form");
        form.reset();
        form._id.value = "";
        document.getElementById("supply-boxes").innerHTML = "";
        document.getElementById("img-preview").src = "";
    };

    const showEditCraftForm = (event) => {
        openDialog("add-craft-form");

        if (event.target.getAttribute("id") != "edit-link") {
            resetForm();
        }
    };

    const addSupply = (event) => {
        event.preventDefault();
        const supplyBox = document.getElementById("supply-boxes");
        const input = document.createElement("input");
        input.type = "text";
        supplyBox.appendChild(input);
    };

    const openDialog = (id) => {
        document.getElementById("dialog").style.display = "block";
        document.querySelectorAll("#dialog-details > *").forEach((section) => {
            section.classList.add("hidden");
        });
        document.getElementById(id).classList.remove("hidden");
    };

    const cancelForm = () => {
        resetForm();
        document.getElementById("dialog").style.display = "none";
        renderCrafts();
    }

    renderCrafts();
    document.getElementById("add-craft-form").onsubmit = addOrEditCraft;
    document.getElementById("add-link").onclick = showEditCraftForm;
    document.getElementById("add-supply").onclick = addSupply;
    document.getElementById("cancel-button").onclick = cancelForm;

    document.getElementById("img").onchange = (event) => {
        if (!event.target.files.length) {
            document.getElementById("img-preview").src = "";
            return;
        }
        document.getElementById("img-preview").src = URL.createObjectURL(
            event.target.files.item(0)
        );
    };
});

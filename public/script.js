


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
        response = await fetch("https://server-get-post-n1ni.onrender.com/api/crafts", {
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


document.getElementById("img-prev").onerror = function() {
    this.src = 'https://place-hold.it/200x300';
};


// Edit Craft
$(document).on('click', '.edit-craft-button', function() {
    var craftId = $(this).data('craft-id');
    $.ajax({
      method: 'GET',
      url: '/crafts/' + craftId,
      success: function(data) {
        $('#edit-craft-id').val(data._id);
        $('#edit-craft-name').val(data.name);
        $('#edit-craft-description').val(data.description);
        // Populate other fields if needed
  
        // Show the edit modal
        $('#editModal').modal('show');
      },
      error: function(err) {
        console.log(err);
      }
    });
  });
  
  // Update Craft
  $('#edit-craft-form').submit(function(e) {
    e.preventDefault();
    var craftId = $('#edit-craft-id').val();
    var craftData = {
      name: $('#edit-craft-name').val(),
      description: $('#edit-craft-description').val()
      // Add other fields if needed
    };
    $.ajax({
      method: 'PUT',
      url: '/crafts/' + craftId,
      data: craftData,
      success: function(data) {
        // Close the modal
        $('#editModal').modal('hide');
        // Refresh craft list or update UI as needed
      },
      error: function(err) {
        console.log(err);
      }
    });
  });
  
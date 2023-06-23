// Function to display the selected image preview
function showPreview(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
      const imagePreview = document.getElementById("image-preview");
      imagePreview.src = e.target.result;
    };
    
    reader.readAsDataURL(file);
    
    // Enable the label markers
    const labelMarkers = document.getElementsByClassName("label-marker");
    for (let i = 0; i < labelMarkers.length; i++) {
      labelMarkers[i].style.display = "block";
    }
  }
  
  // Function to handle label marker selection
  function handleMarkerSelection(event) {
    const markerId = event.target.id;
    const marker = document.getElementById(markerId);
    
    const labelContainer = document.getElementById("label-container");
    const label = document.getElementById(markerId.replace("-marker", "-label"));
    
    label.style.top = `${marker.offsetTop}px`;
    label.style.left = `${marker.offsetLeft + marker.offsetWidth}px`;
    labelContainer.appendChild(label);
  }
  
  // Add event listeners
  const imageUpload = document.getElementById("image-upload");
  imageUpload.addEventListener("change", showPreview);
  
  const imageContainer = document.getElementById("image-container");
  imageContainer.addEventListener("click", handleMarkerSelection);
  
// Function to display the selected image preview
function showPreview(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
      const imagePreview = document.getElementById("image-preview");
      imagePreview.src = e.target.result;
    };
    
    reader.readAsDataURL(file);
    
    // Enable the label button
    const labelButton = document.getElementById("label-button");
    labelButton.disabled = false;
  }
  
  // Function to extract text from the image using pytesseract
  function extractText() {
    const imagePreview = document.getElementById("image-preview");
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    
    canvas.width = imagePreview.naturalWidth;
    canvas.height = imagePreview.naturalHeight;
    
    context.drawImage(imagePreview, 0, 0);
    
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = new FormData();
    
    canvas.toBlob(function(blob) {
      data.append("image", blob, "image.jpg");
    
      fetch("/extract", {
        method: "POST",
        body: data
      })
      .then(response => response.text())
      .then(result => {
        const textResult = document.getElementById("text-result");
        textResult.textContent = result;
      })
      .catch(error => {
        console.log(error);
        const textResult = document.getElementById("text-result");
        textResult.textContent = "An error occurred during text extraction.";
      });
    }, "image/jpeg");
  }
  
  // Add event listeners
  const imageUpload = document.getElementById("image-upload");
  imageUpload.addEventListener("change", showPreview);
  
  const labelButton = document.getElementById("label-button");
  labelButton.addEventListener("click", extractText);
  
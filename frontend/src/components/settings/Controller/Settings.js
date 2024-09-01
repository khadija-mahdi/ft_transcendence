import { fetchWithAuth } from "/lib/apiMock.js";
import { handleSubmit, Validator } from "/lib/Validator.js";

function ImageButton(setSelectedImage = () => { }) {
  let imageInput = document.getElementById("imageInput");
  const imageLabel = document.getElementById("imageLabel");
  const initialImageLabelContent = imageLabel.innerHTML;

  function CreateImagePreview(event) {
    const imageContainer = document.createElement("div");
    imageContainer.className = "image-preview-container";

    const imgElement = document.createElement("img");
    imgElement.src = event.target.result;
    imgElement.alt = "Selected";
    imgElement.className = "image-preview";

    const closeButton = document.createElement("div");
    closeButton.className = "close-button";
    closeButton.innerHTML =
      '<img src="/public/assets/icons/light_close.png" alt="close-icon" class="close-icon">';

    closeButton.addEventListener("click", () => {
      imageLabel.innerHTML = initialImageLabelContent;
      attachImageInputChange();
    });

    imageContainer.appendChild(imgElement);
    imageContainer.appendChild(closeButton);
    return imageContainer;
  }

  function handleImageInputChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    imageLabel.innerHTML = "";
    const reader = new FileReader();

    setSelectedImage(file);

    reader.onload = (event) => {
      imageLabel.appendChild(CreateImagePreview(event));
      imageLabel.style.color = "transparent";
    };
    reader.readAsDataURL(file);
  }

  function attachImageInputChange() {
    imageInput = document.getElementById("imageInput");
    imageInput.addEventListener("change", handleImageInputChange);
  }

  attachImageInputChange();
}



function PersonalInfoForm() {
  const form = document.getElementById("personal-info-form");

  const schema = {
    firstname: new Validator().required().string().min(5).max(50),
    lastname: new Validator().required().string().min(5).max(50),
    username: new Validator().required().string().min(5).max(50),
    imageInput: new Validator().required().costume((value) =>
      value.size <= 1000000 ? null : "Image must be less than 1MB")
  }

  ImageButton((selectedImage) => {
    console.log("Selected image: ", selectedImage);
  });

  form.addEventListener("submit", (event) => handleSubmit(event, schema, OnSubmit));
  function OnSubmit(formData) {
    console.log("Form data: ", formData);
  }
}

export default function () {
  PersonalInfoForm();
}

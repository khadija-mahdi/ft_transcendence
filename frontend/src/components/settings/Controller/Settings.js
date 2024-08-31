import { fetchWithAuth } from "/lib/apiMock.js";

let selectedImage = null;

function ImageButton(setSelectedImage = () => {}) {
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
      selectedImage = null;
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

function ValidateValue(value, regex, matchValue = null) {
  const test = regex.test(value);
  if (matchValue === null) return test;
  return test && value === matchValue;
}

function PersonalInfoForm() {
  const form = document.getElementById("personal-info-form");
  ImageButton((selectedImage) => {
    console.log("Selected image: ", selectedImage);
  });
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const firstname = formData.get("firstname");
    const lastname = formData.get("lastname");
    const username = formData.get("username");

    if (!ValidateValue(firstname, /^[a-zA-Z]+$/, null)) {
      
      return;
    }
  });
}

export default function () {
  PersonalInfoForm();
}

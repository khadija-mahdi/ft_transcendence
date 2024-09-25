import { fetchWithAuth } from "/src/lib/apiMock.js";
const html = String.raw;
export default function () {
  const form = document.getElementById("createTournamentForm");
  let imageInput = document.getElementById("imageInput");
  const imageLabel = document.getElementById("imageLabel");
  const errorElement = document.getElementById("error");
  const tr_errorElement = document.getElementById("rt-error");

  let selectedImage = null;

  // Get the current time
  const now = new Date();
  now.setHours(now.getHours() + 2);
  // Convert the time to a format suitable for input type="datetime-local"
  const formattedDateTime = now.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"
  document.getElementById("startDate").value = formattedDateTime;

  const initialImageLabelContent = imageLabel.innerHTML;
  function toggleMonetize() {
    const monetizeText = document.getElementById("monetizeText");
    const monetizeDesc = document.getElementById("monetizeDesc");
    const isMonetized = document.getElementById("isMonetized");
    const monetizeSwitch = document.querySelector(".switch-monet");

    if (isPublic.checked) {
      isMonetized.disabled = false;
      monetizeText.style.color = "#FFFFFF";
      monetizeDesc.style.color = "#FFFFFF";
      monetizeSwitch.style.opacity = "1";
    } else {
      isMonetized.disabled = true;
      isMonetized.checked = false;
      monetizeText.style.color = "gray";
      monetizeDesc.style.color = "gray";
      monetizeSwitch.style.opacity = "0.5";
    }
  }
  document
    .getElementById("isPublic")
    .addEventListener("change", toggleMonetize);

  function handleImageInputChange(e) {
    imageLabel.innerHTML = "";
    const file = e.target.files[0];
    if (!file) return;

    selectedImage = file;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageContainer = document.createElement("div");
      imageContainer.className = "image-preview-container";

      const imgElement = document.createElement("img");
      imgElement.src = event.target.result;
      imgElement.alt = "Selected";
      imgElement.className = "image-preview";

      const closeButton = document.createElement("div");
      closeButton.className = "close-button";
      closeButton.innerHTML = html`<img
        src="/public/assets/icons/light_close.png"
        alt="close-icon"
        class="close-icon"
      />`;

      closeButton.addEventListener("click", () => {
        selectedImage = null;
        imageLabel.innerHTML = initialImageLabelContent;
        reattachImageInputChange();
      });

      imageContainer.appendChild(imgElement);
      imageContainer.appendChild(closeButton);
      imageLabel.appendChild(imageContainer);
      imageLabel.style.color = "transparent";
    };
    reader.readAsDataURL(file);
  }

  function reattachImageInputChange() {
    imageInput = document.getElementById("imageInput");
    imageInput.addEventListener("change", handleImageInputChange);
  }

  reattachImageInputChange();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const description = document.getElementById("description").value;
    const maxPlayers = document.getElementById("maxPlayers").value;
    const startDate = document.getElementById("startDate").value;
    const isPublic = document.getElementById("isPublic").checked;
    const isMonetized = document.getElementById("isMonetized").checked;
    const inputTime = new Date(startDate);
    const currentTime = new Date();

    if (inputTime <= currentTime) {
      errorElement.textContent = "Please select a time in the future.";
      errorElement.style.color = "red";
      return;
    } else {
      errorElement.textContent = "";
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("start_date", startDate);
    formData.append("max_players", maxPlayers);
    formData.append("is_public", isPublic);
    formData.append("is_monetized", isMonetized);

    if (selectedImage) {
      formData.append("icon_file", selectedImage);
    }

    try {
      const res = await fetchWithAuth(
        "/api/v1/game/Tournament/",
        {
          method: "POST",
          body: formData,
        },
        false
      );
      window.location.href = "/home";
    } catch (error) {
      errorElement.textContent =
        "An error occurred while creating the tournament.";
      errorElement.style.color = "red";
    }
  });
}

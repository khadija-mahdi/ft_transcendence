import { fetchWithAuth, destroyCookies } from "/src/lib/apiMock.js";
import { handleSubmit, Validator, reset } from "/src/lib/Validator.js";
import { updateProfile, UserDetailByUsername } from "/src/_api/user.js";
const html = String.raw;

let data = {};
async function UpdateData(UpdateData, schema) {
  try {
    await updateProfile(UpdateData);
    window.location.reload()
  } catch (error) {
    document.getElementById("security-error-message").innerHTML =
      JSON.parse(error.message)?.message || error.message;
  } finally {
    reset(schema);
    for (let key in UpdateData) data[key] = UpdateData[key] || data[key];
    SetPersonalInfo();

  }
}

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
    closeButton.innerHTML = html`<img
      src="/public/assets/icons/light_close.png"
      alt="close-icon"
      class="close-icon"
    />`;

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

function SetPersonalInfo() {
  const { first_name, last_name, username, enabled_2fa, email } = data;
  document.getElementById("first_name").placeholder =
    first_name || "First Name";
  document.getElementById("last_name").placeholder = last_name || "Last Name";
  document.getElementById("username").placeholder = `@${username}`;
  document.getElementById("email").placeholder = email;
  document.getElementById("enable-2fa").checked = enabled_2fa;
}

function PersonalInfoForm() {
  const form = document.getElementById("personal-info-form");
  let image = null;
  const schema = {
    first_name: new Validator().string().max(50),
    last_name: new Validator().string().max(50),
    username: new Validator().string().max(50),
    imageInput: new Validator().costume((value) =>
      value
        ? value.size <= 1000000
          ? null
          : "Image must be less than 1MB"
        : null
    ),
  };

  ImageButton((selectedImage) => {
    image = selectedImage;
  });

  form.addEventListener("submit", (event) =>
    handleSubmit(event, schema, (formData) => {
      if (image) formData["image_file"] = image;
      UpdateData(formData);
    })
  );
}

function AccountSecurityForm() {
  const form = document.getElementById("account-security-form");

  const schema = {
    email: new Validator().required().string().min(5).max(50).email(),
  };

  form.addEventListener("submit", (event) =>
    handleSubmit(event, schema, UpdateData)
  );

  document
    .getElementById("enable-2fa")
    .addEventListener("change", (event) =>
      UpdateData({ enabled_2fa: event.target.checked })
    );
  document.getElementById("logout-btn").addEventListener("click", async () => {
    destroyCookies();
    window.location.href = "/auth/";
  });
}

function ChangePasswordForm() {
  const form = document.getElementById("change-password-form");

  const schema = {
    old_password: new Validator().string().required("password is required"),
    new_password: new Validator()
      .required()
      .string()
      .min(8)
      .matches(/[a-z]/, "password must have at least one lowercase letter")
      .matches(/[A-Z]/, "password must have at least one uppercase letter")
      .matches(/\d/, "password must have at least one digit")
      .matches(
        /[!@#$%^&*]/,
        "password must have at least one special character"
      ),
    confirmPassword: new Validator()
      .required()
      .string()
      .min(8)
      .oneOf("new_password", "password does not match"),
  };

  form.addEventListener("submit", (event) =>
    handleSubmit(event, schema, UpdatePassword)
  );

  async function UpdatePassword(data) {
    try {
      await fetchWithAuth("/api/v1/users/change-password/", {
        method: "PUT",
        body: JSON.stringify(data),
      });
    } catch (error) {
      document.getElementById("error-message").innerHTML = error.message;
    } finally {
      reset(schema);
      window.location.reload()
    }
  }
}

export default async function () {
  data = await UserDetailByUsername("me");
  SetPersonalInfo();
  PersonalInfoForm();
  AccountSecurityForm();
  ChangePasswordForm();
}

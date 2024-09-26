import {
  OAuthSingIn,
  handleOAuthLogin,
} from "/src/components/auth/Controller/sing_in.js";
import { API_URL } from "/config.js";

export async function SingUP() {
  const email_input = document.getElementById("email");
  const errorMessage = document.querySelector(".error-message"); // Select the error message span
  let continueButton = document.getElementById("cont");
  errorMessage.textContent = "";
  continueButton.disabled = true;
  continueButton.textContent = "Loading ...";
  fetch(`https://${API_URL}/api/v1/auth/register-email/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email_input.value }),
  })
    .then((response) => {
      if (response.ok) {
        sessionStorage.setItem("signUpStep", "emailEntered");
        history.pushState(
          null,
          null,
          `/auth/register/verify/?email=${email_input.value}`
        );
        window.location.reload();
      } else {
        return response.json().then((data) => {
          throw new Error(data.detail);
        });
      }
    })
    .catch((error) => {
      errorMessage.textContent = error;
    })
    .finally(() => {
      continueButton.disabled = false;
      continueButton.textContent = "Continue";
    });
}

export default async function init() {
  const continueButton = document.getElementById("cont");
  if (continueButton) {
    continueButton.addEventListener("click", async function (event) {
      event.preventDefault();
      await SingUP();
    });
  }
  await OAuthSingIn();
  if (window.location.search.includes("code")) {
    await handleOAuthLogin();
  }
}

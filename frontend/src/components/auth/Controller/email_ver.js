import { API_URL } from "/config.js";

export default function init() {
  const continueButton = document.getElementById("contInfo");
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const email = params.get("email"); // 'John'

  if (email === null) {
    history.pushState(null, null, `/auth/register/`);
    window.location.reload();
  }

  if (continueButton) {
    continueButton.addEventListener("click", function (event) {
      event.preventDefault();
      const errorMessage = document.querySelector(".error-message");
      const input1 = document.getElementById("input1").value;
      const input2 = document.getElementById("input2").value;
      const input3 = document.getElementById("input3").value;
      const input4 = document.getElementById("input4").value;

      const verificationCode = `${input1}${input2}${input3}${input4}`;
      errorMessage.textContent = "";
      continueButton.disabled = true;
      continueButton.textContent = "Loading ...";
      fetch(`/api/v1/auth/verify-email/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, code: verificationCode }),
      })
        .then((response) => {
          if (response.ok) {
            sessionStorage.setItem("signUpStep", "emailVerified");
            history.pushState(null, null, `/auth/register/user-info/?email=${email}`);
            window.location.reload();
          } else {
            return response.json().then((data) => {
              throw new Error(
                data.message || `HTTP error! Status: ${response.status}`
              );
            });
          }
        })
        .catch((error) => {
          errorMessage.textContent = `code not correct`;
          return;
        })
        .finally(() => {
          continueButton.disabled = false;
          continueButton.textContent = "Continue";
        });
    });
  }
}

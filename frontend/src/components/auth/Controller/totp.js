import { API_URL } from "/config.js";

export default function init() {
  const continueButton = document.getElementById("code_2fa");
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const email = params.get("email"); // 'John'

  if (continueButton) {
    continueButton.addEventListener("click", async function (event) {
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
      try {
        const response = await fetch("/api/v1/auth/token/verify-2fa/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            code: verificationCode,
          }),
        });

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        console.log("data =====>:", data);
        document.cookie = `access=${data.access};path=/;`;
        document.cookie = `refresh=${data.refresh};path=/;`;
        history.pushState(null, null, "/");
        window.location.reload();
      } catch (error) {
        errorMessage.textContent = `An error occurred when trying to log in. Please make sure you have the right access.`;
      }
    });
  }
}

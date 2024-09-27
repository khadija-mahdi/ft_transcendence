import { API_URL } from "/config.js";
import { showPopup } from "/src/lib/Confirm.js";

export const oauth2Providers = [
  {
    provider: "google",
    AuthUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ].join(" "),
    client_id:
      "961836788397-1dtpd57hqaqknhl3fduuqpbnck61858a.apps.googleusercontent.com",
  },
  {
    provider: "intra",
    AuthUrl: "https://api.intra.42.fr/oauth/authorize",
    scope: "public",
    client_id:
      "u-s4t2ud-6e6c75bfe05b1647e429446aa73743e845e04725e89a050e508d86cf3b08a3f9",
  },
];

export function handleGoogleLogin() {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: oauth2Providers[0].client_id,
    redirect_uri: `https://${API_URL}/auth/`,
    prompt: "select_account",
    access_type: "offline",
    state: oauth2Providers[0].provider,
    scope: oauth2Providers[0].scope,
  });
  const url = `${oauth2Providers[0].AuthUrl}?${params}`;
  window.location.href = url;
}

function handleIntraLogin() {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: oauth2Providers[1].client_id,
    redirect_uri: `https://${API_URL}/auth/`,
    prompt: "select_account",
    access_type: "offline",
    state: oauth2Providers[1].provider,
    scope: oauth2Providers[1].scope,
  });
  const url = `${oauth2Providers[1].AuthUrl}?${params}`;
  window.location.href = url;
}

export async function OAuthSingIn() {
  const googleAuthButton = document.getElementById("googleAuth");
  const intraAuthButton = document.getElementById("intraAuth");
  if (googleAuthButton && API_URL === 'localhost:443') {
    googleAuthButton.addEventListener("click", function () {
      handleGoogleLogin();
    });
  }
  if (intraAuthButton) {
    intraAuthButton.addEventListener("click", function () {
      handleIntraLogin();
    });
  }
}

export async function handleOAuthLogin() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  const provider = params.get("state");
  const continueButton = document.getElementById("conIn");
  const errorMessage = document.querySelector(".error-message");
  errorMessage.textContent = "";
  continueButton.disabled = true;
  continueButton.textContent = "Loading ...";

  if (code && provider) {
    try {
      const response = await fetch(`/api/v1/auth/${provider}/?code=${code}`);
      const data = await response.json();
      console.log("data ", data);

      if (!response.ok) throw new Error(`${data.error}`);

      if ((!data.access || !data.refresh) && data.email) {
        history.pushState(null, null, `/auth/2fa?email=${data.email}`);
        window.location.reload();
        return;
      }

      document.cookie = `access=${data.access};path=/;`;
      document.cookie = `refresh=${data.refresh};path=/;`;
      history.pushState(null, null, "/");
      window.location.reload();
    } catch (error) {
      errorMessage.textContent = `An error occurred when trying to log in. Please make sure you have the right access.`;
      return;
    }
    continueButton.disabled = false;
    continueButton.textContent = "Continue";
  }
}

export async function SingIn() {
  const continueButton = document.getElementById("conIn");
  const email_input = document.getElementById("email");
  const password_input = document.getElementById("password");
  const errorMessage = document.querySelector(".error-message");

  errorMessage.textContent = "";
  continueButton.disabled = true;
  continueButton.textContent = "Loading ...";

  try {
    const response = await fetch("/api/v1/auth/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email_input.value,
        password: password_input.value,
      }),
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    if (!data.access || !data.refresh) {
      history.pushState(null, null, `/auth/2fa?email=${email_input.value}`);
      window.location.reload();
      return;
    }

    document.cookie = `access=${data.access};path=/;`;
    document.cookie = `refresh=${data.refresh};path=/;`;
    history.pushState(null, null, "/");
    window.location.reload();
  } catch (error) {
    errorMessage.textContent = `The username or password you entered is incorrect`;
  }
  continueButton.disabled = false;
  continueButton.textContent = "Continue";
}

export default async function init() {
  const continueButton = document.getElementById("conIn");
  continueButton.addEventListener("click", async function (event) {
    event.preventDefault();
    await SingIn();
  });

  await OAuthSingIn();
  if (window.location.search.includes("code")) {
    await handleOAuthLogin();
  }
}

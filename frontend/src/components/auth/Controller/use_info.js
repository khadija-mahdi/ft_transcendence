import { API_URL } from "/config.js";
export default function init() {
	const url = new URL(window.location.href);
	const params = new URLSearchParams(url.search);
	const email = params.get("email"); // Get the email from query params
	if (email === null) {
		history.pushState(null, null, `/sign_up`);
		window.location.reload();
	}

	const continueButton = document.getElementById("doneUp");
	if (continueButton) {
		continueButton.addEventListener("click", function (event) {
			event.preventDefault();

			const errorMessage = document.querySelector(".error-message"); // Select the error message span
			const values = check_input(); // Get validation results

			if (values.error) {
				errorMessage.textContent = values.error; // Display validation error
				return;
			}

			errorMessage.textContent = "";
			continueButton.disabled = true;
			continueButton.textContent = "Loading ...";

			fetch(`/api/v1/auth/register-user/`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username: values.username,
					password: values.password,
					email: email,
				}),
			})
				.then((response) => {
					if (response.ok) {
						sessionStorage.setItem("signUpStep", "infoEntered");
						history.pushState(null, null, `/auth/`);
						window.location.reload();
					} else {
						return response.json().then((data) => {
							throw new Error(data.message || `${data.detail}`);
						});
					}
				})
				.catch((error) => {
					errorMessage.textContent = `Error: ${error.message}`; // Display fetch error
				})
				.finally(() => {
					continueButton.disabled = false;
					continueButton.textContent = "Continue";
				});
		});
	} else {
		return;
	}
}

const check_input = () => {
	const user_input = document.getElementById("username");
	const password_input = document.getElementById("password");
	const confirm_input = document.getElementById("confirm_password");
	const username = user_input.value;
	const password = password_input.value;
	const confirm = confirm_input.value;
	if (username.length === 0) {
		return { error: "Username is required" };
	}
	if (password.length === 0) {
		return { error: "Password is required" };
	}
	if (password !== confirm) {
		return { error: "Passwords do not match" };
	}
	if (password.length < 8) {
		return { error: "Password must be at least 8 characters long" };
	}
	if (!/[A-Z]/.test(password)) {
		return { error: "Password must contain at least one uppercase letter" };
	}
	return { username, password };
};

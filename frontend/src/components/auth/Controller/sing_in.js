
const SingIn = async () => {
	const continueButton = document.getElementById('conIn');
	const email_input = document.getElementById('email');
	const password_input = document.getElementById('password')
	const errorMessage = document.querySelector('.error-message');

	errorMessage.textContent = '';
	continueButton.disabled = true;
	continueButton.textContent = 'Loading ...'

	try {
		const response = await fetch('https://localhost:4433/api/v1/auth/token/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email: email_input.value, password: '' }),
		});

		if (!response.ok)
			throw new Error(`HTTP error! status: ${response.status}`);

		const data = await response.json();
		if (!data.access || !data.refresh) {
			history.pushState(null, null, '/sign_in_2fa');
			window.location.reload();
			return;
		}

		document.cookie = `access=${data.access};` // path=/; Secure; HttpOnly
		document.cookie = `refresh=${data.refresh};`
		history.pushState(null, null, '/');
		window.location.reload();

	} catch (error) {
		errorMessage.textContent = `The username or password you entered is incorrect`;
	}
	continueButton.disabled = false;
	continueButton.textContent = 'Continue'
}


export default async function init() {
	const continueButton = document.getElementById('conIn');
		continueButton.addEventListener('click', async function (event) {
			event.preventDefault();
			await SingIn();
		});

	await GoogleSignIn();
	if (window.location.search.includes('code')) {
		await handleOAuthLogin();
	}
}

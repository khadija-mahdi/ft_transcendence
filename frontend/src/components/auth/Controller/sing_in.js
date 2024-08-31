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
			"u-s4t2ud-c06179a32fed22ed0c6c8cbebc12db1e4e59d0015b162c5bb93f2f53f21d2770",
	},
];

function handleGoogleLogin() {
	const params = new URLSearchParams({
		response_type: "code",
		client_id: oauth2Providers[0].client_id,
		redirect_uri: `https://localhost:4433/auth/`,
		prompt: 'select_account',
		access_type: 'offline',
		state: oauth2Providers[0].provider,
		scope: oauth2Providers[0].scope,
	});
	console.log("prams: ", params)
	const url = `${oauth2Providers[0].AuthUrl}?${params}`;
	window.location.href = url;
}

export async function GoogleSignIn() {
	const googleAuthButton = document.getElementById('googleAuth');

	if (googleAuthButton) {
		googleAuthButton.addEventListener('click', function () {
			handleGoogleLogin();
		});
	} else {
		console.log("googleAuthButton not found");
	}
}



async function handleOAuthLogin() {
	const params = new URLSearchParams(window.location.search);
	const code = params.get("code");
	const provider = params.get("state");

	if (code && provider) {
		try {
			const response = await fetch(`https://localhost:4433/api/v1/auth/${provider}/?code=${code}`, {
				method: 'GET',
			});
			if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
			const data = await response.json();

			if (data.access && data.refresh) {
				document.cookie = `access=${data.access};path=/;`;
				document.cookie = `refresh=${data.refresh};path=/;`;
				history.pushState(null, null, '/');
				window.location.reload();

			} else {
				console.error('Authentication failed');
			}
		} catch (error) {
			console.error('Error during authentication:', error);
		}
	} else {
		console.error('Code or provider is missing in the callback URL');
	}
}

export async function SingIn() {
	const continueButton = document.getElementById('conIn');
	const email_input = document.getElementById('email');
	const password_input = document.getElementById('password')
	const errorMessage = document.querySelector('.error-message');

	errorMessage.textContent = '';
	continueButton.disabled = true;
	continueButton.textContent = 'Loading ...';

	try {
		const response = await fetch('https://localhost:4433/api/v1/auth/token/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email: email_input.value, password: password_input.value }),
		});

		if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

		const data = await response.json();
		if (!data.access || !data.refresh) {
			history.pushState(null, null, '/sign_in_2fa');
			window.location.reload();
			return;
		}

		document.cookie = `access=${data.access};path=/;`;
		document.cookie = `refresh=${data.refresh};path=/;`;
		history.pushState(null, null, '/');
		window.location.reload();

	} catch (error) {
		errorMessage.textContent = `The username or password you entered is incorrect`;
	}
	continueButton.disabled = false;
	continueButton.textContent = 'Continue';
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

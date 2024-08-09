export default function init() {
	const continueButton = document.getElementById('cont');
	if (continueButton) {
		continueButton.addEventListener('click', function(event) {
			event.preventDefault();

			const email_input = document.getElementById('email');
			const errorMessage = document.querySelector('.error-message'); // Select the error message span
			// Clear any previous error messages
			errorMessage.textContent = '';
			continueButton.disabled = true;
			continueButton.textContent = 'Loading ...'
			fetch('http://localhost:8000/api/v1/auth/register-email/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email: email_input.value }),
			})
			.then(response => {
				if (response.ok) {
					console.log('Success:', response);
					history.pushState(null, null, `/sign_up_email?email=${email_input.value}`);
					window.location.reload();
				} else {
					return response.json().then(data => {
						throw new Error(data.message || `HTTP error! Status: ${response.status}`);
					});
				}
			})
			.catch(error => {
				errorMessage.textContent = `Pleas correct you email form`;
				console.error('Error:', error);
			}).finally(()=>{
				continueButton.disabled = false;
				continueButton.textContent = 'Continue'
			})


		});
	} else {
		console.log("continueButton not found");
	}
}

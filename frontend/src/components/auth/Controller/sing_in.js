export default function init() {
	const continueButton = document.getElementById('conIn');
	if (continueButton) {
		continueButton.addEventListener('click', function(event) {
			event.preventDefault();
			const email_input = document.getElementById('email');
			const password_input = document.getElementById('password')
			const errorMessage = document.querySelector('.error-message'); // Select the error message span
			// Clear any previous error messages
			errorMessage.textContent = '';
			continueButton.disabled = true;
			continueButton.textContent = 'Loading ...'
			fetch('http://localhost:8000/api/v1/auth/token/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email: email_input.value, password: password_input.value}),
			})
			.then(response => {
				if (response.ok) {
					console.log('Success:', response);
					response.json().then(data => {
						console.log("response:", data)
						if (data.access && data.refresh){
							document.cookie = `access=${data.access};` // path=/; Secure; HttpOnly
							document.cookie = `refresh=${data.refresh};`
							history.pushState(null, null, '/'); 
							window.location.reload();
						}
						else{
							history.pushState(null, null, '/sign_in_2fa'); 
							window.location.reload();
						}
					})
				} else {
					return response.json().then(data => {
						throw new Error(data.message || `HTTP error! Status: ${response.status}`);
					});
				}
			})
			.catch(error => {
				errorMessage.textContent = `The username or password you entered is incorrect`;
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

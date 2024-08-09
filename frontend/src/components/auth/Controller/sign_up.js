export default function init() {
	const continueButton = document.getElementById('cont');
	if (continueButton) {
		continueButton.addEventListener('click', function(event) {
			event.preventDefault(); 
			history.pushState(null, null, '/sign_up_email'); 
			window.location.reload();
		});
	} else {
		console.log("continueButton not found");
	}
}

export default function init() {
	const continueButton = document.getElementById('contInfo');
	if (continueButton) {
		continueButton.addEventListener('click', function(event) {
			event.preventDefault(); 
			history.pushState(null, null, '/sign_up_info'); 
			window.location.reload();
		});
	}
}

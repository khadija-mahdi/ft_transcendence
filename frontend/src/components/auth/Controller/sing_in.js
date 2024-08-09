export default function init() {
	const continueButton = document.getElementById('conIn');
	if (continueButton) {
		continueButton.addEventListener('click', function(event) {
			event.preventDefault(); 
			history.pushState(null, null, '/'); 
			window.location.reload();
		});
	} else {
		console.log("continueButton not found");
	}
}

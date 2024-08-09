export const Sing_upUI = () => {
    loadCSS('components/auth/auth.css');

    return /*html*/`
		<div class= "auth">
		<div class="auth-container">
			<h1 id=tr >Join Transcendent</h1>
			<form id="authForm" class="auth-form">
				<div class="social-auth">
					<div class="social-auth-option intra">
						<img id = "intra" src="components/auth/42_logo.svg" alt="intra logo">
						<p class= sing>Continue with Intra</p>
					</div>
					<div class="social-auth-option google">
						<img src="components/auth/google.svg" alt="intra logo">
						<p class=sing>Continue with Google</p>
					</div>
				</div>
				<div class="divider">
					<span>OR</span>
				</div>
				<div class="form-input">
					<label for="email">Email address</label>
					<input type="email" id="email" name="email" placeholder="john@gmail.com">
					<span class="error-message"></span>
				</div>
				<button id="cont" type="submit" class="submit-btn">Continue</button>
				</form>
				</div>
				<p id="privacy">
					By continuing, you agree to Transcendent's  
					<a href="/terms-of-service" target="_blank">Terms of Service</a> and 
					<a href="/privacy-policy" target="_blank">Privacy Policy</a>.
				</p>
		</div>
    </div>
    `;
};

function loadCSS(href) {
    let link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
}


export default () => {
	console.log("Sign up page");
    const Sing_up_ui = Sing_upUI();
	document.body.insertAdjacentHTML('beforeend',Sing_up_ui); 
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
	return '<div></div>';
};

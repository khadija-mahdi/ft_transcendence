
export const userInfo  = () => {
    loadCSS('components/auth/auth.css');

    return /*html*/`
		<div class= "auth">
		<div class="auth-container">
			<h1 id=tr >Your Information</h1>
			<form id="authForm" class="auth-form">
				<div class="form-input">
					<label for="username">Username</label>
					<input type="text" id="username" name="username" placeholder="Jon Doe">
					<span class="error-message"></span>
				</div>
				<div class="form-input">
					<label for="password">Password</label>
					<input type="password" id="password" name="password" placeholder="**********">
					<span class="password-toggle-icon"><i class="fas fa-eye"></i></span>
					<span class="error-message"></span>
				</div>
				<div class="form-input">
					<label for="password">Confirm Password</label>
					<input type="password" id="password" name="password" placeholder="**********">
					<span class="password-toggle-icon"><i class="fas fa-eye"></i></span>
					<span class="error-message"></span>
				</div>
				<button id="doneUp" type="submit" class="submit-btn">Continue</button>
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
    const user_info = userInfo();
	document.body.insertAdjacentHTML('beforeend',user_info); 
	const continueButton = document.getElementById('doneUp');
	if (continueButton) {
		continueButton.addEventListener('click', function(event) {
			event.preventDefault(); 
			history.pushState(null, null, '/'); 
			window.location.reload();
		});
	} else {
		console.log("continueButton not found");
	}
	return '<div></div>';
};
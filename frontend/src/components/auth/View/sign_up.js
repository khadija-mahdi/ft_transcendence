export default () => {

	return /*html*/`
		<div class= "auth">
		<div class="auth-container">
			<h1 id=tr >Join Transcendent</h1>
			<form id="authForm" class="auth-form">
				<div class="social-auth">
					<div class="social-auth-option intra" id="intraAuth">
						<img src="/public/assets/42_logo.svg" alt="intra logo">
						<p class= sing>Continue with Intra</p>
					</div>
					<div class="social-auth-option google" id="googleAuth">
						<img src="/public/assets/google.svg" alt="intra logo">
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

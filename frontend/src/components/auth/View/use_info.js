import {loadCSS} from '../../../lib/loadcss.js'

export default () => {
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

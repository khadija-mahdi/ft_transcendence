import { loadCSS } from "../../../lib/loadcss.js";

export default () => {
    loadCSS('components/auth/auth.css');
	
    return /*html*/`
		<div class= "auth">
		<div class="auth-container">
			<h1 id=tr >Verify Email</h1>
			<form id="authForm" class="auth-form"> 
				<label id="privacy" for="number">Entre the Verification Code</label>
				<div class="input-group">
					<input type="text" id="input1" maxlength="1" class="verification-input" placeholder="--" />
					<input type="text" id="input2" maxlength="1" class="verification-input" placeholder="--" />
					<input type="text" id="input3" maxlength="1" class="verification-input" placeholder="--" />
					<input type="text" id="input4" maxlength="1" class="verification-input" placeholder="--" />
				</div>
				<button id="contInfo" type="submit" class="submit-btn">Continue</button>
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


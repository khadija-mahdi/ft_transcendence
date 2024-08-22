export default function () {
	return /*html*/`
	<div class="flex justify-center items-center">
		<div class="create-tr-container">
			<div class="create-tr-title">Create new Chat Group</div>
			<div class="create-tr-subtitle">
				Create a chart group and have fun talking with your friends.
			</div>

			<form class="create-form-container" id="createTournamentForm">
				<div id="imageLabel" class="image-upload-container">
					<label class="image-label">

						<div class="upload-icon">
							<svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<rect x="1" y="0.499512" width="23" height="23" rx="3.5" stroke="#575757" />
								<path d="M12.5004 14.9469V19.9995M12.5004 14.9469L14.1004 16.6311M12.5004 14.9469L10.9004 16.6311" stroke="#878787" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
								<path d="M20.5 12.7178C20.5 14.6909 19.3448 16.3835 17.7 17.1027M14.4048 8.23277C14.8947 8.05308 15.41 7.96169 15.9288 7.96246C16.452 7.96246 16.9552 8.05425 17.4248 8.22267M17.4248 8.22267C17.1696 5.84709 15.2328 3.99951 12.8808 3.99951C10.356 3.99951 8.3096 6.12835 8.3096 8.75488C8.30896 9.31905 8.40489 9.87873 8.5928 10.4071M17.4248 8.22267C18.1271 8.47604 18.7605 8.90518 19.2704 9.4732M8.5928 10.4071C8.37403 10.3623 8.15167 10.3398 7.9288 10.3397C6.0352 10.3406 4.5 11.9372 4.5 13.9069C4.5 15.5035 5.5088 16.8551 6.9 17.3098M8.5928 10.4071C9.03544 10.4976 9.4568 10.679 9.8328 10.941" stroke="#878787" stroke-width="1.5" stroke-linecap="round" />
							</svg>
						</div>
						<div class="upload-text" >
							<strong style="color: #FFFFFF !important;">Click to upload</strong>
							<span class="text-muted">or drag and drop</span>
						</div>
						<div class="text-muted">SVG, PNG, JPG or GIF (max. 800x400px)</div>
						<input type="file" id="imageInput" class="hidden" accept="image/*">
					</label>
				</div>

				<div class="form-group">
					<div style="padding: 10px 0">
						<label for="name">Name *</label>
					</div>
					<input type="text" id="name" class="form-input" placeholder="New Group Name" required />
				</div>
				<a class="toggle-group" href="/messages/group/choice-members">
					<div>
						<strong style="color: #FFFFFF !important;">Add Users</strong>
						<div class="toggle-text">
							<span class="text-muted">list of all users that you added to this group</span>
						</div>
					</div>
					<div class="right-arr" href="/messages/group/choice-members">
						<svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M9 5.49951L16 12.4995L9 19.4995" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
						</svg>
					</div>
				</a>
				<div id="added-group-members">
					<!-- List of group members will be dynamically added here -->

				</div>
				<div class="button-group">
					<p id="tr-error" class="error-text"></p>
					<button type="button" class="btn cancel">Cancel</button>
					<button type="submit" class="btn create play_now_button ">Create</button>
				</div>
			</form>
		</div>
	</div>
	`;
};

export default function () {
	return /*html*/`
	<div class="OnlinePlayers-container">
		<div class="search-bar">
			<div class="search-bar-container">
				<textarea
					class="search-bar-textarea"
					placeholder="Type Name of User"
					id="searchInput"
				></textarea>
				<div class="search-bar-icon">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" fill="none">
						<path
							fill="#878787"
							d="M15.5 14.556h-.79l-.28-.27a6.47 6.47 0 0 0 1.57-4.23 6.5 6.5 0 1 0-6.5 6.5c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99 1.49-1.49-4.99-5Zm-6 0c-2.49 0-4.5-2.01-4.5-4.5s2.01-4.5 4.5-4.5 4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5Z"
						/>
					</svg>
				</div>
			</div>
		</div>
		<h4 style='color: white;padding: 10px; '>pending invitations </h4>
		<div>
			<div id="invitations-container"></div>
		</div>
		<h4 style='color: white;padding: 10px;'>Recommended Users: </h4>
		<div>
			<div id="OnlinePlayers-container"></div>
		</div>
	</div>
    `;
};

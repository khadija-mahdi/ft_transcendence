const html = String.raw;

export default function () {
  return html`
	<div id="chat-container" class="chat-container">
		<div id="main-panel" class="main-panel">
			<div id="rooms" class="room-panel">
				<div class="search-bar-container">
					<div class="search-bar">
						<textarea class="search-input" placeholder="Search..." id="searchInput"></textarea>
						<div class="search-icon">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width='24'
								height='25'
								fill="none"
							>
								<path
									fill="#878787"
									d="M15.5 14.556h-.79l-.28-.27a6.47 6.47 0 0 0 1.57-4.23 6.5 6.5 0 1 0-6.5 6.5c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99 1.49-1.49-4.99-5Zm-6 0c-2.49 0-4.5-2.01-4.5-4.5s2.01-4.5 4.5-4.5 4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5Z"
								/>
							</svg>
						</div>
						<div class="filter-button" id="filterButton">
							<!-- <a href="/messenger/group">
								<svg className="" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
									<path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M4.5 17H4a1 1 0 0 1-1-1 3 3 0 0 1 3-3h1m0-3.05A2.5 2.5 0 1 1 9 5.5M19.5 17h.5a1 1 0 0 0 1-1 3 3 0 0 0-3-3h-1m0-3.05a2.5 2.5 0 1 0-2-4.45m.5 13.5h-7a1 1 0 0 1-1-1 3 3 0 0 1 3-3h3a3 3 0 0 1 3 3 1 1 0 0 1-1 1Zm-1-9.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z" />
								</svg>
							</a> -->
							<button  id="filter" class="filter" >
								<svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M10.33 17.4818H4.0293" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
									<path d="M13.1406 7.78934H19.4413" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
									<path fill-rule="evenodd" clip-rule="evenodd" d="M8.72629 7.73517C8.72629 6.43951 7.66813 5.38892 6.36314 5.38892C5.05816 5.38892 4 6.43951 4 7.73517C4 9.03083 5.05816 10.0814 6.36314 10.0814C7.66813 10.0814 8.72629 9.03083 8.72629 7.73517Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
									<path fill-rule="evenodd" clip-rule="evenodd" d="M20.0002 17.4427C20.0002 16.147 18.9429 15.0964 17.6379 15.0964C16.3321 15.0964 15.2739 16.147 15.2739 17.4427C15.2739 18.7383 16.3321 19.7889 17.6379 19.7889C18.9429 19.7889 20.0002 18.7383 20.0002 17.4427Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
								</svg>							
							</button>
						</div>
					</div>
					<div id="messenger-container" class="messenger-list">
						<!-- Messenger items will be dynamically added here -->
					</div>

				</div>
			</div>
			<div id="chat-panel" class="chat-panel">
				<div id="chat-header" class="chat-header">
					<div class="messenger-title">Messenger</div>
					<div class="messenger-subtitle">
						Send and receive messages without keeping your phone online.
					</div>
					<div class="messenger-subtitle">
						Use Messenger Transcendent on your PC.
					</div>
				</div>
			</div>
		</div>
		<div id="popup-sendImage-container" class="popup-sendImage-overlay hidden">
			<div class="popup-sendImage-content">
				<div class="popup-sendImage-header">
					<h3 id="popup-sendImage-title">Send Image</h3>
					<button id="popup-sendImage-close" class="close-button">&times;</button>
				</div>
				<div class="popup-sendImage-body">
					<img id="popup-sendImage-preview"
					onerror="this.src='/public/assets/images/defaultImageProfile.jpeg';"
					alt="Preview" style="width: 100%; border-radius: 8px;">
					<p id="popup-sendImage-error" class="hidden" style="color: red; text-align: center; margin-top: 10px;">
						The File or Image you are trying to upload is not acceptable. Please use PNG or JPEG formats only.
					</p>
				</div>
				<div class="popup-sendImage-footer">
					<button id="popup-sendImage-cancel" class="popup-sendImage-button cancel-button">Cancel</button>
					<button id="popup-sendImage-confirm" class="popup-sendImage-button confirm-button">Send</button>
				</div>
			</div>
		</div>

	</div>
	</div>
	`;
}

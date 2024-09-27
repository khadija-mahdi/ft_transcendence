const html = String.raw;

export default function profileView() {
	return html`
		<div class="container">
			<div class="profile-header">
				<img
					src="https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg"
					alt="bg image"
					class="header-img"
				/>
				<div class="overlay"></div>

				<div class="header-content">
					<div class="profile-page-info">
						<div class="profile-pic">
							<img
								id="profile-pic"
								alt="profile"
								onerror="this.src='/public/assets/images/defaultImageProfile.jpeg';"
							/>
						</div>
						<div class="p-profile-details">
							<div class="p-profile-name-container">
								<h6 class="p-profile-name" id="profile-name"></h6>
								<p class="p-profile-username" id="p-profile-username-label">
								</p>
							</div>
							<div id="profile-cta-container">
								<!-- CTA -->
							</div>
						</div>
					</div>

					<div class="header-info">
						<div class="rank-achievements">
							<div class="rank">
								<h6>RANK</h6>
								<div class="rank-details">
									<img
										id="rank-icon"
										alt="profile"
										onerror="this.src='/public/assets/icons/unranked.png';"
									/>
									<p id="rank-title"></p>
								</div>
							</div>
							<div class="top-achievements">
								<h6>TOP ACHIEVEMENTS</h6>
								<ul class="achievement-list"></ul>
							</div>
						</div>
						<div class="progress-bar-container">
							<div class="progress-bar-profile">
								<h6 class="progress-percentage"></h6>
							</div>
							<div class="xp">
								<h6></h6>
							</div>
						</div>
					</div>
					<div class="user-info-container">
						<ul class="user-info-list" id="user-info-list">
							<!-- User Info Item -->

							<!-- End User Info Item -->
						</ul>
						<div class="user-into-cta">
							<!-- CTA -->
							<button id="invite-btn">
								<img
									src="/public/assets/icons/directbox-send.svg"
									alt="CTA"
								/>
								<p>Invite</p>
							</button>
							<!-- End CTA -->
						</div>
					</div>
				</div>

				<div
					data-show="flase"
					class="menu-button"
					id="dropdown-menu-container"
				></div>
			</div>

			<!-- profile Body -->
			<div class="profile-body">
				<div class="tournament-history">
					<h6>Tournament History</h6>
					<ul id="tournament-history">
						${/* Tournament Item */ ""}
					</ul>
				</div>

				<div class="match-history">
					<h6>Match History</h6>
					<ul id="match-history">
						${/* Match Item */ ""}
					</ul>
				</div>

				<div class="last-achievements">
					<h6>Last Achievements</h6>
					<ul id="last-achievements">
						${/* Achievement Item */ ""}
					</ul>
				</div>
			</div>

			<!-- End -->
		</div>
	`;
}

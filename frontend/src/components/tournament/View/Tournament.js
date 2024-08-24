const html = String.raw;

const id = new URL(window.location.href).searchParams.get(
	"selected-tournament"
);

export function BracketCard() {
	return html`
		<!-- bracket -->
		<li class="bracket-card">
			<div class="bracket-card-content">
				<div class="bracket-avatar">
					<img
						src="https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671122.jpg?size=338&ext=jpg&ga=GA1.1.2008272138.1723248000&semt=ais_hybrid"
						alt="profile Icon"
						class="avatar-image"
					/>
				</div>
				<div class="bracket-info">
					<div class="bracket-user">user</div>
					<div class="bracket-level">Level <span>10xp</span></div>
				</div>
			</div>
		</li>
		<!-- Repeat bracket cards as needed -->
	`;
}

export default function tournaments() {
	return html`
		<div class="container">
			<div class="card">
				<div class="card-content">
					<img
						class="card-image"
						src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgKjTMSLXUNCq2j0fYA9KgZKnfuudUX5Q6Pg&s"
					/>
					<div class="card-text">
						<div class="card-title">{result.name}</div>
						<div class="card-description">{result.description}</div>
					</div>
				</div>

				<div class="card-info">
					<div class="player-info">
						<div class="player-count">{result.max_players}</div>
						<div class="player-label">Max Players</div>
					</div>
					<div data-show="true" class="tournament-menu">
						<button class="menu-button" popovertarget="menu-popover">
							<svg
								width="24"
								height="25"
								viewBox="0 0 24 25"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M12 6.42C12.2546 6.42 12.4988 6.31886 12.6789 6.13882C12.8589 5.95879 12.96 5.71461 12.96 5.46C12.96 5.20539 12.8589 4.96121 12.6789 4.78118C12.4988 4.60114 12.2546 4.5 12 4.5C11.7454 4.5 11.5013 4.60114 11.3212 4.78118C11.1412 4.96121 11.04 5.20539 11.04 5.46C11.04 5.71461 11.1412 5.95879 11.3212 6.13882C11.5013 6.31886 11.7454 6.42 12 6.42ZM12 13.46C12.2546 13.46 12.4988 13.3589 12.6789 13.1788C12.8589 12.9988 12.96 12.7546 12.96 12.5C12.96 12.2454 12.8589 12.0012 12.6789 11.8212C12.4988 11.6411 12.2546 11.54 12 11.54C11.7454 11.54 11.5013 11.6411 11.3212 11.8212C11.1412 12.0012 11.04 12.2454 11.04 12.5C11.04 12.7546 11.1412 12.9988 11.3212 13.1788C11.5013 13.3589 11.7454 13.46 12 13.46ZM12 20.5C12.2546 20.5 12.4988 20.3989 12.6789 20.2188C12.8589 20.0388 12.96 19.7946 12.96 19.54C12.96 19.2854 12.8589 19.0412 12.6789 18.8612C12.4988 18.6811 12.2546 18.58 12 18.58C11.7454 18.58 11.5013 18.6811 11.3212 18.8612C11.1412 19.0412 11.04 19.2854 11.04 19.54C11.04 19.7946 11.1412 20.0388 11.3212 20.2188C11.5013 20.3989 11.7454 20.5 12 20.5Z"
									stroke="#F8F8F8"
									stroke-width="1.5"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
						</button>
						<div id="menu-popover" popover></div>
						<div class="menu">
							<li>Remove</li>
						</div>
					</div>
				</div>
			</div>

			<div class="bracket-streaming">
				<div class="bracket hide-scrollbar">
					<div class="bracket-content">
						<ul class="bracket-half">
							${BracketCard()}
						</ul>
						<div class="vs-text">VS</div>
						<ul class="bracket-half">
							${BracketCard()}
						</ul>
					</div>
				</div>

				<div class="streaming-card hide-scrollbar">
					<div class="streaming-header">
						<h6 class="streaming-title">Streaming</h6>
					</div>
					<div class="streaming-content">
						<img src="/lib/empty.svg" alt="empty" width="{50}" height="{50}" />
						<p class="coming-soon">Coming Soon!</p>
					</div>
					<form class="register-form">
						<button type="submit" class="register-button">Register Now</button>
					</form>
				</div>
			</div>

			<div class="status-table-container">
				<div class="status-header">
					<h6 class="status-title">States</h6>
				</div>
				<div class="status-table-wrapper">
					<table class="status-table">
						<thead>
							<tr>
								<th>Players</th>
								<th>Score</th>
								<th>Start date</th>
								<th>Finish date</th>
								<th>Winner</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>
									<div class="player-row">
										<div class="player-images">
											<div class="player-avatar">
												<img
													src="https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671122.jpg?size=338&ext=jpg&ga=GA1.1.2008272138.1723248000&semt=ais_hybrid"
													alt="profile"
													class="avatar-image"
												/>
											</div>
											<div class="player-avatar">
												<img
													src="https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671122.jpg?size=338&ext=jpg&ga=GA1.1.2008272138.1723248000&semt=ais_hybrid"
													alt="profile"
													class="avatar-image"
												/>
											</div>
										</div>
										<div class="player-info">
											<div class="player-name">Aaitouna</div>
											<div class="player-level">Level <span>100</span></div>
										</div>
										<p class="vs-text">VS</p>
										<div class="player-info">
											<div class="player-name">Aaitouna</div>
											<div class="player-level">Level <span>100</span></div>
										</div>
									</div>
								</td>
								<td>0 VS 0</td>
								<td>10/02/2024</td>
								<td>10/02/2024</td>
								<td>
									<div class="winner-row">
										<div class="winner-avatar">
											<img
												src="https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671122.jpg?size=338&ext=jpg&ga=GA1.1.2008272138.1723248000&semt=ais_hybrid"
												alt="profile"
												class="avatar-image"
											/>
										</div>
										<div class="winner-info">
											<div class="winner-name">Aaitouna</div>
											<div class="winner-level">Level <span>100</span></div>
										</div>
									</div>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	`;
}

const html = String.raw;

export function tournamentElement({
	id,
	icon,
	name,
	description,
	max_players,
}) {
	return html`
		<li class="tournament-item">
			<a href="/tournaments/tournament?selected-tournament=${id}">
				<div class="tournament-card">
					<div class="tournament-info">
						<img
							class="tournament-icon"
							src="${icon}"
							alt="tournament icon"
							onerror="this.src='/public/assets/icons/empty.svg';"
						/>
						<div class="tournament-details">
							<div class="tournament-name">${name}</div>
							<div class="tournament-description">${description}</div>
						</div>
					</div>
					<div class="tournament-stats">
						<div class="max-players">
							<div class="player-count">${max_players}</div>
							<div class="player-label">Max Players</div>
						</div>
						<div class="arrow-icon">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								fill="none"
							>
								<path
									stroke="#fff"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="1.5"
									d="m9 5.405 7 7-7 7"
								/>
							</svg>
						</div>
					</div>
				</div>
			</a>
		</li>
	`;
}

export function tournamentWrapper() {
	return html`
		<div class="container" id="tournament-wrapper">
			<div class="tournament-list">
				<div class="tournament-header">
					<h5 class="header-title">Tournaments</h5>
					<button class="create_new_trn">
						<a href="/tournaments/create_tournament">CREATE TOURNAMENTS</a>
					</button>
				</div>
				<ul class="tournament-items" id="tournament-items"></ul>
			</div>
		</div>
	`;
}

export default function tournaments() {
	return html` <div class="tournament-container">${tournamentWrapper()}</div> `;
}

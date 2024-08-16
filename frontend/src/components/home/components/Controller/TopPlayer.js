export default function TopPlayer() {
	document.addEventListener('DOMContentLoaded', function () {
		const topPlayersContainer = document.getElementById('topPlayersContainer');
		const userContainer = document.getElementById('userContainer');

		const fetchTopPlayers = () => {
			return new Promise((resolve) => {
				setTimeout(() => {
					resolve({
						results: [
							{ name: 'Player 1', score: 100 },
							{ name: 'Player 2', score: 90 },
							{ name: 'Player 3', score: 80 },
							{ name: 'Player 4', score: 70 }
						]
					});
				}, 1000);
			});
		};

		const displayTopPlayers = async () => {
			const topPlayers = await fetchTopPlayers();

			if (!topPlayers.results.length) {
				topPlayersContainer.innerHTML = '<div class="empty">No Top players are available right now</div>';
			} else {
				const playersHtml = topPlayers.results.slice(0, 4).map((item, index) =>
					`<div class="player">
                    <div class="player-name">${index + 1}. ${item.name}</div>
                    <div class="player-score">Score: ${item.score}</div>
                </div>`
				).join('');

				topPlayersContainer.innerHTML = `<div class="players">${playersHtml}</div>`;
			}
		};

		const displayUser = () => {
			// Simulating a single user for demonstration
			const user = { username: 'User1', imageUrl: 'path/to/image', isMessage: true };
			const userElement = document.createElement('div');
			userElement.className = 'user';
			userElement.innerHTML = `
            <div class="user-info">
                <img src="${user.imageUrl}" alt="Profile Image" class="profile-image"/>
                <span>${user.username}</span>
            </div>
            ${user.isMessage ? '<span class="message-icon">📩</span>' : ''}
        `;
			userContainer.appendChild(userElement);

			// Simulate navigation on click
			userElement.addEventListener('click', () => {
				window.location.href = `/profile/${user.username}`;
			});
		};

		displayTopPlayers();
		displayUser();
	});
}
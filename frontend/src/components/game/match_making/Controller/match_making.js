const params = new URLSearchParams(window.location.search);
const mode = params.get("mode");
import { fetchMyData, UserDetailByUsername } from "/src/_api/user.js";
import AuthWebSocket from "/src/lib/authwebsocket.js";
import { showPopup } from "/src/lib/Confirm.js";

const myData = await fetchMyData();

export default async function () {

	const game_mode = new URLSearchParams(window.location.search).get("game_mode");
	const second_player = new URLSearchParams(window.location.search).get("player");
	const pb = document.getElementById('match-making-play-now-button');
	const myCard = document.getElementById("my-card")
	console.log("my data :", myData)
	myCard.innerHTML = ``
	myCard.innerHTML = `
		<div class="player-card">
			<img src=${myData.image_url} alt="Player Image" class="player-image">
			<div class="player-info">
				<div class="player-name">${myData.username}</div>
				<div class="player-rank">
					<img src=${myData.rank && myData.rank.icon ? myData.rank.icon : "/public/assets/icons/Gold_3_Rank.png"} alt="Rank Icon" class="rank-icon">
					<span class="player-level">Lvl.${myData.current_xp}/ ${myData.rank ? myData.rank.xp_required : 0}</span>
				</div>
			</div>
		</div>
	`
	if (second_player) {
		const secondPlayerCard = document.getElementById("second-player")
		const second_player_data = await UserDetailByUsername(second_player)
		secondPlayerCard.innerHTML = "";
		secondPlayerCard.style.height = 'null';
		secondPlayerCard.innerHTML = `
				<div class="player-card fade-in-image">
					<img src=${second_player_data.image_url} alt="Player Image" class="player-image">
					<div class="player-info">
						<div class="player-name">${second_player_data.username}</div>
						<div class="player-rank">
							<img src=${second_player_data.rank.icon} alt="Rank Icon" class="rank-icon">
							<span class="player-level">Lvl.${second_player_data.current_xp}/${second_player_data.rank.xp_required}</span>
						</div>
					</div>
				</div>`
	}
	if (game_mode === 'singleplayer' && !second_player) {
		const secondPlayerCard = document.getElementById("second-player")
		secondPlayerCard.innerHTML = "";
		secondPlayerCard.style.height = 'null';
		secondPlayerCard.innerHTML = `
				<div class="player-card fade-in-image">
					<img src="/public/assets/images/robot.webp "alt="Player Image" class="player-image">
					<div class="player-info">
						<div class="player-name">Root</div>
						<div class="player-rank">
							<img src="/public/assets/icons/unranked.png" alt="Rank Icon" class="rank-icon">
							<span class="player-level">Lvl.----</span>
						</div>
					</div>
				</div>`
	}
	pb.addEventListener('click', handleButtonClick);
	startCountdown(60, "/game/choice-game");


	if (game_mode === undefined)
		game_mode = 'multiplayer'
	if (game_mode && game_mode !== 'multiplayer' && game_mode !== 'singleplayer') {
		showPopup({
			title: "there is no type",
			subtitle: "please choose humane or robot to play with ",
			onConfirm: async () => {
				window.location.href = "/home";
			},
			closeable: false
		});
	}

	const loobySocket = new AuthWebSocket(`/ws/game/normal/looby/?game_mode=${game_mode}`);
	loobySocket.onopen = () => {
		console.log("WebSocket connected -------------------------------");
	};
	loobySocket.onmessage = (message) => {
		const data = JSON.parse(message.data);
		console.log("data", data);
		matchCountdown(15, `/game?uuid=${data.game_uuid}`, data.second_player);
	};


}


function startCountdown(
	seconds,
	path
) {
	const timerElement = document.getElementById('countdown-timer');
	let remainingTime = seconds;

	const intervalId = setInterval(() => {
		const minutes = Math.floor(remainingTime / 60);
		const seconds = remainingTime % 60;

		timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

		remainingTime--;

		if (remainingTime < 0) {
			clearInterval(intervalId);
			window.location.href = path
		}
	}, 1000);
}

function matchCountdown(
	seconds,
	path,
	second_player,
) {
	const timerElement = document.getElementById('countdown-timer');
	let remainingTime = seconds;

	const intervalId = setInterval(async () => {
		const minutes = Math.floor(remainingTime / 60);
		const seconds = remainingTime % 60;
		remainingTime--;

		const secondPlayerCard = document.getElementById("second-player")
		const second_player_data = await UserDetailByUsername(second_player)
		secondPlayerCard.innerHTML = "";
		secondPlayerCard.style.height = 'null';
		secondPlayerCard.innerHTML = `
		<div class="player-card">
			<img src=${second_player_data.image_url} alt="Player Image" class="player-image">
			<div class="player-info">
				<div class="player-name">${second_player_data.username}</div>
				<div class="player-rank">
					<img src=${second_player_data.rank && second_player_data.rank.icon ? second_player_data.rank.icon : "/public/assets/icons/Gold_3_Rank.png"} alt="Rank Icon" class="rank-icon">
					<span class="player-level">Lvl.${second_player_data.current_xp}/ ${second_player_data.rank ? second_player_data.rank.xp_required : 0}</span>
				</div>
			</div>
		</div>`
		if (remainingTime < 0) {
			clearInterval(intervalId);
			window.location.href = path
		}
	}, 1000);
}

function handleButtonClick() {
	window.location.href = "/game/choice-game";
}


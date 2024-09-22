const params = new URLSearchParams(window.location.search);
import { setTournaments } from "/src/components/tournaments/Controller/Tournaments.js";
import OnlinePlayers from "/src/components/home/components/Controller/OnlinePlayers.js";


const mode = params.get("mode");

export default function () {
	const head = document.head;

	const cssFiles = [
		"/src/components/tournaments/assets/Tournaments.css",
		"/src/components/home/components/assets/components.css",
	];

	function loadCSS(href, onLoad, onError) {
		const link = document.createElement("link");
		link.rel = "stylesheet";
		link.href = href;
		link.onload = onLoad;
		link.onerror = onError;
		head.appendChild(link);
	}
	cssFiles.forEach((cssFile) => {
		loadCSS(
			cssFile,
		);
	});
	setTournaments(3);
	OnlinePlayers();

	document.querySelectorAll('.radio-option input[type="radio"]').forEach((radio) => {
		const radioOption = document.querySelectorAll('.radio-option')
		radio.addEventListener('change', function () {
			radioOption.forEach(option => {
				option.classList.remove('selected');
			});
			this.parentNode.classList.add('selected');
		});
	});

	const playNowButton = document.getElementById('play-now-button');

	playNowButton.addEventListener('click', (event) => {
		event.preventDefault();
		const selectedOpponent = document.querySelector('input[name="opponent"]:checked').value;
		let url = '/game/match_making';
		let query = 'multiplayer'
		if (selectedOpponent === 'Machine')
			query = 'singleplayer'
		else if (selectedOpponent === 'Local')
			query = 'localPlayers'
		window.location.href = `${url}?game_mode=${query}`;
	});
}
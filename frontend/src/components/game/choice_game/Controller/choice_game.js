const params = new URLSearchParams(window.location.search);
import { setTournaments } from "/src/components/tournaments/Controller/Tournaments.js";
import OnlinePlayers from "/src/components/home/components/Controller/OnlinePlayers.js";
import AuthWebSocket from "/src/lib/authwebsocket.js";


const mode = params.get("mode");

export default function () {
	console.log("choice game Type here ");
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
		radio.addEventListener('change', function() {
		  document.querySelectorAll('.radio-option').forEach(option => {
			option.classList.remove('selected'); // Remove the 'selected' class from all options
		  });
		  this.parentNode.classList.add('selected'); // Add the 'selected' class to the clicked option
		});
	  });
	  
	const playNowButton = document.getElementById('play-now-button');

	playNowButton.addEventListener('click', (event) => {
		console.log("button cliqued");
		
		event.preventDefault();
		console.log("oussama ousaada ------------------------");
		const selectedOpponent = document.querySelector('input[name="opponent"]:checked').value;

		let url = 'https://localhost:4433/game/match_making';
		let query = 'multiplayer'
		if (selectedOpponent === 'Machine')
			query = 'singleplayer'
		window.location.href = `${url}?game_mode=${query}`;
	});
}
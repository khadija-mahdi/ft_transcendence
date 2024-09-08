import { setTournaments } from "/src/components/tournaments/Controller/Tournaments.js";
import UserSection from "/src/components/home/components/Controller/UserSection.js";
import UserFriends from "/src/components/home/components/Controller/UserFriends.js";
import TopPlayers from "/src/components/home/components/Controller/TopPlayer.js";
import OnlinePlayers from "/src/components/home/components/Controller/OnlinePlayers.js";
import tournemntsSlider from "/src/components/home/components/Controller/tournemntsSlider.js";
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
	UserFriends();
	UserSection();
	TopPlayers();
	OnlinePlayers();
	tournemntsSlider();
}

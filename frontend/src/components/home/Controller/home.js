import { setTournaments } from "../../tournaments/Controller/Tournaments.js";
import UserSection from "../components/Controller/UserSection.js";
import UserFriends from "../components/Controller/UserFriends.js";
import TopPlayers from "../components/Controller/TopPlayer.js";
import OnlinePlayers from "../components/Controller/OnlinePlayers.js";
import tournemntsSlider from "../components/Controller/tournemntsSlider.js";
export default function () {
	const head = document.head;

	const cssFiles = [
		"./components/tournaments/assets/Tournaments.css",
		"./components/home/components/assets/components.css",
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

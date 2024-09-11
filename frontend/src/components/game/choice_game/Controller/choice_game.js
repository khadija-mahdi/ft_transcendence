const params = new URLSearchParams(window.location.search);
import { setTournaments } from "/src/components/tournaments/Controller/Tournaments.js";
import OnlinePlayers from "/src/components/home/components/Controller/OnlinePlayers.js";


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
}

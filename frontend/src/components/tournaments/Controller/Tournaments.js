import { Empty } from "/src/lib/Empty.js";
import { fetchWithAuth } from "/src/lib/apiMock.js";
import { tournamentElement, tournamentWrapper } from "../View/Tournaments.js";

async function fetchTournaments() {
	const apiUrl = "/api/v1/game/Tournament/";
	try {
		const response = await fetchWithAuth(apiUrl);
		return response.results;
	} catch (error) {
		return [];
	}
}

export async function setTournaments(max_items = -1) {
	const tournament_items = document.getElementById("tournament-items");
	let tournaments = await fetchTournaments();
	if (tournaments.length === 0)
		return tournament_items.appendChild(Empty("No tournaments found"));
	if (max_items > 0) tournaments = tournaments.slice(0, max_items);
	tournaments.forEach((tournament) => {
		tournament_items.innerHTML += tournamentElement(tournament);
	});
}

export default async function controller_Tournaments() {
	await setTournaments();
}

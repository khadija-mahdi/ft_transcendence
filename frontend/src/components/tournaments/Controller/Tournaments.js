import { Empty } from "../../../../lib/Empty.js";
import { fetchWithAuth } from '../../../../lib/apiMock.js'

async function fetchTournaments() {
	const apiUrl = "https://localhost:4433/api/v1/game/Tournament/";
	try {
		const response = await fetchWithAuth(apiUrl, {
			method: 'GET',
		});
		return response.results
			.slice(0, 3)
			.map((result) => ({
				...result,
				icon: result.icon?.replace("https://localhost/", "https://localhost:4433/")
			}));
	} catch (error) {
		console.error("Error fetching user data:", error);
	}
}

const setTournaments = async () => {
	const tournaments = await fetchTournaments()
	if (!tournaments.ok)
		return console.log("Failed to fetch tournaments")
	const tournamentsJson = await tournaments.json()
	console.log(tournamentsJson)
}

export default async function controller_Tournaments() {
	// await setTournaments();
}

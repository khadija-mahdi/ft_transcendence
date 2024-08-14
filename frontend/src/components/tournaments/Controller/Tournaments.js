
const setTournaments = async () => {
	const tournaments = await fetch("https://localhost:4433/api/v1/game/Tournament/")
	if (!tournaments.ok)
		return console.log("Failed to fetch tournaments")
	const tournamentsJson = await tournaments.json()
	console.log(tournamentsJson)
}

export default async function controller_Tournaments() {
	await setTournaments();
}

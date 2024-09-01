import { fetchWithAuth } from "/lib/apiMock.js";
import { handleSubmit, Validator, reset } from "/lib/Validator.js";
import { GetTournamentDetails } from "/_api/game.js";
import { StatusTableRow } from "../View/Tournament.js";
import { Empty } from "/lib/Empty.js";

let data = {};
export default async function controller_Tournaments() {
	const id = new URLSearchParams(window.location.search).get(
		"selected-tournament"
	);
	if (!id) return window.location.replace("/tournaments");

	data = await GetTournamentDetails(id);
	setTournamentDetails();
	attachEventListeners();
}

function setTournamentDetails() {
	const tournamentImage = document.getElementById("tournament-image");
	const tournamentTitle = document.getElementById("tournament-title");
	const tournamentDescription = document.getElementById(
		"tournament-description"
	);
	const playerCount = document.getElementById("player-count");
	const statusTableBody = document.getElementById("status-table-body");
	const menuButton = document.querySelector(".menu-button");

	// Populate the tournament details
	menuButton.style.display = data.is_my_tournament ? "block" : "none";
	tournamentImage.src = data.icon;
	tournamentTitle.innerText = data.name;
	tournamentDescription.innerText = data.description;
	playerCount.innerText = data.max_players;

	const statusPanel = document.querySelector(".status-table-wrapper");
	if (data.games_states.length === 0) {
		statusPanel.innerHTML = "";
		statusPanel.appendChild(Empty("No games states available"));
	} else {
		data.games_states.forEach((match) => {
			statusTableBody.innerHTML = +StatusTableRow(match);
		});
	}
}

function attachEventListeners() {
	const registerForm = document.getElementById("register-form");
	registerForm.addEventListener("submit", (event) =>
		handleSubmit(
			event,
			{
				alias: new Validator().required().min(3).max(20).string(),
			},
			handleRegisterFormSubmit
		)
	);

	const removeButton = document.getElementById("remove-tournament");
	removeButton.addEventListener("click", handleRemoveButton);
}

function handleRegisterFormSubmit(data) {
	console.log("Register Form Submitted for tournament");
}

function handleRemoveButton() {
	console.log("Removing from tournament");
}

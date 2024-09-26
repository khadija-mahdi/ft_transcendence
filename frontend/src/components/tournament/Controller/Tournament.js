import { showPopup } from "/src/lib/Confirm.js";
import {
  GetTournamentDetails,
  removeTournament,
  RegisterTournament,
  UnRegisterTournament,
} from "/src/_api/game.js";
import { BracketCard, StatusTableRow } from "../View/Tournament.js";
import { Empty } from "/src/lib/Empty.js";
import { processBracketData } from "/src/lib/bracket-data-processer.js";
const html = String.raw;

let data = {};
const id = new URLSearchParams(window.location.search).get(
  "selected-tournament"
);
export default async function () {
  if (!id) return window.location.replace("/tournaments");

  try {
    data = await GetTournamentDetails(id);
  } catch (e) {
    return (window.location.href = "/");
  }
  setTournamentDetails();
  attachEventListeners();
  useDragToScroll();
}

function setTournamentDetails() {
  const {
    max_players,
    icon,
    name,
    description,
    is_my_tournament,
    games_states,
    tournament_bracket,
    is_registered,
    finished,
    is_public,
    ongoing,
    start_date,
    registered_users
  } = data;
  const tournamentImage = document.getElementById("tournament-image");
  const tournamentTitle = document.getElementById("tournament-title");
  const tournamentDescription = document.getElementById(
    "tournament-description"
  );
  const tournamentStartDate = document.getElementById(
    "tournament-start-date"
  );

  const playerCount = document.getElementById("player-count");
  const statusTableBody = document.getElementById("status-table-body");
  const menuButton = document.querySelector(".menu-button");
  const bracketContent = document.querySelector(".bracket-content");
  const RegisterButton = document.getElementById("register-button");

  // Populate the tournament details
  menuButton.style.display = is_my_tournament ? "block" : "none";
  tournamentImage.src = icon;
  tournamentTitle.innerText = name;
  tournamentDescription.innerText = description
  tournamentStartDate.innerText = new Date(start_date).toLocaleString()
  playerCount.innerText = max_players;

  RegisterButton.innerText =
    is_registered && is_public ? "Unregister" : "Register";

  RegisterButton.disabled = finished || ongoing;
  const statusPanel = document.querySelector(".status-table-wrapper");
  if (games_states.length === 0) {
    statusPanel.innerHTML = "";
    statusPanel.appendChild(Empty("No games states available"));
  } else {
    games_states.forEach((match) => {
      statusTableBody.innerHTML += StatusTableRow(match);
    });
  }

  // Populate the Bracket Board
  const [first_half, second_half] = processBracketData(
    tournament_bracket || [],
    max_players,
    finished,
    registered_users.length
  );

  bracketContent.innerHTML = first_half
    .map(
      (data) =>
        html`
          <ul class="bracket-half">
            ${data
            .map((player) => BracketCard(player.player, player.alias))
            .join("")}
          </ul>
        `
    )
    .join("");

  bracketContent.innerHTML += html`<div class="vs-text">VS</div>`;
  bracketContent.innerHTML += second_half
    .reverse()
    .map(
      (data) =>
        html`
          <ul class="bracket-half">
            ${data
            .map((player) => BracketCard(player.player, player.alias))
            .join("")}
          </ul>
        `
    )
    .join("");
}

function attachEventListeners() {
  const registerForm = document.getElementById("register-form");
  registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    handleRegisterFormSubmit();
  });

  const removeButton = document.getElementById("remove-tournament");
  removeButton.addEventListener("click", handleRemoveButton);
}

async function handleRegisterFormSubmit(_data) {
  if (data.is_registered && data.is_public) {
    await UnRegisterTournament(id);
    data = await GetTournamentDetails(id);
    setTournamentDetails();
    return;
  }
  showPopup({
    title: "Register for the tournament",
    subtitle: "Please enter your alias to register for the tournament",
    inputBody: html`<div class="form-field">
      <input
        class="input-field"
        placeholder="Your alias"
        required="true"
        type="text"
        name="alias"
        id="alias"
      />
    </div>`,
    onConfirm: async (formData) => {
      await RegisterTournament(id, formData);
      data = await GetTournamentDetails(id);
      setTournamentDetails();
    },
  });
}

async function handleRemoveButton() {
  await removeTournament(id);
  return window.location.replace("/tournaments");
}

function useDragToScroll() {
  const scrollContainer = document.getElementById("brackets-container");
  let isDown = false;
  let StartX, StartY;
  let scrollLeft, scrollTop;
  const handleMouseDown = (e) => {
    isDown = true;
    scrollContainer?.classList.add("grabbing");
    StartX = e.clientX - (scrollContainer?.offsetLeft || 0);
    StartY = e.clientY - (scrollContainer?.offsetTop || 0);
    scrollLeft = scrollContainer?.scrollLeft || 0;
    scrollTop = scrollContainer?.scrollTop || 0;
  };
  const handleMouseLeave = (e) => {
    isDown = false;
    scrollContainer?.classList.remove("grabbing");
  };

  const handleMouseUp = (e) => {
    isDown = false;
    scrollContainer?.classList.remove("grabbing");
  };

  const handleMouseMove = (e) => {
    if (!isDown) return;
    const x = e.clientX - (scrollContainer?.offsetLeft || 0);
    const y = e.clientY - (scrollContainer?.offsetTop || 0);
    const walkX = (x - StartX) * 1;
    const walkY = (y - StartY) * 1;
    if (scrollContainer) scrollContainer.scrollLeft = scrollLeft - walkX;
    if (scrollContainer) scrollContainer.scrollTop = scrollTop - walkY;
  };

  scrollContainer?.addEventListener("mousedown", handleMouseDown);
  scrollContainer?.addEventListener("mouseleave", handleMouseLeave);
  scrollContainer?.addEventListener("mouseup", handleMouseUp);
  scrollContainer?.addEventListener("mousemove", handleMouseMove);
  return () => {
    scrollContainer?.removeEventListener("mousedown", handleMouseDown);
    scrollContainer?.removeEventListener("mouseleave", handleMouseLeave);
    scrollContainer?.removeEventListener("mouseup", handleMouseUp);
    scrollContainer?.removeEventListener("mousemove", handleMouseMove);
  };
}

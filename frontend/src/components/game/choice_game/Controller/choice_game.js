const params = new URLSearchParams(window.location.search);
import { setTournaments } from "/src/components/tournaments/Controller/Tournaments.js";
import OnlinePlayers from "/src/components/home/components/Controller/OnlinePlayers.js";
import { showPopup } from "/src/lib/Confirm.js";

const mode = params.get("mode");
const html = String.raw;

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
    loadCSS(cssFile);
  });
  setTournaments(3);
  OnlinePlayers();

  document
    .querySelectorAll('.radio-option input[type="radio"]')
    .forEach((radio) => {
      const radioOption = document.querySelectorAll(".radio-option");
      radio.addEventListener("change", function () {
        radioOption.forEach((option) => {
          option.classList.remove("selected");
        });
        this.parentNode.classList.add("selected");
      });
    });

  const playNowButton = document.getElementById("play-now-button");

  playNowButton.addEventListener("click", (event) => {
    event.preventDefault();
    const selectedOpponent = document.querySelector(
      'input[name="opponent"]:checked'
    ).value;
    let url = "/game/match_making";
    let query = "multiplayer";
    if (selectedOpponent === "Machine") {
      query = "singleplayer";
      window.location.href = `${url}?game_mode=${query}`;
    } else if (selectedOpponent === "Local") {
      query = "localPlayers";
      showPopup({
        title: "Add player Aliases",
        subtitle: "Please enter aliases for both players",
        inputBody: html` <div class="form-field">
            <input
              class="input-field"
              placeholder="Player 1 alias"
              type="text"
              name="alias1"
              id="alias1"
            />
          </div>
          <div class="form-field">
            <input
              class="input-field"
              placeholder="Player 2 alias"
              type="text"
              name="alias2"
              id="alias2"
            />
          </div>`,
        onConfirm: async (formData) => {
          const alias1 = document.getElementById("alias1").value;
          const alias2 = document.getElementById("alias2").value;
          if (alias1 && alias2) {
            window.location.href = `${url}?game_mode=${query}&alias1=${alias1}&alias2=${alias2}`;
          } else {
            window.location.href = `${url}?game_mode=${query}`;
          }
        },
      });
    } else {
      window.location.href = `${url}?game_mode=${query}`;
    }
  });
}

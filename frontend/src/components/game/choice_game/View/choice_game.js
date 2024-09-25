import { tournamentWrapper } from "/src/components/tournaments/View/Tournaments.js";
import OnlinePlayers from "/src/components/home/components/View/OnlinePlayers.js";
const html = String.raw;

export default () => {
  return html`
    <div class="main-container">
      <div class="section-container">
        <div class="select-game-section">
          <img
            src="/public/assets/images/Rectangle.png"
            alt="Profile Image"
            class="select-game-image"
          />
          <div class="game-overlay">
            <h1 class="game-title">READY, SET, PLAY!</h1>
            <p class="game-subtitle">
              Who Will You Face? Choose your opponent and dive into the action!
            </p>
            <div class="button-group">
              <label class="radio-option">
                <input
                  type="radio"
                  id="opponent-local"
                  name="opponent"
                  value="Local"
                />
                <span>Local</span>
              </label>
              <label class="radio-option">
                <input
                  type="radio"
                  id="opponent-machine"
                  name="opponent"
                  value="Machine"
                />
                <span>Machine</span>
              </label>
              <label class="radio-option selected">
                <input
                  type="radio"
                  id="opponent-human"
                  name="opponent"
                  value="Human"
                  checked
                />
                <span>Human</span>
              </label>
            </div>
            <a href="#" id="play-now-button">Play Now</a>
          </div>
        </div>

        <div class="online-players-cg">${OnlinePlayers()}</div>
      </div>
      <div class="live-tournaments">${tournamentWrapper()}</div>
    </div>
  `;
};

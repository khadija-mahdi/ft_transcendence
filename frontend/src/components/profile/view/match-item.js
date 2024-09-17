const html = String.raw;

export function matchItem({ first_player, second_player, Winner }) {
  const IWon = Winner?.id === first_player?.id;
  return html`
    <div class="match-item">
      <div class="match-players">
        <div class="player-icons">
          <div class="player-icon">
            <img
              src="${first_player?.image_url ||
              "/public/assets/images/robot.webp"}"
              alt="profile"
              onerror="this.onerror=null;this.src='/public/assets/images/defaultImageProfile.jpg';"
            />
          </div>
          <div class="player-icon">
            <img
              src="${second_player?.image_url ||
              "/public/assets/images/robot.webp"}"
              alt="profile"
              onerror="this.onerror=null;this.src='/public/assets/images/defaultImageProfile.jpg';"
            />
          </div>
        </div>
        <div class="player-details">
          <div
            class="player-name"
            title="${first_player?.username || "Machine"}"
          >
            ${first_player?.username || "Machine"}
          </div>
          <div class="player-level">
            Level
            <span
              >${first_player?.current_xp === undefined
                ? "---"
                : `${first_player?.current_xp}xp`}</span
            >
          </div>
        </div>
        <p class="vs-text">VS</p>
        <div class="player-details">
          <div
            class="player-name"
            title="${second_player?.username || "Machine"}"
          >
            ${second_player?.username || "Machine"}
          </div>
          <div class="player-level">
            Level
            <span
              >${second_player?.current_xp === undefined
                ? "---"
                : `${second_player?.current_xp}xp`}</span
            >
          </div>
        </div>
      </div>
      <img
        class="match-result-icon"
        src="${IWon
          ? "/src/components/game/in_game/assets/prize-icon.png"
          : "/src/components/game/in_game/assets/lost-icon.png"}"
      />
    </div>
  `;
}

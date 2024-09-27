const html = String.raw;

export function matchItem({ first_player, second_player, Winner, me }) {
  const IWon = Winner?.user?.id === me;
  return html`
    <div class="match-item">
      <div class="match-players">
        <div class="player-icons">
          <div class="player-icon">
            <img
              src="${first_player?.user?.image_url}"
              alt="profile"
              onerror="this.src='/public/assets/images/defaultImageProfile.jpeg';"
            />
          </div>
          <div class="player-icon">
            <img
              src="${second_player?.user?.image_url ||
              "/public/assets/images/robot.webp"}"
              alt="profile"
              onerror="this.src='/public/assets/images/defaultImageProfile.jpeg';"
            />
          </div>
        </div>
        <div class="player-details">
          <div
            class="player-name"
            title="${first_player?.alias || "Machine"}"
          >
            ${first_player?.alias || "Machine"}
          </div>
          <div class="player-level">
            Level
            <span
              >${first_player?.user?.current_xp === undefined
                ? "---"
                : `${first_player?.user?.current_xp}xp`}</span
            >
          </div>
        </div>
        <p class="vs-text">VS</p>
        <div class="player-details">
          <div
            class="player-name"
            title="${second_player?.alias || "Machine"}"
          >
            ${second_player?.alias || "Machine"}
          </div>
          <div class="player-level">
            Level
            <span
              >${second_player?.user?.current_xp === undefined
                ? "---"
                : `${second_player?.user?.current_xp}xp`}</span
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

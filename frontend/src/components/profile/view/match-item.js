const html = String.raw;

export function matchItem({ first_player, second_player }) {

  return html`
    <a href="/">
      <div class="match-item">
        <div class="match-players">
          <div class="player-icons">
            <div class="player-icon">
              <img
                src="${first_player?.image_url ||
                "https://images.unsplash.com/photo-1667053508464-eb11b394df83?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}"
                alt="profile"
              />
            </div>
            <div class="player-icon">
              <img
                src="${second_player?.image_url ||
                "https://images.unsplash.com/photo-1667053508464-eb11b394df83?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}"
                alt="profile"
              />
            </div>
          </div>
          <div class="player-details">
            <div class="player-name" title="${first_player?.username|| "Machine"}">
              ${first_player?.username|| "Machine"}
            </div>
            <div class="player-level">
              Level <span>${first_player?.current_xp || "---"}</span>
            </div>
          </div>
          <p class="vs-text">VS</p>
          <div class="player-details">
            <div class="player-name" title="${second_player?.username|| "Machine"}">
              ${second_player?.username|| "Machine"}
            </div>
            <div class="player-level">
              Level <span>${second_player?.current_xp || "---"}</span>
            </div>
          </div>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
        >
          <path
            stroke="#fff"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="{1.5}"
            d="m9 5.405 7 7-7 7"
          />
        </svg>
      </div>
    </a>
  `;
}

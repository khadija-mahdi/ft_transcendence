const html = String.raw;

const id = new URL(window.location.href).searchParams.get(
  "selected-tournament"
);

export function BracketCard(player = {}, alias = null) {
  if (!player?.image_url && !player?.username)
    return html` <li class="bracket-card">
      <div class="bracket-card-content"></div>
    </li>`;
  return html`
    <!-- bracket -->
    <li class="bracket-card">
      <div class="bracket-card-content">
        <div class="bracket-avatar">
          <img
            src="${player.image_url}"
            alt="profile Icon"
            class="avatar-image"
            onerror="this.src='/public/assets/images/defaultImageProfile.jpeg';"
          />
        </div>
        <div class="bracket-info">
          <div class="bracket-user">${alias || player.username || "USER"}</div>
          <div class="bracket-level">
            Level <span>${player.current_xp || 0}xp</span>
          </div>
        </div>
      </div>
    </li>
    <!-- Repeat bracket cards as needed -->
  `;
}

export default function tournaments() {
  return html`
    <div class="container">
      <div class="card">
        <div class="card-content">
          <img
            class="card-image"
            id="tournament-image"
            onerror="this.src='/public/assets/icons/empty.svg';"
          />
          <div class="card-text">
            <div class="card-title" id="tournament-title"></div>
            <div class="card-description" id="tournament-description"></div>
            <div class="card-start-date" id="tournament-start-date"></div>
          </div>
        </div>

        <div class="card-info">
          <div class="player-info">
            <div class="player-count" id="player-count"></div>
            <div class="player-label">Max Players</div>
          </div>
          <div data-show="true" class="tournament-menu">
            <button
              class="menu-button"
              popovertarget="menu-popover"
              style="display: none;"
            >
              <svg
                width="24"
                height="25"
                viewBox="0 0 24 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 6.42C12.2546 6.42 12.4988 6.31886 12.6789 6.13882C12.8589 5.95879 12.96 5.71461 12.96 5.46C12.96 5.20539 12.8589 4.96121 12.6789 4.78118C12.4988 4.60114 12.2546 4.5 12 4.5C11.7454 4.5 11.5013 4.60114 11.3212 4.78118C11.1412 4.96121 11.04 5.20539 11.04 5.46C11.04 5.71461 11.1412 5.95879 11.3212 6.13882C11.5013 6.31886 11.7454 6.42 12 6.42ZM12 13.46C12.2546 13.46 12.4988 13.3589 12.6789 13.1788C12.8589 12.9988 12.96 12.7546 12.96 12.5C12.96 12.2454 12.8589 12.0012 12.6789 11.8212C12.4988 11.6411 12.2546 11.54 12 11.54C11.7454 11.54 11.5013 11.6411 11.3212 11.8212C11.1412 12.0012 11.04 12.2454 11.04 12.5C11.04 12.7546 11.1412 12.9988 11.3212 13.1788C11.5013 13.3589 11.7454 13.46 12 13.46ZM12 20.5C12.2546 20.5 12.4988 20.3989 12.6789 20.2188C12.8589 20.0388 12.96 19.7946 12.96 19.54C12.96 19.2854 12.8589 19.0412 12.6789 18.8612C12.4988 18.6811 12.2546 18.58 12 18.58C11.7454 18.58 11.5013 18.6811 11.3212 18.8612C11.1412 19.0412 11.04 19.2854 11.04 19.54C11.04 19.7946 11.1412 20.0388 11.3212 20.2188C11.5013 20.3989 11.7454 20.5 12 20.5Z"
                  stroke="#F8F8F8"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
            <div id="menu-popover" popover></div>
            <div class="menu">
              <li id="remove-tournament">Remove</li>
            </div>
          </div>
        </div>
      </div>

      <div class="bracket-streaming">
        <div class="bracket hide-scrollbar" id="brackets-container">
          <div class="bracket-content">
            <!-- BRACKETS BOARD -->
          </div>
        </div>

        <div class="streaming-card hide-scrollbar">
          <div class="streaming-header">
            <h6 class="streaming-title">Streaming</h6>
          </div>
          <div class="streaming-content">
            <img
              src="/src/lib/empty.svg"
              alt="empty"
              width="{50}"
              height="{50}"
            />
            <p class="coming-soon">Coming Soon!</p>
          </div>
          <form
            data-registered="false"
            class="register-form"
            id="register-form"
          >
            <button type="submit" class="register-button" id="register-button">
              Register Now
            </button>
          </form>
        </div>
      </div>

      <div class="status-table-container">
        <div class="status-header">
          <h6 class="status-title">States</h6>
        </div>
        <div class="status-table-wrapper">
          <table class="status-table">
            <thead>
              <tr>
                <th>Players</th>
                <th>Score</th>
                <th>Start date</th>
                <th>Finish date</th>
                <th>Winner</th>
              </tr>
            </thead>
            <tbody id="status-table-body"></tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

export function StatusTableRow(match = {}) {
  return html`
    <tr>
      <td>
        <div class="player-row">
          <div class="player-images">
            <div class="player-avatar">
              <img
                src="${match.first_player?.user?.image_url}"
                alt="profile"
                class="avatar-image"
                onerror="this.src='/public/assets/images/defaultImageProfile.jpeg';"
              />
            </div>
            <div class="player-avatar">
              <img
                src="${match.second_player?.user?.image_url}"
                alt="profile"
                class="avatar-image"
                onerror="this.src='/public/assets/images/defaultImageProfile.jpeg';"
              />
            </div>
          </div>
          <div class="player-info">
            <div class="player-name">${match.first_player.alias || "USER"}</div>
            <div class="player-level">
              Level <span>${match.first_player?.user.current_xp || "0"}</span>
            </div>
          </div>
          <p class="vs-text">VS</p>
          <div class="player-info">
            <div class="player-name">
              ${match.second_player?.alias || "USER"}
            </div>
            <div class="player-level">
              Level <span>${match.second_player?.user.current_xp || "0"}</span>
            </div>
          </div>
        </div>
      </td>
      <td>
        ${match.first_player?.score || 0} VS ${match.second_player?.score || 0}
      </td>
      <td>${new Date(match?.created_at).toLocaleString()}</td>
      <td>${new Date(match?.updated_at).toLocaleString()}</td>
      <td>
        <div class="winner-row">
          <div class="winner-avatar">
            <img
              src="${match.Winner?.user?.image_url}"
              alt="profile"
              class="avatar-image"
              onerror="this.src='/public/assets/images/defaultImageProfile.jpeg';"
            />
          </div>
          <div class="winner-info">
            <div class="winner-name">${match?.Winner?.alias}</div>
            <div class="winner-level">
              Level <span>${match.Winner?.user?.current_xp}</span>
            </div>
          </div>
        </div>
      </td>
    </tr>
  `;
}

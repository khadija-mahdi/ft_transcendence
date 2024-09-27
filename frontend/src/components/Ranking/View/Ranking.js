const html = String.raw;

export default function () {
  return html`
    <div class="container">
      <div class="ranking-box">
        <div class="ranking-header">
          <h6>Ranking</h6>
        </div>
        <div class="ranking-table">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Current Experience Points</th>
                <th>coins</th>
                <th>link</th>
              </tr>
            </thead>
            <tbody id="ranking-table-body"></tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

export function rankingItem({
  index,
  image_url,
  fullname,
  username,
  current_xp,
  coins,
}) {
  return html`
    <tr>
      <td><p>${index}</p></td>
      <td>
        <div class="ranking-player-container">
          <img
            src="${image_url}"
            alt="player"
            onerror="this.src='/public/assets/images/defaultImageProfile.jpeg';"
          />
          <p>${fullname || username}</p>
        </div>
      </td>

      <td><p>${current_xp} xp</p></td>
      <td>
        <div class="ranking-coins-container">
          ${coins}
          <img src="/public/assets/icons/money-recive.svg" alt="coin" />
        </div>
      </td>
      <td>
        <a href="/profile?username=${username}" class="btn btn-primary">
          <svg
            width="9"
            height="16"
            viewBox="0 0 9 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 0.904114L8 7.90411L1 14.9041"
              stroke="white"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </a>
      </td>
    </tr>
  `;
}

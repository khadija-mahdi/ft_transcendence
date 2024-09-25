const html = String.raw;

export function tournamentItem({ name, icon, description, max_players }) {
  return html`
    <li>
      <div class="tournament-item">
        <img
          src="${icon}"
          onerror="this.src='/public/assets/images/Unknown.jpg';"
          alt="Tournament Icon"
        />
        <div class="tournament-details">
          <div class="tournament-name">${name}</div>
          <div class="tournament-description">${description}</div>
        </div>
        <div class="max-players">
          <div>
            <div>${max_players}</div>
            <div class="max-players-text">Max Players</div>
          </div>
        </div>
      </div>
    </li>
  `;
}

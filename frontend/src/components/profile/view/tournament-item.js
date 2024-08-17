const html = String.raw;

export function tournamentItem({ name, description, max_players }) {
  return html`
    <li>
      <div class="tournament-item">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgKjTMSLXUNCq2j0fYA9KgZKnfuudUX5Q6Pg&s"
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
          <div class="arrow-icon">
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
        </div>
      </div>
    </li>
  `;
}

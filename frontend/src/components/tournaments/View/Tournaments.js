

export function tournamentElement(id, img, Name, Description, count) {
	return /*html*/`
	 <!-- Tournament Item -->
	 <li class="tournament-item">
            <a href='/${id}'>
              <div class="tournament-card">
                <div class="tournament-info">
                  <img
                    class="tournament-icon"
                    src="${img || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgKjTMSLXUNCq2j0fYA9KgZKnfuudUX5Q6Pg&s'}"
                    alt="tournament icon"
                  />
                  <div class="tournament-details">
                    <div class="tournament-name">${Name}</div>
                    <div class="tournament-description">
                      ${Description}
                    </div>
                  </div>
                </div>
                <div class="tournament-stats">
                  <div class="max-players">
                    <div class="player-count">${count}</div>
                    <div class="player-label">Max Players</div>
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
                        strokeWidth="1.5"
                        d="m9 5.405 7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </a>
          </li>
          <!--  -->
	`
}


export function tournamentWrapper(elements) {
	return /*html*/`
	 <div class="container">
      <div class="tournament-list">
        <div class="tournament-header">
          <h5 class="header-title">Tournaments</h5>
          <button class="create_new_trn">
            <a href="/tournaments/create_tournament">CREATE TOURNAMENTS</a>
          </button>
        </div>
        <ul class="tournament-items">
		${[...elements].join(' ')}
        </ul>
      </div>
    </div>
    `;
}

export default function tournaments() {
	const elements = [tournamentElement(1, null, 'Tournament0', 'test-test-test', 12),
	tournamentElement(1, null, 'Tournament1', 'test-test-test', 12),
	tournamentElement(1, null, 'Tournament2', 'test-test-test', 12),
	tournamentElement(1, null, 'Tournament1', 'test-test-test', 12),
	tournamentElement(1, null, 'Tournament2', 'test-test-test', 12),
	tournamentElement(1, null, 'Tournament1', 'test-test-test', 12),
	tournamentElement(1, null, 'Tournament2', 'test-test-test', 12)]

	return /* html*/`
	<div class='tournament-container'>
		${tournamentWrapper(elements)}
	</div>
	`


};

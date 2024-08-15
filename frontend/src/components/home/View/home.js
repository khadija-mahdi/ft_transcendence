import { tournamentWrapper, tournamentElement } from '../../tournaments/View/Tournaments.js';
import UserSection from '../components/View/UserSection.js';

const elements = [tournamentElement(1, null, 'Tournament0', 'test-test-test', 12),
tournamentElement(1, null, 'Tournament1', 'test-test-test', 12),
tournamentElement(1, null, 'Tournament2', 'test-test-test', 12),
]

export default function () {
	return /*html*/`
    <div class="home">
      <div class="home-container">
        <div class="grid-container">
          <div class="item-section item-a">
            ${UserSection()}
          </div>
          <div class="item-section item-b">
            NewTournaments
          </div>
          <div class="item-section item-c">
            TopPlayers 
          </div>
        </div>

        <div class="grid-container">
          <div class="item-a item-section">
            OnlinePlayers
          </div>
          <div
            class="item-b item-section">
			${tournamentWrapper(elements)}
          </div>
          <div class="item-c item-section">
            Friends
          </div>
        </div>
      </div>
    </div>
    `;
};

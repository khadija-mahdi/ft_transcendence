import { tournamentWrapper, tournamentElement } from '../../tournaments/View/Tournaments.js';
import UserSection from '../components/View/UserSection.js';
import TopPlayers from '../components/View/TopPlayer.js';
import OnlinePlayers from '../components/View/OnlinePlayers.js';
import UserFriends	from '../components/View/UserFriends.js';
import tournemntsSlider from '../components/View/tournemntsSlider.js';


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
            ${tournemntsSlider()}
          </div>
          <div class="item-section item-c">
            ${TopPlayers()} 
          </div>
        </div>

        <div class="grid-container">
          <div class="item-a item-section">
           ${OnlinePlayers()}
          </div>
          <div
            class="item-b item-section">
			${tournamentWrapper(elements)}
          </div>
          <div class="item-c item-section">
            ${UserFriends()}
          </div>
        </div>
      </div>
    </div>
    `;
};

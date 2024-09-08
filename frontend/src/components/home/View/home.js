import {
	tournamentWrapper,
	tournamentElement,
} from "/src/components/tournaments/View/Tournaments.js";
import UserSection from "/src/components/home/components/View/UserSection.js";
import TopPlayers from "/src/components/home/components/View/TopPlayer.js";
import OnlinePlayers from "/src/components/home/components/View/OnlinePlayers.js";
import UserFriends from "/src/components/home/components/View/UserFriends.js";
import tournemntsSlider from "/src/components/home/components/View/tournemntsSlider.js";

export default function () {
	return /*html*/ `
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
			${tournamentWrapper()}
          </div>
          <div class="item-c item-section">
            ${UserFriends()}
          </div>
        </div>
      </div>
    </div>
    `;
}

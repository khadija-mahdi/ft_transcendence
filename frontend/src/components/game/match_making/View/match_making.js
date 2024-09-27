const html = String.raw;

export default () => {
  return html`
    <div class="bg-image">
      <img src="/public/game/matching-bg.jpg" alt="Background" class="bg-img" />
    </div>
    <div class="container-match">
      <button class="play_now_button" id="match-making-play-now-button">
        <svg
          width="25"
          height="24"
          viewBox="0 0 25 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_1760_452)">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M8.4399 13.0609C8.159 12.7796 8.00122 12.3984 8.00122 12.0009C8.00122 11.6034 8.159 11.2221 8.4399 10.9409L14.0959 5.28288C14.3773 5.00161 14.7589 4.84366 15.1568 4.84375C15.3538 4.8438 15.5488 4.88264 15.7308 4.95808C15.9128 5.03351 16.0781 5.14404 16.2174 5.28338C16.3567 5.42271 16.4671 5.58811 16.5425 5.77013C16.6178 5.95215 16.6566 6.14723 16.6565 6.34423C16.6565 6.54123 16.6176 6.73629 16.5422 6.91828C16.4668 7.10026 16.3562 7.26561 16.2169 7.40488L11.6219 12.0009L16.2179 16.5969C16.3612 16.7352 16.4756 16.9006 16.5543 17.0836C16.633 17.2666 16.6744 17.4634 16.6763 17.6626C16.6781 17.8617 16.6402 18.0593 16.5649 18.2436C16.4896 18.428 16.3783 18.5955 16.2375 18.7365C16.0967 18.8774 15.9293 18.9888 15.745 19.0643C15.5607 19.1398 15.3632 19.1779 15.164 19.1762C14.9648 19.1746 14.768 19.1333 14.585 19.0548C14.4019 18.9763 14.2363 18.8621 14.0979 18.7189L8.4379 13.0609H8.4399Z"
              fill="#F8F8F8"
            />
          </g>
          <defs>
            <clipPath id="clip0_1760_452">
              <rect
                width="24"
                height="24"
                fill="white"
                transform="translate(0.5 0.000976562)"
              />
            </clipPath>
          </defs>
        </svg>
        <span id="countdown-timer">01:00</span>
      </button>
      <div class="main-cards-container">
        <div id="my-card" class="player-card">
          <img
            alt="Player Image"
            onerror="this.src='/public/assets/images/defaultImageProfile.jpeg';"
            class="player-image"
          />
          <div class="player-info">
            <div class="player-name"></div>
            <div class="player-rank">
              <img
                onerror="this.src='/public/assets/icons/unranked.png';"
                alt="Rank Icon"
                class="rank-icon"
              />
              <span class="player-level"></span>
            </div>
          </div>
        </div>
        <div class="vs">VS</div>
        <div id="second-player">
          <div class="scroll-parent">
            <div class="player-card scroll-element primary">
              <img
                src="/public/assets/images/Unknown.jpg"
                alt="Player Image"
                class="player-image"
              />
              <img
                onerror="this.src='/public/assets/icons/unranked.png';"
                alt="Rank Icon"
                src=""
                class="rank-icon"
              />
              <div class="player-info">
                <div class="player-name">@Unknown</div>
                <div class="player-rank">
                  <span class="player-level">Lvl.--- </span>
                </div>
              </div>
            </div>
            <div class="player-card scroll-element secondary">
              <img
                src="/public/assets/images/Unknown.jpg"
                alt="Player Image"
                class="player-image"
              />
              <div class="player-info">
                <div class="player-name">@Unknown</div>
                <div class="player-rank">
                  <img
                    onerror="this.src='/public/assets/icons/unranked.png';"
                    alt="Rank Icon"
                    src=""
                    class="rank-icon"
                  />
                  <span class="player-level">Lvl.--- </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
};

export function PlayerCard({ username, image_url, rank, current_xp }) {
  return html` <div class="player-card fade-in-image">
    <img
      src="${image_url}"
		  onerror="this.src='/public/assets/images/Unknown.jpg';"
      alt="Player Image"
      class="player-image"
    />
    <img
      src="${rank?.icon || "/public/assets/icons/unranked.png"}"
      alt="Rank Icon"
      class="rank-icon"
      onerror="this.src='/public/assets/icons/unranked.png';"
    />
    <div class="player-info">
      <div class="player-name">@${username}</div>
      <div class="player-rank">
        <span class="player-level">Lvl.${current_xp || "---"}</span>
      </div>
    </div>
  </div>`;
}

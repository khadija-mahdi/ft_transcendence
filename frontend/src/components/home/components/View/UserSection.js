const html = String.raw;

export default function () {
  return html`
    <body>
      <div id="team-leader">
        <a href="/profile" class="user-link">
          <img
            id="user-image"
            class="user-image"
            onerror="this.src='/public/assets/images/defaultImageProfile.jpeg';"
            alt="user Image"
          />
          <div class="user-info">
            <div id="fullname" class="user-name"></div>
            <div class="user-status">Your Status</div>
          </div>
        </a>

        <div class="progress-user">
          <div id="rank-name" class="progress-text">My Level</div>
          <div id="current-xp" class="progress-xp"></div>
        </div>

        <div id="chart-container" class="chart-container">
          <div
            id="chart-id"
            className="chart-container"
            style="width: 100%; height: 100%"
          >
            <canvas id="user-chart" style="width: 100%; height: 161px"></canvas>
          </div>
        </div>

        <div class="stats">
          <div class="stat-item">
            <div class="stat-label">
              <span class="icon-name">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.7 18.98H7.30002C6.88002 18.98 6.41002 18.65 6.27002 18.25L2.13002 6.66999C1.54002 5.00999 2.23002 4.49999 3.65002 5.51999L7.55002 8.30999C8.20002 8.75999 8.94002 8.52999 9.22002 7.79999L10.98 3.10999C11.54 1.60999 12.47 1.60999 13.03 3.10999L14.79 7.79999C15.07 8.52999 15.81 8.75999 16.45 8.30999L20.11 5.69999C21.67 4.57999 22.42 5.14999 21.78 6.95999L17.74 18.27C17.59 18.65 17.12 18.98 16.7 18.98Z"
                    stroke="white"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M6.5 22H17.5"
                    stroke="white"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M9.5 14H14.5"
                    stroke="white"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                Rank
              </span>
            </div>
            <div id="rank-order" class="stat-value">0</div>
          </div>

          <div class="stat-item">
            <div class="stat-label">
              <span class="icon-name">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.5 13.75C9.5 14.72 10.25 15.5 11.17 15.5H13.05C13.85 15.5 14.5 14.82 14.5 13.97C14.5 13.06 14.1 12.73 13.51 12.52L10.5 11.47C9.91 11.26 9.51001 10.94 9.51001 10.02C9.51001 9.17999 10.16 8.48999 10.96 8.48999H12.84C13.76 8.48999 14.51 9.26999 14.51 10.24"
                    stroke="white"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M12 7.5V16.5"
                    stroke="white"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2"
                    stroke="white"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M17 3V7H21"
                    stroke="white"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M22 2L17 7"
                    stroke="white"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                Coins
              </span>
            </div>
            <div id="coins" class="stat-value">0</div>
          </div>
        </div>

        <a href="/messenger" class="message-link">
          <div class="message-item">
            <div class=" icon-name message-label">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M18.5481 18.5225C16.693 20.3778 14.2512 21.2761 11.8247 21.2237C8.5295 21.1525 2.75 21.2042 2.75 21.2042C2.75 21.2042 2.80068 15.357 2.79819 12.0045C2.79644 9.64195 3.69595 7.27993 5.50162 5.47466C9.10096 1.874 14.9487 1.874 18.5481 5.47373C22.1539 9.07996 22.1474 14.9228 18.5481 18.5225Z"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
                <path
                  d="M8.31468 12.3808H8.21593"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-linecap="square"
                />
                <path
                  d="M12.0489 12.3809H11.9502"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-linecap="square"
                />
                <path
                  d="M15.7832 12.3808H15.6845"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-linecap="square"
                />
              </svg>
              Messages
            </div>
            <div id="messages-count" class="message-value"></div>
          </div>
        </a>
      </div>

      <script src="script.js"></script>
    </body>
  `;
}

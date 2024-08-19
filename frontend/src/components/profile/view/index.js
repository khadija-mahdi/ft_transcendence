const html = String.raw;

export default function profileView() {
  return html`
    <div class="container">
      <div class="profile-header">
        <img
          src="https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg"
          alt="profile background image"
          class="header-img"
        />
        <div class="overlay"></div>

        <div class="header-content">
          <div class="profile-info">
            <div class="profile-pic">
              <img
              id="profile-pic"
                src="https://images.unsplash.com/photo-1667053508464-eb11b394df83?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="profile"
              />
            </div>
            <div class="p-profile-details">
              <div class="p-profile-name-container">
                <h6 class="p-profile-name" id='profile-name'
                >FullName</h6>
                <p class="p-profile-username" id='profile-username' 
                >@UserName</p>
              </div>
              <button class="cta-button" id='profile-cta-button'>
                <img src="" alt="Call To Action Button Icon" />
                <p>Add As Friend</p>
              </button>
            </div>
          </div>

          <div class="header-info">
            <div class="rank-achievements">
              <div class="rank">
                <h6>RANK</h6>
                <div class="rank-details">
                  <img
                    src="https://listium-res.cloudinary.com/image/upload/w_800,h_800,c_limit,q_auto,f_auto/uxakd266pstgitxtxlwk.png"
                    alt="profile"
                  />
                  <p>Unranked</p>
                </div>
              </div>
              <div class="top-achievements">
                <h6>TOP ACHIEVEMENTS</h6>
                <ul class="achievement-list">
                  <li class="achievement-item">
                    <img src="" alt="userInfo Icon" />
                    <h6>{achievement.name}</h6>
                  </li>
                  <li class="achievement-item">
                    <img src="" alt="userInfo Icon" />
                    <h6>{achievement.name}</h6>
                  </li>
                  <li class="achievement-item">
                    <img src="" alt="userInfo Icon" />
                    <h6>{achievement.name}</h6>
                  </li>
                </ul>
              </div>
            </div>
            <div class="progress-bar-container">
              <div class="progress-bar">
                <h6>10%</h6>
              </div>
              <div class="xp">
                <h6>600XP</h6>
              </div>
            </div>
          </div>
          <div class="user-info-container">
            <ul class="user-info-list" id='user-info-list'>
              <!-- User Info Item -->
            
              <!-- End User Info Item -->
            </ul>
            <div class="user-into-cta">
              <!-- CTA -->
              <button>
                <img
                  src="/assets/icons/directbox-send.svg"
                  alt="Call To Action Button Icon"
                />
                <p>Invite</p>
              </button>
              <!-- End CTA -->
            </div>
          </div>
        </div>

        <div class="menu-button">
          <div class="three-dots">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="21"
              fill="none"
            >
              <path
                stroke="#F8F8F8"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="{1.5}"
                d="M12 6.42a.96.96 0 1 0 0-1.92.96.96 0 0 0 0 1.92Zm0 7.04a.96.96 0 1 0 0-1.92.96.96 0 0 0 0 1.92Zm0 7.04a.96.96 0 1 0 0-1.92.96.96 0 0 0 0 1.92Z"
              />
            </svg>
          </div>
          <div class="dropdown-menu">
            <button class="menu-item">
              <img src="" alt="UnFriend Button" />
              <p class="menu-item-text">UnFriend</p>
            </button>
            <button class="menu-item">
              <img src="" alt="Block Button" />
              <p class="menu-item-text">Block</p>
            </button>
            <button class="menu-item">
              <img src="" alt="Invite Button" />
              <p class="menu-item-text">Invite</p>
            </button>
          </div>
        </div>
      </div>

      <!-- profile Body -->
      <div class="profile-body">
        <div class="tournament-history">
          <h6>Tournament History</h6>
          <ul id="tournament-history">
            ${/* Tournament Item */ ""}
          </ul>
        </div>

        <div class="match-history">
          <h6>Match History</h6>
          <ul id="match-history">
            ${/* Match Item */ ""}
          </ul>
        </div>

        <div class="last-achievements">
          <h6>Last Achievements</h6>
          <ul id="last-achievements">
            ${/* Achievement Item */ ""}
          </ul>
        </div>
      </div>

      <!-- End -->
    </div>
  `;
}

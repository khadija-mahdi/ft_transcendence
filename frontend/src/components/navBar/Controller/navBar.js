import { fetchWithAuth } from "/src/lib/apiMock.js";
import { Empty } from "/src/lib/Empty.js";
import { API_URL } from "/config.js";
import { SerializeInviteAction } from "/src/lib/Confirm.js";
const html = String.raw;

let apiUrl = null;
let allNotifications = [];

export async function fetchNotifications(isScroll = false) {
  if (!isScroll) apiUrl = `/api/v1/notifications/`;
  try {
    const response = await fetchWithAuth(apiUrl, {
      method: "GET",
    });
    allNotifications.push(...response.results);
    apiUrl = response.next;
    renderNotifications(allNotifications);
  } catch (error) {
    return [];
  }
}

async function loadNavbar() {
  const path = window.location.pathname;
  if (
    path === "/game/choice-game" ||
    (!path.startsWith("/game") && !path.startsWith("/auth/"))
  ) {
    try {
      const response = await fetch("/src/components/navBar/View/navBar.html");
      if (!response.ok) throw new Error("Network response was not ok");

      const navbarHTML = await response.text();

      document.body.insertAdjacentHTML("afterbegin", navbarHTML);

      fetchMyData();

      let playBtn = document.getElementById("playButton");
      if (playBtn) {
        if (path === "/game/choice-game") {
          playBtn.remove();
        }
      }
      renderNavBrContent();

      await fetchNotifications();
      document.getElementById("notif").addEventListener("click", function () {
        const panel = document.getElementById("notification-panel");
        panel.classList.toggle("hidden");
      });

      document.addEventListener("click", function (event) {
        const panel = document.getElementById("notification-panel");
        const notifButton = document.getElementById("notif");
        if (
          !panel.contains(event.target) &&
          !notifButton.contains(event.target)
        ) {
          panel.classList.add("hidden");
        }
      });

      handleScroll();
    } catch (error) {
      console.error("Error loading navbar:", error);
    }
  }
}

export function handleScroll() {
  const NotContent = document.getElementById("notification-list");
  if (!NotContent) return;

  NotContent.addEventListener("scroll", async () => {
    const scrollPosition = NotContent.scrollTop + NotContent.clientHeight;
    const scrollHeight = NotContent.scrollHeight;
    const tolerance = 5;
    const isAtBottom = scrollPosition >= scrollHeight - tolerance;
    if (isAtBottom) {
      if (apiUrl) {
        await fetchNotifications(true);
      }
    }
  });
}

export function renderNotifications(notifications) {
  let badge = document.getElementById("notification-badge");
  badge.innerHTML = !apiUrl ? notifications.length : notifications.length + "+";
  if (!notifications) return;
  function formatDate(dateString) {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleString(undefined, options);
  }
  let href = "";
  const notificationList = document.getElementById("notification-list");
  if (!notificationList) return;
  notificationList.innerHTML = "";

  if (!notifications.length) {
    const emptyComponent = Empty("No Notification Found");
    const emptyContainer = document.createElement("div");
    emptyContainer.className = "emptyContainer";
    emptyContainer.appendChild(emptyComponent);
    notificationList.appendChild(emptyContainer);
  } else {
    notifications.forEach((notification, index) => {
      notification.action = SerializeInviteAction(notification.action);
      switch (notification.type) {
        case "friend-request":
          href = `/profile?username=${notification.sender.username}`;
          break;
        case "messenger":
          href = `/messenger?chatroom=${notification.sender.id}`;
          break;

        case "game-invite":
          href = `/game/match_making?player=${notification.action?.player}&invite-uuid=${notification.action?.invite_id}`;
          break;

        case "new-game":
          href = `/game?uuid=${notification.action?.match_uuid}`;
          break;
      }
      const notificationItem = document.createElement("li");
      notificationItem.className = "notification-item";

      notificationItem.innerHTML = html`
        <a href="${href}" class="notification-link">
          <div class="notification-image-container">
            <img
              class="notification-image"
              src= notification.sender.image_url
              alt="Profile Image"
              width="35"
              height="35"
              onerror="this.src='/public/assets/images/defaultImageProfile.jpeg';"
              ;
            />
          </div>
          <div class="notification-text-container">
            <div class="notification-text">${notification.title}</div>
            <div class="notification-time">
              ${formatDate(notification.created_at)}
            </div>
          </div>
        </a>
        <div class="notification-menu-container remove-not">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.97471 11.9906H12.5147C12.6915 12.0006 12.8679 11.965 13.0271 11.8874C13.1862 11.8098 13.3228 11.6927 13.4239 11.5473C13.525 11.4019 13.5871 11.2331 13.6044 11.0569C13.6217 10.8806 13.5936 10.7029 13.5227 10.5406C13.2827 9.81532 12.326 8.94532 12.326 8.08932C12.326 6.18932 12.326 5.68932 11.3907 4.57198C11.0876 4.21226 10.7118 3.92077 10.288 3.71665L9.76605 3.46332C9.67846 3.41045 9.6029 3.33984 9.54423 3.25602C9.48556 3.17221 9.44507 3.07704 9.42538 2.97665C9.3732 2.63825 9.19427 2.33237 8.92488 2.12104C8.65549 1.90971 8.3158 1.80876 7.97471 1.83865C7.63982 1.81869 7.3095 1.9242 7.04819 2.13461C6.78689 2.34501 6.61333 2.64521 6.56138 2.97665C6.53795 3.08045 6.49202 3.17784 6.42681 3.26193C6.36161 3.34602 6.27874 3.41477 6.18405 3.46332L5.66138 3.71665C5.23807 3.92092 4.86275 4.21241 4.56005 4.57198C3.62471 5.68932 3.62471 6.18932 3.62471 8.08932C3.62471 8.94532 2.71138 9.72798 2.47138 10.4966C2.32671 10.9613 2.24671 11.9906 3.45805 11.9906H7.97471Z"
              stroke="#A2A2A2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M10.1507 11.9907C10.1568 12.2781 10.1047 12.5638 9.99748 12.8305C9.89028 13.0972 9.73021 13.3395 9.52691 13.5427C9.32361 13.746 9.0813 13.906 8.81454 14.0131C8.54779 14.1202 8.26211 14.1722 7.97472 14.1661C7.68741 14.1721 7.40184 14.12 7.1352 14.0129C6.86856 13.9057 6.62636 13.7457 6.42319 13.5424C6.22002 13.3392 6.06007 13.097 5.95298 12.8303C5.84589 12.5636 5.79387 12.278 5.80005 11.9907"
              stroke="#A2A2A2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M9.16671 6.3313L6.83337 8.6593M6.83337 6.33597L9.16671 8.66463"
              stroke="#A2A2A2"
              stroke-miterlimit="10"
              stroke-linecap="round"
            />
          </svg>
        </div>
      `;
      notificationList.appendChild(notificationItem);

      const removeNot = notificationItem.querySelector(".remove-not");
      if (removeNot) {
        removeNot.addEventListener("click", async function () {
          let apiUrl = `/api/v1/notifications/${notification.id}/`;
          try {
            await fetchWithAuth(apiUrl, {
              method: "DELETE",
            });

            notifications.splice(index, 1);

            renderNotifications(notifications);
          } catch (error) {
            return;
          }
        });
      }
    });
  }
}

function renderNavBrContent() {
  const navItems = document.querySelectorAll(".nav-item.nav a");
  navItems.forEach((navItem) => {
    if (window.location.pathname.startsWith(navItem.getAttribute("href"))) {
      const svg = navItem.querySelector("svg path");
      const paragraph = navItem.querySelector("p");

      if (svg) svg.setAttribute("fill", "#FD4106");
      if (paragraph) paragraph.style.color = "#FD4106";
      const underline = document.createElement("div");
      underline.style.width = "100%";
      underline.style.height = "2px";
      underline.style.backgroundColor = "#FD4106";
      underline.style.position = "absolute";
      underline.style.bottom = "0";
      underline.style.left = "0";
      navItem.style.position = "relative";

      navItem.appendChild(underline);
    }
  });
}

async function fetchMyData() {
  const apiUrl = "/api/v1/users/me/";

  try {
    const data = await fetchWithAuth(apiUrl, {
      method: "GET",
    });
    ProfilePanel(data);
  } catch (error) {
    return;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  fetchMyData();
});

function ProfilePanel(user) {
  if (!user) return;
  const profileIcon = document.getElementById("profile-icon");
  const profilePanel = document.getElementById("profile-panel");

  let isClicked = false;

  const toggleProfilePanel = () => {
    isClicked = !isClicked;
    profilePanel.style.display = isClicked ? "block" : "none";
    if (isClicked) {
      document.getElementById(
        "profile-icon-toggle"
      ).innerHTML = `<svg class="dropdown-svg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 8">
							<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
								stroke-width="1.52" d="M1 1l5.326 5.7a.91.91 0 0 0 1.348 0L13 1" />
						</svg>`;
    } else {
      document.getElementById(
        "profile-icon-toggle"
      ).innerHTML = `						<svg class="dropdown-svg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 8">
							<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
								stroke-width="1.52" d="M13 7 7.674 1.3a.91.91 0 0 0-1.348 0L1 7" />
						</svg>`;
    }
  };

  profileIcon.addEventListener("click", toggleProfilePanel);

  document.addEventListener("mousedown", (event) => {
    const target = event.target;
    if (
      profilePanel &&
      !profilePanel.contains(target) &&
      !profileIcon.contains(target)
    ) {
      isClicked = false;
      profilePanel.style.display = "none";
    }
  });

  document.getElementById("profile-image").src =
    user.image_url || "/public/assets/images/defaultImageProfile.jpeg";
  document.getElementById("panel-profile-image").src =
    user.image_url || "/public/assets/images/defaultImageProfile.jpeg";
  document.getElementById("profile-username").textContent = user.username;
  document.getElementById(
    "profile-level"
  ).textContent = `Lvl ${user.current_xp}`;
  document.getElementById("panel-fullname").textContent = user.fullname
    ? user.fullname
    : "";
  document.getElementById("panel-username").textContent = "@" + user.username;
  function checkWindowSize() {
    user.xp_required && user.current_xp;

    if (window.innerWidth < 1200) {
      iconsSmallWindow();
    } else {
      let icons = document.getElementById("icons-panel-links");
      let social = document.getElementById("social-panel-links");
      social.innerHTML = ``;
      icons.innerHTML = ``;
    }
  }

  checkWindowSize();

  window.addEventListener("resize", checkWindowSize);
  document.getElementById("view-profile-link").addEventListener("click", () => {
    toggleProfilePanel();
  });

  document.getElementById("signout-link").addEventListener("click", () => {
    document.cookie.split(";").forEach((c) => {
      document.cookie =
        c.trim().split("=")[0] +
        "=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    });
    window.location.pathname = "/auth/";
  });
}

function iconsSmallWindow() {
  let icons = document.getElementById("icons-panel-links");
  icons.innerHTML = `
	<div class="icons-panel-links">
		<div class="navbar-container">
			<div class="nav-links">
				<div class="desktop-nav" style="display: block; margin-bottom: 15px;">
					<ul class="nav-list">
						<!-- nav Link -->
						<li class="nav-item nav">
							<a href="/home" class="no-underline group">
								<div class="nav-icons">
									<svg xmlns="http://www.w3.org/2000/svg" width="30" height="31">
										<path fill-opacity="0.8"
											d="M12.5 25.452v-7.5h5v7.5h6.25v-10h3.75L15 4.202 2.5 15.452h3.75v10h6.25Z" />
									</svg>
									<p>Home</p>
								</div>
							</a>
						</li>
						<!-- nav Link -->
						<li class="nav-item nav">
							<a href="/tournaments" class="no-underline group">
								<div class="nav-icons">
									<svg xmlns="http://www.w3.org/2000/svg" width="30" height="31">
										<path fill-opacity="0.8"
											d="M5 4.202h20a1.25 1.25 0 0 1 1.25 1.25v8.75H3.75v-8.75A1.25 1.25 0 0 1 5 4.202Zm-1.25 12.5h22.5v8.75a1.25 1.25 0 0 1-1.25 1.25H5a1.25 1.25 0 0 1-1.25-1.25v-8.75Zm5 3.75v2.5h3.75v-2.5H8.75Zm0-12.5v2.5h3.75v-2.5H8.75Z" />
									</svg>
									<p>Tournaments</p>
								</div>
							</a>
						</li>
						<!-- nav Link -->
						<li class="nav-item nav">
							<a href="/ranking" class="no-underline group">
								<div class="nav-icons">
									<svg width="30" height="31" viewBox="0 0 30 31" xmlns="http://www.w3.org/2000/svg">
										<path fill-rule="evenodd" clip-rule="evenodd"
											d="M4.33 4.78206C2.5 6.61456 2.5 9.55956 2.5 15.4521C2.5 21.3446 2.5 24.2908 4.33 26.1208C6.1625 27.9521 9.1075 27.9521 15 27.9521C20.8925 27.9521 23.8387 27.9521 25.6688 26.1208C27.5 24.2921 27.5 21.3446 27.5 15.4521C27.5 9.55956 27.5 6.61331 25.6688 4.78206C23.84 2.95206 20.8925 2.95206 15 2.95206C9.1075 2.95206 6.16125 2.95206 4.33 4.78206ZM21.97 13.5521C22.1221 13.3603 22.1932 13.1167 22.1682 12.8733C22.1431 12.6298 22.0238 12.4058 21.8358 12.2491C21.6478 12.0925 21.4059 12.0155 21.1619 12.0347C20.9179 12.054 20.6911 12.1679 20.53 12.3521L18.2837 15.0471C17.8212 15.6033 17.535 15.9421 17.3012 16.1533C17.2404 16.213 17.1719 16.2643 17.0975 16.3058L17.0837 16.3121L17.0738 16.3071L17.07 16.3058C16.9952 16.2643 16.9262 16.2131 16.865 16.1533C16.6312 15.9408 16.3463 15.6033 15.8825 15.0471L15.5175 14.6096C15.1075 14.1158 14.7362 13.6721 14.3912 13.3596C14.015 13.0196 13.5413 12.7171 12.9163 12.7171C12.2913 12.7171 11.8187 13.0196 11.4412 13.3596C11.0962 13.6721 10.7263 14.1158 10.3163 14.6096L8.02875 17.3521C7.94996 17.4467 7.89057 17.5559 7.85399 17.6735C7.81741 17.7911 7.80435 17.9147 7.81555 18.0374C7.83817 18.285 7.95825 18.5136 8.14937 18.6727C8.3405 18.8318 8.587 18.9085 8.83467 18.8859C9.08233 18.8633 9.31087 18.7432 9.47 18.5521L11.7163 15.8571C12.1788 15.3008 12.465 14.9621 12.6988 14.7508C12.7596 14.6911 12.8281 14.6398 12.9025 14.5983L12.9113 14.5946L12.9163 14.5921L12.93 14.5983C13.0048 14.6398 13.0738 14.6911 13.135 14.7508C13.3688 14.9633 13.6537 15.3008 14.1175 15.8571L14.4825 16.2946C14.8938 16.7883 15.2638 17.2321 15.6088 17.5446C15.985 17.8846 16.4587 18.1871 17.0837 18.1871C17.7087 18.1871 18.1813 17.8846 18.5588 17.5446C18.9037 17.2321 19.2738 16.7883 19.6838 16.2946L21.97 13.5521Z" />
									</svg>
									<p>Ranking</p>
								</div>
							</a>
						</li>
						<!--  -->
					</ul>
				</div>
			</div>
	</div>
	`;
  renderNavBrContent();

  let social = document.getElementById("social-panel-links");
  social.innerHTML = `
	<div class="icons-panel-links">
			<div class="desktop-nav" style="display: block;">
				<ul class="social-list">
					<!-- Social Button -->
					<div class="social-icon">
						<div id="notification-icon" class="icon-container">
							<a href="https://profile.intra.42.fr/" passHref class="icon-link">
								<div class="icon-content">
									<svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" fill="#545454">
										<g fill="#545454" clip-path="url(#a)">
											<path
												d="M0 12.745h7.37v4.207h3.676V9.35H3.692L11.046.952H7.37L0 9.35v3.395ZM12.63 5.16 16.309.951h-3.677v4.207Z" />
											<path
												d="m16.308 5.16-3.677 4.19v4.19h3.677V9.35L20 5.16V.951h-3.692v4.207Z" />
											<path d="m20 9.35-3.692 4.19H20V9.35Z" />
										</g>
										<defs>
											<clipPath id="a">
												<path fill="#545454" d="M0 .952h20v16H0z" />
											</clipPath>
										</defs>
									</svg>
								</div>
							</a>
						</div>
					</div>
					<!-- Social Button -->
					<div class="social-icon">
						<div id="notification-icon" class="icon-container">
							<a href="https://www.twitch.tv/" passHref class="icon-link">
								<div class="icon-content">
									<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#545454">
										<g clip-path="url(#a)">
											<path fill="#545454"
												d="M15.28 4.994h-1.509v4.285h1.51V4.994Zm-4.147-.019h-1.51v4.288h1.51V4.975ZM4.72.952.95 4.523v12.858h4.524v3.571l3.771-3.571h3.018l6.787-6.429v-10H4.72Zm12.822 9.287-3.017 2.856h-3.017l-2.64 2.5v-2.5H5.474V2.381h12.068v7.858Z" />
										</g>
										<defs>
											<clipPath id="a">
												<path fill="#545454" d="M0 .952h20v20H0z" />
											</clipPath>
										</defs>
									</svg>
								</div>
							</a>
						</div>
					</div>
					<!-- Social Button -->
					<div class="social-icon">
						<div id="notification-icon" class="icon-container">
							<a href="https://discord.com/" passHref class="icon-link">
								<div class="icon-content">
									<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#545454">
										<path fill="#545454"
											d="M15.45.952c1.118 0 2.031.901 2.05 2.025v17.975l-2.15-1.9-1.21-1.12-1.28-1.19.53 1.85H2.05A2.055 2.055 0 0 1 0 16.567V3.012C0 1.884.901.971 2.015.952H15.45Zm-8.13 4.78-.1-.12h-.057c-.273.009-1.486.1-2.753 1.05l-.048.092c-.251.49-1.392 2.872-1.392 5.738l.02.033c.142.217 1.019 1.423 3.03 1.487l.295-.361.375-.469c-1.166-.349-1.666-1.051-1.74-1.164l-.01-.016.041.027c.045.03.127.08.239.143.01.01.02.02.04.03.03.02.06.03.09.05.25.14.5.25.73.34.41.16.9.32 1.47.43.729.136 1.58.187 2.508.025l.082-.015c.47-.08.95-.22 1.45-.43.35-.13.74-.32 1.15-.59l-.016.025c-.096.14-.62.833-1.794 1.165l.165.207c.253.314.495.603.495.603 2.21-.07 3.06-1.52 3.06-1.52 0-3.22-1.44-5.83-1.44-5.83-1.238-.929-2.425-1.037-2.733-1.049l-.077-.001-.14.16c1.508.461 2.3 1.103 2.46 1.243l.03.027a8.152 8.152 0 0 0-5.03-.94c-.06 0-.11.01-.17.02l-.056.005c-.38.039-1.197.179-2.214.625l-.145.068c-.182.086-.314.153-.385.19l-.06.032s.813-.774 2.576-1.294l.054-.016Zm-.38 3.61c.57 0 1.03.5 1.02 1.11 0 .61-.45 1.11-1.02 1.11-.56 0-1.02-.5-1.02-1.11 0-.61.45-1.11 1.02-1.11Zm3.65 0c.57 0 1.02.5 1.02 1.11 0 .61-.45 1.11-1.02 1.11-.56 0-1.02-.5-1.02-1.11 0-.61.45-1.11 1.02-1.11Z" />
									</svg>
								</div>
							</a>
						</div>
					</div>
					<div class="social-icon">
						<div id="notification-icon" class="icon-container">
							<a href="/notification"passHref class="icon-link" id="notif">
								<div class="icon-content">
									<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#545454">
										<path fill="#545454"
											d="M3 8.952a6 6 0 0 1 4.03-5.67 2 2 0 1 1 3.95 0A6 6 0 0 1 15 8.952v6l3 2v1H0v-1l3-2v-6Zm8 10a2 2 0 1 1-4 0h4Z" />
									</svg>
									<span id="notification-badge" class="notification-badge">${
                    apiUrl ? "30+" : allNotifications.length
                  }</span> <!-- Add this line -->
								</div>
							</a>
						</div>
					</div>
				</ul>
			</div>
	</div>
	`;
}

loadNavbar();

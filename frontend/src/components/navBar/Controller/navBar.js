const notifications = [
  {
    text: "You have a new message",
    time: "10:24",
    image: "components/auth/assets/google.svg",
  },
  {
    text: "You have a new message",
    time: "10:24",
    image: "components/auth/assets/google.svg",
  },
  {
    text: "You have a new message",
    time: "10:24",
    image: "components/auth/assets/google.svg",
  },
  {
    text: "You have a new message",
    time: "10:24",
    image: "components/auth/assets/google.svg",
  },
  {
    text: "You have a new message",
    time: "10:24",
    image: "components/auth/assets/google.svg",
  },
  {
    text: "You have a new message",
    time: "10:24",
    image: "components/auth/assets/google.svg",
  },
  {
    text: "You have a new message",
    time: "10:24",
    image: "components/auth/assets/google.svg",
  },
  {
    text: "Your order has been shipped",
    time: "11:00",
    image: "/components/auth/assets/42_logo.svg",
  },
];

function getCookieValue(name) {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(name + "=")) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
}

async function loadNavbar() {
  const path = window.location.pathname;

  if (!path.startsWith("/game") && !path.startsWith("/sign")) {
    try {
      const response = await fetch("/components/navBar/View/navBar.html");
      if (!response.ok) throw new Error("Network response was not ok");
      const navbarHTML = await response.text();

      document.body.insertAdjacentHTML("afterbegin", navbarHTML);

      renderNavBrContent();

      fetchMyData();
      renderNotifications();

      document.getElementById("notif").addEventListener("click", function () {
        const panel = document.getElementById("notification-panel");
        panel.classList.toggle("hidden");
      });

      document.addEventListener("DOMContentLoaded", renderNotifications);

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
    } catch (error) {
      console.error("Error loading navbar:", error);
    }
  }
}

function renderNotifications() {
  const notificationList = document.getElementById("notification-list");
  notificationList.innerHTML = "";

  notifications.forEach((notification) => {
    const notificationItem = document.createElement("li");
    notificationItem.className = "notification-item";

    notificationItem.innerHTML = /*html*/ `
            <a href="${notification.link || ""}" class="notification-link">
                <div class="notification-image-container">
                    <img class="notification-image" src="${
                      notification.image
                    }" alt="Profile Image" width="35" height="35" />
                </div>
                <div class="notification-text-container">
                    <div class="notification-text">${notification.text}</div>
                    <div class="notification-time">${notification.time}</div>
                </div>
            </a>
            <div class="notification-menu-container">
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M7.97471 11.9906H12.5147C12.6915 12.0006 12.8679 11.965 13.0271 11.8874C13.1862 11.8098 13.3228 11.6927 13.4239 11.5473C13.525 11.4019 13.5871 11.2331 13.6044 11.0569C13.6217 10.8806 13.5936 10.7029 13.5227 10.5406C13.2827 9.81532 12.326 8.94532 12.326 8.08932C12.326 6.18932 12.326 5.68932 11.3907 4.57198C11.0876 4.21226 10.7118 3.92077 10.288 3.71665L9.76605 3.46332C9.67846 3.41045 9.6029 3.33984 9.54423 3.25602C9.48556 3.17221 9.44507 3.07704 9.42538 2.97665C9.3732 2.63825 9.19427 2.33237 8.92488 2.12104C8.65549 1.90971 8.3158 1.80876 7.97471 1.83865C7.63982 1.81869 7.3095 1.9242 7.04819 2.13461C6.78689 2.34501 6.61333 2.64521 6.56138 2.97665C6.53795 3.08045 6.49202 3.17784 6.42681 3.26193C6.36161 3.34602 6.27874 3.41477 6.18405 3.46332L5.66138 3.71665C5.23807 3.92092 4.86275 4.21241 4.56005 4.57198C3.62471 5.68932 3.62471 6.18932 3.62471 8.08932C3.62471 8.94532 2.71138 9.72798 2.47138 10.4966C2.32671 10.9613 2.24671 11.9906 3.45805 11.9906H7.97471Z" stroke="#A2A2A2" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M10.1507 11.9907C10.1568 12.2781 10.1047 12.5638 9.99748 12.8305C9.89028 13.0972 9.73021 13.3395 9.52691 13.5427C9.32361 13.746 9.0813 13.906 8.81454 14.0131C8.54779 14.1202 8.26211 14.1722 7.97472 14.1661C7.68741 14.1721 7.40184 14.12 7.1352 14.0129C6.86856 13.9057 6.62636 13.7457 6.42319 13.5424C6.22002 13.3392 6.06007 13.097 5.95298 12.8303C5.84589 12.5636 5.79387 12.278 5.80005 11.9907" stroke="#A2A2A2" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M9.16671 6.3313L6.83337 8.6593M6.83337 6.33597L9.16671 8.66463" stroke="#A2A2A2" stroke-miterlimit="10" stroke-linecap="round"/>
				</svg>
            </div>
        `;

    notificationList.appendChild(notificationItem);
  });
}

function renderNavBrContent() {
  console.log("Applying navbar styles...");
  const navItems = document.querySelectorAll(".nav-item.nav a");

  navItems.forEach((navItem) => {
    if (window.location.pathname === navItem.getAttribute("href")) {
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
  const accessToken = getCookieValue("access");
  const refreshToken = getCookieValue("refresh"); // Note: This might not be needed for this request

  if (!accessToken || refreshToken) return;
  const apiUrl = "https://localhost:4433/api/v1/users/me/";

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`, // Include the access token in the Authorization header
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    data.image_url = data.image_url.replace(
      "https://localhost/",
      "https://localhost:4433/"
    );
    data.rank.icon = data.rank.icon.replace(
      "https://localhost/",
      "https://localhost:4433/"
    );
    handleUserData(data);
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}

function handleUserData(data) {
  const profileButton = document.querySelector(".profile-button .profile");
  console.log(data.username);
  if (!profileButton) return;

  profileButton.innerHTML = `
		<div class="profile-content">
			<div class="profile-image">
				<img src="${
          data.image_url || "components/auth/assets/google.svg"
        }" alt="Profile Image" />
			</div>
			<div class="profile-details">
				<div class="profile-name">${data.username}</div>
				<div class="profile-level">Level ${
          data.current_xp + "/" + data.rank.xp_required
        }</div>
			</div>
		</div>
		<div id="profile-icon" class="profile-dropdown-icon">
			<svg class="dropdown-svg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 8">
				<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.52" d="M13 7 7.674 1.3a.91.91 0 0 0-1.348 0L1 7" />
			</svg>
		</div>
	`;
}

// Ensure DOM is fully loaded before calling fetchMyData
document.addEventListener("DOMContentLoaded", function () {
  fetchMyData();
});

loadNavbar();

// loadNavbar();

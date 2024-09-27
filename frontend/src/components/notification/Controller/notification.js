import { fetchWithAuth } from "/src/lib/apiMock.js";
import { Empty } from "/src/lib/Empty.js";
import { API_URL } from "/config.js";
import { SerializeInviteAction } from "/src/lib/Confirm.js";

let apiUrl = null;
let allNotifications = [];
let Not_length = 0;

export async function fetchNotifications(isScroll = false) {
  if (!isScroll) apiUrl = `/api/v1/notifications/`;
  try {
    const response = await fetchWithAuth(apiUrl, {
      method: "GET",
    });
    allNotifications.push(...response.results);
    Not_length = response.count;
    renderNotifications(allNotifications);
    apiUrl = response.next;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
}
export function renderNotifications(notifications) {
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
  const notificationList = document.getElementById("notifications-list");
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

      notificationItem.innerHTML = /*html*/ `
            <a href="${href}" class="notification-link">
                <div class="notification-image-container">
                    <img class="notification-image" src=  notification.sender.image_url
 
					onerror="this.src='/public/assets/images/defaultImageProfile.jpeg';"
					alt="Profile Image" width="35" height="35" />
                </div>
                <div class="notification-text-container">
                    <div class="notification-text">${notification.title}</div>
                    <div class="notification-time">${formatDate(
        notification.created_at
      )}</div>
                </div>
            </a>
            <div class="notification-menu-container remove-not">
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M7.97471 11.9906H12.5147C12.6915 12.0006 12.8679 11.965 13.0271 11.8874C13.1862 11.8098 13.3228 11.6927 13.4239 11.5473C13.525 11.4019 13.5871 11.2331 13.6044 11.0569C13.6217 10.8806 13.5936 10.7029 13.5227 10.5406C13.2827 9.81532 12.326 8.94532 12.326 8.08932C12.326 6.18932 12.326 5.68932 11.3907 4.57198C11.0876 4.21226 10.7118 3.92077 10.288 3.71665L9.76605 3.46332C9.67846 3.41045 9.6029 3.33984 9.54423 3.25602C9.48556 3.17221 9.44507 3.07704 9.42538 2.97665C9.3732 2.63825 9.19427 2.33237 8.92488 2.12104C8.65549 1.90971 8.3158 1.80876 7.97471 1.83865C7.63982 1.81869 7.3095 1.9242 7.04819 2.13461C6.78689 2.34501 6.61333 2.64521 6.56138 2.97665C6.53795 3.08045 6.49202 3.17784 6.42681 3.26193C6.36161 3.34602 6.27874 3.41477 6.18405 3.46332L5.66138 3.71665C5.23807 3.92092 4.86275 4.21241 4.56005 4.57198C3.62471 5.68932 3.62471 6.18932 3.62471 8.08932C3.62471 8.94532 2.71138 9.72798 2.47138 10.4966C2.32671 10.9613 2.24671 11.9906 3.45805 11.9906H7.97471Z" stroke="#A2A2A2" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M10.1507 11.9907C10.1568 12.2781 10.1047 12.5638 9.99748 12.8305C9.89028 13.0972 9.73021 13.3395 9.52691 13.5427C9.32361 13.746 9.0813 13.906 8.81454 14.0131C8.54779 14.1202 8.26211 14.1722 7.97472 14.1661C7.68741 14.1721 7.40184 14.12 7.1352 14.0129C6.86856 13.9057 6.62636 13.7457 6.42319 13.5424C6.22002 13.3392 6.06007 13.097 5.95298 12.8303C5.84589 12.5636 5.79387 12.278 5.80005 11.9907" stroke="#A2A2A2" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M9.16671 6.3313L6.83337 8.6593M6.83337 6.33597L9.16671 8.66463" stroke="#A2A2A2" stroke-miterlimit="10" stroke-linecap="round"/>
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

export default function () {
  fetchNotifications();
  const NotContent = document.getElementById("notifications-list");
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

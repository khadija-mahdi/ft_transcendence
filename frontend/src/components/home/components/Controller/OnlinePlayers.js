import { Empty } from "/src/lib/Empty.js";
import { fetchWithAuth } from "/src/lib/apiMock.js";
import { API_URL } from "/config.js";
import { InvitePlayer } from "/src/_api/user.js";
export function OnlinePlayerContainer({ id, name, href, number, index }) {
  const container = document.createElement("div");
  container.className = "friend-container";

  const link = document.createElement("a");
  link.href = `/profile?username=${name}`;
  link.className = "friend-link";

  const image = document.createElement("img");
  image.className = "friend-profile-image";
  image.src = href;
  image.alt = "Profile Image";
  image.width = 53;
  image.height = 53;
  image.onerror = () => {
    image.src = "/public/assets/images/defaultImageProfile.jpeg";
  };
  const textContainer = document.createElement("div");
  textContainer.className = "friend-text-container";

  const nameDiv = document.createElement("div");
  nameDiv.className = "friend-name";
  nameDiv.textContent = name;

  const levelDiv = document.createElement("div");
  levelDiv.className = "friend-level";
  levelDiv.textContent = `level ${number} `;

  textContainer.appendChild(nameDiv);
  textContainer.appendChild(levelDiv);

  link.appendChild(image);
  link.appendChild(textContainer);

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "16");
  svg.setAttribute("height", "15");
  svg.setAttribute("fill", "none");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.setAttribute("clip-path", "url(#a)");

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("fill", "#F8F8F8");
  path.setAttribute(
    "d",
    "M12.375 10.625v1.25h-7.5v-1.25s0-2.5 3.75-2.5 3.75 2.5 3.75 2.5ZM10.5 5a1.875 1.875 0 1 0-3.75 0 1.875 1.875 0 0 0 3.75 0Zm2 3.162a3.5 3.5 0 0 1 1.125 2.463v1.25H15.5v-1.25s0-2.156-3-2.463Zm-.75-5.037c-.189 0-.377.03-.556.087a3.125 3.125 0 0 1 0 3.575c.18.058.367.088.556.088a1.875 1.875 0 1 0 0-3.75ZM5.5 6.25H3.625V4.375h-1.25V6.25H.5V7.5h1.875v1.875h1.25V7.5H5.5V6.25Z"
  );
  g.appendChild(path);

  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");

  const clipPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "clipPath"
  );
  clipPath.setAttribute("id", "a");

  const clipPathPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  clipPathPath.setAttribute("fill", "#fff");
  clipPathPath.setAttribute("d", "M.5 0h15v15H.5z");
  clipPath.appendChild(clipPathPath);

  defs.appendChild(clipPath);

  svg.appendChild(g);
  svg.appendChild(defs);

  const arrowLink = document.createElement("a");
  arrowLink.href = `/ profile ? username = ${name}
} `;
  arrowLink.className = "friend-arrow-link";
  arrowLink.appendChild(svg);

  const inviteBtn = document.createElement("button");
  inviteBtn.addEventListener("click", async () => {
    const res = await InvitePlayer(id);
    window.location.href = `/game/match_making?player=${name}&invite-uuid=${res.invite_id}`;
  });

  inviteBtn.className = "invite-button";

  const inviteContent = document.createElement("div");
  inviteContent.className = "invite-content";

  const inviteText = document.createElement("div");
  inviteText.className = "invite-text";
  inviteText.textContent = "Invite";

  inviteContent.appendChild(svg);
  inviteContent.appendChild(inviteText);
  inviteBtn.appendChild(inviteContent);

  container.appendChild(link);
  container.appendChild(inviteBtn);

  return container;
}

async function fetchOnlinePlayer() {
  const apiUrl = "/api/v1/users/online-players";
  try {
    const response = await fetchWithAuth(apiUrl, {
      method: "GET",
    });
    return response.results;
  } catch (error) {
    return [];
  }
}

export default async function renderOnlinePlayers() {
  const OnlinePlayers = await fetchOnlinePlayer();
  const OnlinePlayersContainer = document.getElementById(
    "OnlinePlayers-container"
  );

  OnlinePlayersContainer.innerHTML = "";

  if (!OnlinePlayers.length) {
    const emptyComponent = Empty("No OnlinePlayers Found");
    const emptyContainer = document.createElement("div");
    emptyContainer.className = "emptyContainer";
    emptyContainer.style.width = "100%";
    emptyContainer.style.height = "100%";
    emptyContainer.style.display = "flex";
    emptyContainer.style.justifyContent = "center";
    emptyContainer.style.alignItems = "center";
    emptyContainer.appendChild(emptyComponent);
    OnlinePlayersContainer.appendChild(emptyContainer);
  } else {
    OnlinePlayers.slice(0, 4).forEach((friend, index) => {
      const friendComponent = OnlinePlayerContainer({
        id: friend.id,
        name: friend.username,
        href: friend.image_url,
        number: friend.current_xp && friend.current_xp,
        index: index + 1,
      });
      const friendWrapper = document.createElement("div");
      friendWrapper.className = "friend-wrapper";
      friendWrapper.appendChild(friendComponent);
      OnlinePlayersContainer.appendChild(friendWrapper);
    });
    if (OnlinePlayers.length >= 4) {
      const viewAllContainer = document.createElement("div");
      viewAllContainer.className = "view-all-container";
      const gridContainer = document.createElement("div");
      gridContainer.className = "view-all-grid";
      const flexContainer = document.createElement("div");
      flexContainer.className = "view-all-flex";

      const viewAllLink = document.createElement("a");
      viewAllLink.href = "/home/Online-players";
      viewAllLink.className = "view-all-link";

      const viewAllText = document.createTextNode("View All");
      viewAllLink.appendChild(viewAllText);

      flexContainer.appendChild(viewAllLink);
      gridContainer.appendChild(flexContainer);
      viewAllContainer.appendChild(gridContainer);
      OnlinePlayersContainer.appendChild(viewAllContainer);
    }
  }
}

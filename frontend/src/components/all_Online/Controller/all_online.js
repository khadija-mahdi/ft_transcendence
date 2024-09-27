import { Empty } from "/src/lib/Empty.js";
import { fetchWithAuth } from "/src/lib/apiMock.js";
import { API_URL } from "/config.js";
import { InvitePlayer } from "/src/_api/user.js";

export function OnlinePlayerContainer({ name, href, number, index }) {
  const container = document.createElement("div");
  container.className = "friend-container";

  const link = document.createElement("a");
  link.href = `/profile?username=${name}`;
  link.className = "friend-link";

  const image = document.createElement("img");
  image.className = "friend-profile-image";
  image.src = href;
  image.alt = "Profile Image";
  image.onerror = () => {
    image.src = "/public/assets/images/defaultImageProfile.jpeg";
  };
  image.width = 53;
  image.height = 53;
  const textContainer = document.createElement("div");
  textContainer.className = "friend-text-container";

  const nameDiv = document.createElement("div");
  nameDiv.className = "friend-name";
  nameDiv.textContent = name;

  const levelDiv = document.createElement("div");
  levelDiv.className = "friend-level";
  levelDiv.textContent = `level  ${number} `;

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
    try {
      await InvitePlayer(data.id);
      window.location.href = `/game/match_making?player=${name}&invite-uuid=${res.invite_id}`;
    } catch (e) {}
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

async function fetchOnlinePlayer(q) {
  let apiUrl = "";
  if (!q || q === "") apiUrl = "/api/v1/users/online-players";
  else apiUrl = `/ api / v1 / users / online - players /? search = ${q} `;

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
  const OnlinePlayersContainer = document.getElementById(
    "OnlinePlayers-container"
  );
  const searchInput = document.getElementById("searchInput");

  searchInput.addEventListener(
    "input",
    debounce(async (e) => {
      const term = e.target.value;
      const urlParams = new URLSearchParams(window.location.search);

      if (term) {
        urlParams.set("q", term);
      } else {
        urlParams.delete("q");
      }

      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}?${urlParams} `
      );

      const OnlinePlayers = await fetchOnlinePlayer(term);
      renderOnlinePlayersList(OnlinePlayers);
    }, 300)
  );

  const OnlinePlayers = await fetchOnlinePlayer();
  renderOnlinePlayersList(OnlinePlayers);

  function debounce(func, delay) {
    let timeout;
    return function () {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, arguments), delay);
    };
  }

  function renderOnlinePlayersList(OnlinePlayers) {
    OnlinePlayersContainer.innerHTML = "";
    if (!OnlinePlayers.length) {
      const emptyComponent = Empty("No OnlinePlayers Found");
      const emptyContainer = document.createElement("div");
      emptyContainer.className = "emptyContainer";
      emptyContainer.appendChild(emptyComponent);
      OnlinePlayersContainer.appendChild(emptyContainer);
    } else {
      OnlinePlayers.forEach((user) => {
        const friendComponent = OnlinePlayerContainer({
          name: user.username,
          href: user.image_url,
          number: user.current_xp && user.current_xp,
        });
        const friendWrapper = document.createElement("div");
        friendWrapper.className = "friend-wrapper";
        friendWrapper.appendChild(friendComponent);
        OnlinePlayersContainer.appendChild(friendWrapper);
      });
    }
  }
}

import { Empty } from "/src/lib/Empty.js";
import { fetchWithAuth } from "/src/lib/apiMock.js";
import { API_URL } from "/config.js";

export function FriendContainer({ name, href, number }) {
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
  svg.setAttribute("width", "25");
  svg.setAttribute("height", "25");
  svg.setAttribute("fill", "none");

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("stroke", "#fff");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("stroke-linejoin", "round");
  path.setAttribute("stroke-width", "1.5");
  path.setAttribute("d", "m9 5.5 7 7-7 7");

  svg.appendChild(path);

  const arrowLink = document.createElement("a");
  arrowLink.href = `/ profile ? username = ${name} `;
  arrowLink.className = "friend-arrow-link";
  arrowLink.appendChild(svg);

  container.appendChild(link);
  container.appendChild(arrowLink);

  return container;
}

async function fetchMyFriends(q) {
  let apiUrl = "";

  if (!q || q === "") apiUrl = "/api/v1/users/friend-list";
  else
    apiUrl = `/ api / v1 / users / search - user /? none_friend_only = false & search_query=${q} `;

  if (apiUrl) {
    try {
      const response = await fetchWithAuth(apiUrl, {
        method: "GET",
      });
      return response.results;
    } catch (error) {
      return [];
    }
  }
}

export default async function renderFriends() {
  const searchInput = document.getElementById("searchInput");
  const friendsContainer = document.getElementById("friends-container");

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

      // Fetch friends based on search query
      const friends = await fetchMyFriends(term);
      renderFriendsList(friends);
    }, 300)
  );

  const friends = await fetchMyFriends(); // Initial render without search term
  renderFriendsList(friends);

  function debounce(func, delay) {
    let timeout;
    return function () {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, arguments), delay);
    };
  }

  function renderFriendsList(friends) {
    friendsContainer.innerHTML = "";
    if (!friends.length) {
      const emptyComponent = Empty("No Friends Found");
      const emptyContainer = document.createElement("div");
      emptyContainer.className = "emptyContainer";
      emptyContainer.appendChild(emptyComponent);
      friendsContainer.appendChild(emptyContainer);
    } else {
      friends.forEach((user) => {
        const friendComponent = FriendContainer({
          name: user.username,
          href: user.image_url,
          number: user.current_xp && user.current_xp,
        });
        const friendWrapper = document.createElement("div");
        friendWrapper.className = "friend-wrapper";
        friendWrapper.appendChild(friendComponent);
        friendsContainer.appendChild(friendWrapper);
      });
    }
  }
}

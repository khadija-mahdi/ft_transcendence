import { Empty } from "/src/lib/Empty.js";
import { fetchWithAuth } from "/src/lib/apiMock.js";
import { API_URL } from "/config.js";

export function TopPlayerContainer({ name, href, number, index }) {
  const container = document.createElement("div");
  container.className = `${
    index === 1 ? "topPlayers-container-highlight" : "friend-container"
  }`;

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
  levelDiv.textContent = `level ${number} `;

  textContainer.appendChild(nameDiv);
  textContainer.appendChild(levelDiv);

  link.appendChild(image);
  link.appendChild(textContainer);

  // New index display component
  const indexWrapper = document.createElement("div");
  indexWrapper.className = "topPlayers-arrow-container";

  const indexDiv = document.createElement("div");
  indexDiv.className = `topPlayers - arrow ${
    index === 1 ? "topPlayers-highlight" : ""
  } `;
  indexDiv.textContent = index; // Display the index

  indexWrapper.appendChild(indexDiv);

  const indexLink = document.createElement("a");
  indexLink.href = `/ profile ? username = ${name} `;
  indexLink.className = "friend-arrow-link";
  indexLink.appendChild(indexWrapper);

  container.appendChild(link);
  container.appendChild(indexLink);

  return container;
}

async function fetchTopPlayer() {
  const apiUrl = "/api/v1/users/top-players/";
  try {
    const response = await fetchWithAuth(apiUrl, {
      method: "GET",
    });
    return response.results;
  } catch (error) {
    return [];
  }
}

export default async function rendertopPlayers() {
  const topPlayers = await fetchTopPlayer();
  const topPlayersContainer = document.getElementById("topPlayer-container");

  topPlayersContainer.innerHTML = "";

  if (!topPlayers.length) {
    const emptyComponent = Empty("No topPlayers Found");
    const emptyContainer = document.createElement("div");
    emptyContainer.className = "emptyContainer";
    emptyContainer.appendChild(emptyComponent);
    topPlayersContainer.appendChild(emptyContainer);
  } else {
    topPlayers.slice(0, 4).forEach((friend, index) => {
      const friendComponent = TopPlayerContainer({
        name: friend.username,
        href: friend.image_url,
        number: friend.current_xp && friend.current_xp,
        index: index + 1, // Assuming index starts from 1
      });
      const friendWrapper = document.createElement("div");
      friendWrapper.className = "friend-wrapper";
      friendWrapper.appendChild(friendComponent);
      topPlayersContainer.appendChild(friendWrapper);
    });
  }
}

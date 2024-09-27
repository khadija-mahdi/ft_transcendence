import { Empty } from "/src/lib/Empty.js";
import { fetchWithAuth } from "/src/lib/apiMock.js";
import { API_URL } from "/config.js";

export function AllPlayerContainer({ name, href, number }) {
  const container = document.createElement("div");
  container.className = "friend-container";

  const link = document.createElement("a");
  link.href = `/profile?username=${name}`;
  link.className = "friend-link";

  const image = document.createElement("img");
  image.className = "friend-profile-image";
  image.src = href;
  image.onerror = () => {
    image.src = "/public/assets/images/defaultImageProfile.jpeg";
  };
  image.alt = "Profile Image";
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
  svg.setAttribute("width", "21");
  svg.setAttribute("height", "21");
  svg.setAttribute("viewBox", "0 0 21 21");
  svg.setAttribute("fill", "none");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.setAttribute("clip-path", "url(#clip0_1749_524)");

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("fill", "#F8F8F8");
  path.setAttribute(
    "d",
    "M9.25065 17.0708C9.25065 17.4023 9.38235 17.7202 9.61677 17.9546C9.85119 18.1891 10.1691 18.3208 10.5007 18.3208C10.8322 18.3208 11.1501 18.1891 11.3845 17.9546C11.619 17.7202 11.7507 17.4023 11.7507 17.0708V11.6541H17.1673C17.4988 11.6541 17.8168 11.5224 18.0512 11.288C18.2856 11.0536 18.4173 10.7356 18.4173 10.4041C18.4173 10.0726 18.2856 9.75463 18.0512 9.52021C17.8168 9.28579 17.4988 9.15409 17.1673 9.15409H11.7507V3.73743C11.7507 3.40591 11.619 3.08796 11.3845 2.85354C11.1501 2.61912 10.8322 2.48743 10.5007 2.48743C10.1691 2.48743 9.85119 2.61912 9.61677 2.85354C9.38235 3.08796 9.25065 3.40591 9.25065 3.73743V9.15409H3.83398C3.50246 9.15409 3.18452 9.28579 2.9501 9.52021C2.71568 9.75463 2.58398 10.0726 2.58398 10.4041C2.58398 10.7356 2.71568 11.0536 2.9501 11.288C3.18452 11.5224 3.50246 11.6541 3.83398 11.6541H9.25065V17.0708Z"
  );
  g.appendChild(path);

  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");

  const clipPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "clipPath"
  );
  clipPath.setAttribute("id", "clip0_1749_524");

  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("width", "20");
  rect.setAttribute("height", "20");
  rect.setAttribute("fill", "white");
  rect.setAttribute("transform", "translate(0.5 0.404053)");
  clipPath.appendChild(rect);

  defs.appendChild(clipPath);

  svg.appendChild(g);
  svg.appendChild(defs);

  const inviteLink = document.createElement("button");
  inviteLink.className = "invite-button";

  const inviteContent = document.createElement("div");
  inviteContent.className = "invite-content";

  const inviteText = document.createElement("div");
  inviteText.className = "invite-text";
  inviteText.textContent = "Add Friend";

  inviteContent.appendChild(svg.cloneNode(true));
  inviteContent.appendChild(inviteText);
  inviteLink.appendChild(inviteContent);

  container.appendChild(link);
  container.appendChild(inviteLink);

  return container;
}

export function PendingContainer({ name, href, number }) {
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

  const acceptLink = document.createElement("button");
  acceptLink.className = "accept-button";

  const acceptContent = document.createElement("div");
  acceptContent.className = "accept-content";

  const acceptText = document.createElement("div");
  acceptText.className = "accept-text";
  acceptText.textContent = "Accept";

  const DeclineLink = document.createElement("button");
  DeclineLink.className = "decline-button";

  const DeclineContent = document.createElement("div");
  DeclineContent.className = "decline-content";

  const DeclineText = document.createElement("div");
  DeclineText.className = "accept-text";
  DeclineText.textContent = "Decline";

  acceptContent.appendChild(acceptText);
  DeclineContent.appendChild(DeclineText);
  acceptLink.appendChild(acceptContent);
  DeclineLink.appendChild(DeclineContent);

  const Buttons = document.createElement("div");
  Buttons.className = "buttons";
  Buttons.appendChild(acceptLink);
  Buttons.appendChild(DeclineLink);

  container.appendChild(link);
  container.appendChild(Buttons);

  return container;
}

async function fetchAllPlayer(q) {
  let pendingRes = null;
  let pendingurl = "";
  let recommendedRes = null;
  let recommendedUrl = null;
  if (!q || q === "") {
    pendingurl = "/api/v1/users/appending-requests/";
    recommendedUrl = "/api/v1/users/recommended-users/";
  } else
    recommendedUrl = `/api/v1/users/search-user/?none_friend_only=true&search_query=${q}`;

  try {
    let pending = await fetchWithAuth(pendingurl, {
      method: "GET",
    });
    pendingRes = pending.results;

    let recommended = await fetchWithAuth(recommendedUrl, {
      method: "GET",
    });
    recommendedRes = recommended.results;
    return { Recommended: recommendedRes, pending: pendingRes };
  } catch (error) {
    return { Recommended: [], pending: [] };
  }
}

function SendFriendRequest(userId, inviteButton) {
  inviteButton.addEventListener("click", async function () {
    try {
      const url = `/api/v1/users/send-friend-request/${userId}/`;
      const svgContainer = inviteButton.querySelector(".invite-content svg");
      const inviteText = inviteButton.querySelector(".invite-text");

      if (svgContainer && inviteText) {
        svgContainer.innerHTML = `<path d="M10.4993 17.0707C12.2675 17.0707 13.9632 16.3683 15.2134 15.1181C16.4636 13.8678 17.166 12.1721 17.166 10.404C17.166 8.6359 16.4636 6.94021 15.2134 5.68997C13.9632 4.43972 12.2675 3.73735 10.4993 3.73735C8.73124 3.73735 7.03555 4.43972 5.7853 5.68997C4.53506 6.94021 3.83268 8.6359 3.83268 10.404C3.83268 12.1721 4.53506 13.8678 5.7853 15.1181C7.03555 16.3683 8.73124 17.0707 10.4993 17.0707ZM10.4993 2.07068C11.5937 2.07068 12.6773 2.28623 13.6884 2.70502C14.6994 3.12381 15.6181 3.73763 16.3919 4.51146C17.1657 5.28528 17.7796 6.20394 18.1983 7.21498C18.6171 8.22603 18.8327 9.30966 18.8327 10.404C18.8327 12.6141 17.9547 14.7338 16.3919 16.2966C14.8291 17.8594 12.7095 18.7373 10.4993 18.7373C5.89102 18.7373 2.16602 14.9873 2.16602 10.404C2.16602 8.19387 3.04399 6.07426 4.60679 4.51146C6.1696 2.94865 8.28921 2.07068 10.4993 2.07068ZM10.916 6.23735V10.6123L14.666 12.8373L14.041 13.8623L9.66602 11.2373V6.23735H10.916Z" fill="#E2E2E2"/>`;
        inviteText.textContent = "Request Sent";
        inviteButton.style.backgroundColor = "#474747";
        inviteButton.disabled = true;
        await fetchWithAuth(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
    } catch (error) {
      return;
    }
  });
}

function handleFriendRequest(userId, acceptButton, declineButton, Buttons) {
  acceptButton.addEventListener("click", async function () {
    await processFriendRequest(userId, "accept", Buttons);
  });

  declineButton.addEventListener("click", async function () {
    await processFriendRequest(userId, "decline", Buttons);
  });
}

async function processFriendRequest(userId, action, buttons) {
  try {
    const url = `/api/v1/users/manage_friend_request/${userId}/`;
    if (action === "accept") {
      await fetchWithAuth(url, {
        method: "PUT",
      });
    } else {
      await fetchWithAuth(url, {
        method: "DELETE",
      });
    }

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

    buttons.innerHTML = "";
    buttons.appendChild(svg);
  } catch (error) {
    return;
  }
}

export default async function renderAllPlayers() {
  const OnlinePlayersContainer = document.getElementById(
    "OnlinePlayers-container"
  );
  const pendingContainer = document.getElementById("invitations-container");
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
        `${window.location.pathname}?${urlParams}`
      );

      const OnlinePlayers = await fetchAllPlayer(term);
      renderRecommendedList(OnlinePlayers);
    }, 300)
  );

  const { Recommended, pending } = await fetchAllPlayer();

  renderRecommendedList(Recommended);
  renderPendingList(pending);

  function debounce(func, delay) {
    let timeout;
    return function () {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, arguments), delay);
    };
  }

  function renderRecommendedList(Recommended) {
    OnlinePlayersContainer.innerHTML = "";
    if (!Recommended.length) {
      const emptyComponent = Empty("No Recommended Found");
      const emptyContainer = document.createElement("div");
      emptyContainer.className = "emptyContainer";
      emptyContainer.appendChild(emptyComponent);
      OnlinePlayersContainer.appendChild(emptyContainer);
    } else {
      Recommended.forEach((friend) => {
        const friendComponent = AllPlayerContainer({
          name: friend.username,
          href: friend.image_url,
          number: friend.current_xp && friend.current_xp,
        });

        const friendWrapper = document.createElement("div");
        friendWrapper.className = "friend-wrapper";
        friendWrapper.appendChild(friendComponent);
        OnlinePlayersContainer.appendChild(friendWrapper);
        const inviteButton = friendWrapper.querySelector(".invite-button");
        SendFriendRequest(friend.id, inviteButton);
      });
    }
  }
  function renderPendingList(pending) {
    pendingContainer.innerHTML = "";
    if (!pending.length) {
      const emptyComponent = Empty("No pending Found");
      const emptyContainer = document.createElement("div");
      emptyContainer.className = "emptyContainer";
      emptyContainer.appendChild(emptyComponent);
      pendingContainer.appendChild(emptyContainer);
    } else {
      pending.forEach((user) => {
        const friendComponent = PendingContainer({
          name: user.username,
          href: user.image_url,
          number: user.current_xp && user.current_xp,
        });

        const friendWrapper = document.createElement("div");
        friendWrapper.className = "friend-wrapper";
        friendWrapper.appendChild(friendComponent);
        pendingContainer.appendChild(friendWrapper);

        const acceptButton = friendWrapper.querySelector(".accept-button");
        const declineButton = friendWrapper.querySelector(".decline-button");
        const Buttons = friendWrapper.querySelector(".buttons");
        handleFriendRequest(user.user_id, acceptButton, declineButton, Buttons);
      });
    }
  }
}

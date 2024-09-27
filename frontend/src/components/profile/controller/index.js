import { achievementItem } from "../view/achievment-item.js";
import { tournamentItem } from "../view/tournament-item.js";
import { matchItem } from "../view/match-item.js";
import {
  UserDetailByUsername,
  MatchHistory,
  TournamentHistory,
  InvitePlayer,
  SendFriendRequest as SendFriendRequestApi,
  RemoveFriendRequest as RemoveFriendRequestApi,
  AcceptFriendRequest as AcceptFriendRequestApi,
} from "/src/_api/user.js";
import { Empty } from "/src/lib/Empty.js";
import { DropDown } from "/src/lib/drop-down.js";
import { BlockUser, RemoveFriend } from "/src/_api/user.js";

const html = String.raw;

const url = new URL(window.location.href);
const username = url.searchParams.get("username");
let data = {};

const FriendRequestState = {
  NONE: "NONE",
  SENT: "SENT",
  RECEIVED: "RECEIVED",
};

const loadUserData = async (username) => {
  let matchHistory;
  let tournamentHistory;
  try {
    const data = await UserDetailByUsername(username);
    matchHistory = await MatchHistory(data.id);
    tournamentHistory = await TournamentHistory(data.id);
    return { data, matchHistory, tournamentHistory };
  } catch (e) {
    window.location.href = "/";
  }
};

/**
 * This is the controller for the profile page
 *
 * It will handle all the logic for the profile page
 *
 * It will also handle the communication between the model and the view
 */
export default async function Controller() {
  let user = null;
  if (username === null) return (window.location.href = "/profile?username=me");
  try {
    user = await loadUserData(username);
  } catch (e) {
    return (window.location.href = "/");
  }
  data = user.data;
  if (data.is_blocked) return window.location.replace("/not-found");
  setProfile();
  PopulateTournamentMatches(user.tournamentHistory);
  PopulateMatches(user.matchHistory, data.id);
  PopulateTopAchievements(user.data.achievements);
}

function setProfile() {
  setUserInfo();
  setProfileData();
  setProgress();
  setTopAchievements();
  setOptionsMenu();
  setRankInfo();
}

function setUserInfo() {
  const UserInfoList = [
    {
      src: "/public/assets/icons/fluent_games.png",
      value: "Unavailable",
    },
    {
      src: "/public/assets/icons/money-recive.svg",
      value: `${data.coins} Coins`,
    },
    {
      src: "/public/assets/icons/connected.png",
      value: data.status,
    },
  ];
  const userInfoList = document.getElementById("user-info-list");
  UserInfoList.map((item) => (userInfoList.innerHTML += UserInfo(item)));
  const InviteButton = document.getElementById("invite-btn");
  InviteButton.style.visibility = data.is_my_profile ? "hidden" : "visible";
  InviteButton.addEventListener("click", async () => {
    await SendInvitation(data.username, data.id);
  });
}

function setProfileData() {
  const profilePic = document.getElementById("profile-pic");
  profilePic.src = data.image_url;

  const profileName = document.getElementById("profile-name");
  profileName.textContent = (data.full_name ?? data.username).toUpperCase();

  const profileUsername = document.getElementById("p-profile-username-label");
  profileUsername.textContent = `@${data.username}`;

  ManageFriendButton();
}

function setProgress() {
  const xp = document.querySelector(".xp");
  xp.textContent = `${data.current_xp}XP`;
  const progressBar = document.querySelector(".progress-bar-profile");
  progressBar.style.width = `${data.rankProgressPercentage}%`;
  const percentage = document.querySelector(".progress-percentage");
  percentage.textContent =
    data.rankProgressPercentage > 10 ? `${data.rankProgressPercentage}%` : "";
}

function setTopAchievements() {
  const topAchievements = document.querySelector(".achievement-list");
  if (data.achievements.length === 0) {
    topAchievements.append(Empty("No Achievements found"));
  }
  data.achievements.forEach((achievement) => {
    topAchievements.innerHTML += topAchievementsItem(achievement);
  });
}

function setOptionsMenu() {
  if (data.is_my_profile || !data.is_friend) return;
  const { view, Controller } = DropDown([
    {
      view: html`
        <button class="menu-item">
          <img
            src="/public/assets/icons/profile-remove.svg"
            alt="UnFriend Button"
          />
          <p class="menu-item-text">UnFriend</p>
        </button>
      `,
      handler: async () => {
        await RemoveFriend(data.id);
        data.is_friend = false;
        ManageFriendButton();
      },
    },
    {
      view: html`
        <button class="menu-item">
          <img
            src="/public/assets/icons/profile-delete.svg"
            alt="Block Button"
          />
          <p class="menu-item-text">Block</p>
        </button>
      `,
      handler: async () => {
        await BlockUser(data.id);
        data.is_friend = false;
        ManageFriendButton();
        window.location.reload()
      },
    },
    {
      view: html`
        <button class="menu-item">
          <img
            src="/public/assets/icons/directbox-send.svg"
            alt="Invite Button"
          />
          <p class="menu-item-text">Invite</p>
        </button>
      `,
      handler: async () => {
        await SendInvitation(data.username, data.id);
      },
    },
  ]);
  const dropdown = document.getElementById("dropdown-menu-container");
  dropdown.innerHTML = view;
  dropdown.dataset.show = true;
  Controller();

}

async function SendInvitation(username, id) {
  try {
    const res = await InvitePlayer(id);
    window.location.href = `/game/match_making?player=${username}&invite-uuid=${res.invite_id}`;
  } catch (e) {}
}

function setRankInfo() {
  const UserRankIcon = document.getElementById("rank-icon");
  const UserRankTitle = document.getElementById("rank-title");

  const UserRank = data.rank || null;
  UserRankIcon.src = UserRank?.icon || "/public/assets/icons/unranked.png";
  UserRankTitle.textContent = UserRank?.name || "Unranked";
  UserRankTitle.style.color = UserRank ? "#ff3d00" : "#a2a2a2";
}

function PopulateTournamentMatches(data) {
  const tournamentHistory = document.getElementById("tournament-history");
  if (data.count === 0) {
    tournamentHistory.append(Empty("No Tournaments found"));
    return;
  }
  data.results.forEach((tournament) => {
    tournamentHistory.innerHTML += tournamentItem(tournament.tournament);
  });
}

function PopulateMatches(data, me) {
  const matchHistory = document.getElementById("match-history");
  if (data.count === 0) {
    matchHistory.append(Empty("No matches found"));
    return;
  }
  data.results.forEach((match) => {
    matchHistory.innerHTML += matchItem({...match, me});
  });
}

function PopulateTopAchievements(data) {
  const lastAchievements = document.getElementById("last-achievements");
  if (data.length === 0) {
    lastAchievements.append(Empty("No Achievements found"));
    return;
  }
  data.forEach((achievement) => {
    lastAchievements.innerHTML += achievementItem(achievement);
  });
}

function ProfileButtonContent() {
  if (data.is_my_profile) return "";
  if (data.is_friend) {
    return html`
      <a href="/messenger?chatroom=${data.id}">
        ${ProfileCTA("/public/assets/icons/message-filled.svg", "Send Message")}
      </a>
    `;
  }
  if (data.friend_request_state === FriendRequestState.SENT) {
    return ProfileCTA(
      "/public/assets/icons/light_close.png",
      "Cancel Request",
      "CancelFriendRequest"
    );
  }
  if (data.friend_request_state === FriendRequestState.RECEIVED) {
    return html`
      <div class="cta-buttons">
        ${ProfileCTA(
          "/public/assets/icons/add-fill.svg",
          "Accept Request",
          "AcceptFriendRequest"
        )}
        ${ProfileCTA(
          "/public/assets/icons/light_close.png",
          "decline Request",
          "DeclineFriendRequest"
        )}
      </div>
    `;
  }
  return ProfileCTA(
    "/public/assets/icons/add-fill.svg",
    "Add Friend",
    "SendFriendRequest"
  );
}

function UserInfo({ src, value }) {
  return html`
    <li class="user-info-item">
      <img src="${src}" alt="userInfo Icon" />
      <h6>${value}</h6>
    </li>
  `;
}

function ProfileCTA(icon, title, eventHandlerName = "") {
  return html`
    <button
      class="cta-button"
      id="profile-cta-button"
      data-handler="${eventHandlerName}"
    >
      <img src="${icon}" alt="Call To Action Button Icon" />
      <p>${title}</p>
    </button>
  `;
}

function topAchievementsItem({ icon, name }) {
  return html`
    <li class="achievement-item">
      <img src="${icon}" alt="userInfo Icon" />
      <h6>${name}</h6>
    </li>
  `;
}

function ManageFriendButton() {
  const profileCta = document.getElementById("profile-cta-container");
  profileCta.innerHTML = ProfileButtonContent();
  AttachEventListeners();
}

function AttachEventListeners() {
  const buttons = document.querySelectorAll("button[data-handler]");
  buttons.forEach((button) => {
    button.addEventListener("click", window[button.dataset.handler]);
  });
}

window.CancelFriendRequest = async function () {
  await RemoveFriendRequestApi(data.id);
  data.friend_request_state = FriendRequestState.NONE;
  data.is_friend = false;
  ManageFriendButton();
};

window.AcceptFriendRequest = async function () {
  await AcceptFriendRequestApi(data.id);
  data.friend_request_state = FriendRequestState.NONE;
  data.is_friend = true;
  ManageFriendButton();
};

window.DeclineFriendRequest = async function () {
  await RemoveFriendRequestApi(data.id);
  data.friend_request_state = FriendRequestState.NONE;
  data.is_friend = false;
  ManageFriendButton();
};

window.SendFriendRequest = async function () {
  await SendFriendRequestApi(data.id);
  data.friend_request_state = FriendRequestState.SENT;
  ManageFriendButton();
};

import { achievementItem } from "../view/achievment-item.js";
import { tournamentItem } from "../view/tournament-item.js";
import { matchItem } from "../view/match-item.js";
import {
  UserDetailByUsername,
  MatchHistory,
  TournamentHistory,
} from "/_api/user.js";
import { Empty } from "/lib/Empty.js";
const html = String.raw;

const url = new URL(window.location.href);
const username = url.searchParams.get("username");
console.log(username);

const loadUserData = async (username) => {
  let matchHistory;
  let tournamentHistory;
  try {
    const data = await UserDetailByUsername(username);
    console.log(data);
    matchHistory = await MatchHistory(data.id);
    tournamentHistory = await TournamentHistory(data.id);
    return { data, matchHistory, tournamentHistory };
  } catch (e) {
    console.error(e);
    redirect("/");
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
  if (username === null) {
    window.location.href = "/profile?username=me";
  }
  const user = await loadUserData(username);
  setProfile(user.data);
  PopulateTournamentMatches(user.tournamentHistory);
  PopulateMatches(user.matchHistory);
  PopulateTopAchievements(user.data.achievements);
}

function setProfile(data) {

  const UserInfoList = [
    {
      src: "/assets/icons/fluent_games.png",
      value: "Unavailable",
    },
    {
      src: "/assets/icons/email.png",
      value: data.email,
    },
    {
      src: "/assets/icons/money-recive.svg",
      value: `${data.coins} Coins`,
    },
    {
      src: "/assets/icons/connected.png",
      value: data.status,
    },
  ];
  const userInfoList = document.getElementById("user-info-list");
  UserInfoList.map(item => userInfoList.innerHTML += UserInfo(item))

  const profilePic = document.getElementById("profile-pic");
  profilePic.src = data.image_url;

  const profileName = document.getElementById("profile-name");
  profileName.textContent = data.full_name;

  const profileUsername = document.getElementById("profile-username");
  profileUsername.textContent = `@${data.username}`;

  ManageFriendButton(data);
}

function PopulateTournamentMatches(data) {
  const tournamentHistory = document.getElementById("tournament-history");
  if (data.count === 0) {
    tournamentHistory.append(Empty("No Tournaments found"));
    return;
  }
  data.results.forEach((tournament) => {
    tournamentHistory.innerHTML += tournamentItem(tournament);
  });
}

function PopulateMatches(data) {
  const matchHistory = document.getElementById("match-history");
  if (data.count === 0) {
    matchHistory.append(Empty("No matches found"));
    return;
  }

  data.results.forEach((match) => {
    matchHistory.innerHTML += matchItem(match);
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


function ManageFriendButton(data) {
  const cta = document.getElementById("profile-cta-button");
}

function UserInfo({ src, value }) {
  return html`
    <li class="user-info-item">
      <img src='${src}' alt="userInfo Icon" />
      <h6>${value}</h6>
    </li>
  `;
}
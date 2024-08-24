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
	data = user.data;
	setProfile();
	PopulateTournamentMatches(user.tournamentHistory);
	PopulateMatches(user.matchHistory);
	PopulateTopAchievements(user.data.achievements);
}

function setProfile() {
	// User Info
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
	UserInfoList.map((item) => (userInfoList.innerHTML += UserInfo(item)));

	// Profile Picture and Data
	const profilePic = document.getElementById("profile-pic");
	profilePic.src = data.image_url;

	const profileName = document.getElementById("profile-name");
	profileName.textContent = data.full_name;

	const profileUsername = document.getElementById("profile-username");
	profileUsername.textContent = `@${data.username}`;

	ManageFriendButton();

	// Progress Bar
	const xp = document.querySelector(".xp");
	xp.textContent = `${data.current_xp}XP`;
	const progressBar = document.querySelector(".progress-bar");
	progressBar.style.width = data.rankProgressPercentage;
	const percentage = document.querySelector(".progress-percentage");
	percentage.textContent =
		data.rankProgressPercentage > 10 ? `${data.rankProgressPercentage}%` : "";

	// TOP ACHIEVEMENTS
	const topAchievements = document.querySelector(".achievement-list");
	if (data.achievements.length === 0) {
		topAchievements.append(Empty("No Achievements found"));
	}
	data.achievements.forEach((achievement) => {
		topAchievements.innerHTML += topAchievementsItem(achievement);
	});

	// RANK
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

function ProfileButtonContent() {
	if (data.is_my_profile) return "";
	if (data.is_friend) {
		return html`
			<a href="/messenger?chatroom=${data.id}">
				${ProfileCTA("/assets/icons/message-filled.svg", "Send Message")}
			</a>
		`;
	}
	if (data.friend_request_state === FriendRequestState.SENT) {
		return ProfileCTA(
			"/assets/icons/light_close.png",
			"Cancel Request",
			"CancelFriendRequest"
		);
	}
	if (data.friend_request_state === FriendRequestState.RECEIVED) {
		return html`
			<div class="cta-buttons">
				${ProfileCTA(
					"/assets/icons/add-fill.svg",
					"Accept Request",
					"AcceptFriendRequest"
				)}
				${ProfileCTA(
					"/assets/icons/light_close.png",
					"decline Request",
					"DeclineFriendRequest"
				)}
			</div>
		`;
	}
	return ProfileCTA(
		"./assets/icons/add-fill.svg",
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

window.CancelFriendRequest = function () {
	data.friend_request_state = FriendRequestState.NONE;
	data.is_friend = false;
	ManageFriendButton();
};

window.AcceptFriendRequest = function () {
	data.friend_request_state = FriendRequestState.NONE;
	data.is_friend = true;
	ManageFriendButton();
};

window.DeclineFriendRequest = function () {
	data.friend_request_state = FriendRequestState.NONE;
	data.is_friend = false;
	ManageFriendButton();
};

window.SendFriendRequest = function () {
	data.friend_request_state = FriendRequestState.SENT;
	ManageFriendButton();
};

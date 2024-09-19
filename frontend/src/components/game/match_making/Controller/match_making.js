const params = new URLSearchParams(window.location.search);
const mode = params.get("mode");
import { fetchMyData, UserDetailByUsername } from "/src/_api/user.js";
import AuthWebSocket from "/src/lib/authwebsocket.js";
import { showPopup } from "/src/lib/Confirm.js";
import { PlayerCard } from "/src/components/game/match_making/View/match_making.js";

const myData = await fetchMyData();
const searchParams = new URLSearchParams(window.location.search);

export default async function () {
  const pb = document.getElementById("match-making-play-now-button");
  pb.addEventListener("click", handleButtonClick);
  startCountdown(60, "/game/choice-game");

  const myCard = document.getElementById("my-card");

  myCard.innerHTML = PlayerCard(myData);
  const second_player = searchParams.get("player");
  if (second_player)
    return handleInviteLobby(searchParams.get("invite-uuid"), second_player);
  return handleNormalLobby(searchParams.get("game_mode"));
}

async function handleInviteLobby(invite_id, second_player) {
  if (!invite_id || !second_player) {
    showPopup({
      title: "Invalid Invite",
      subtitle: "The invite is invalid",
      onConfirm: () => {
        window.location.href = "/home";
      },
      closeable: false,
    });
    return;
  }
  SetSecondPlayer(await UserDetailByUsername(second_player));
  const loobySocket = new AuthWebSocket(`/ws/game/invite/looby/${invite_id}/`);
  loobySocket.onopen = () => {
    console.log("Invite WebSocket connected");
  };
  loobySocket.onmessage = (message) => {
    const data = JSON.parse(message.data);
    matchCountdown(5, `/game?uuid=${data.game_uuid}`, null);
  };
}

function handleNormalLobby(game_mode) {
  if (game_mode === "singleplayer") {
    const secondPlayerCard = document.getElementById("second-player");
    secondPlayerCard.innerHTML = "";
    secondPlayerCard.style.height = "null";
    secondPlayerCard.innerHTML = PlayerCard({
      username: "Root",
      image_url: "/public/assets/images/robot.webp",
      rank: null,
      current_xp: null,
    });
  }

  if (game_mode === undefined) game_mode = "multiplayer";
  if (
    game_mode &&
    game_mode !== "multiplayer" &&
    game_mode !== "singleplayer"
  ) {
    showPopup({
      title: "there is no type",
      subtitle: "please choose humane or robot to play with ",
      onConfirm: async () => {
        window.location.href = "/home";
      },
      closeable: false,
    });
  }

  const loobySocket = new AuthWebSocket(
    `/ws/game/normal/looby/?game_mode=${game_mode}`
  );
  loobySocket.onopen = () => {
    console.log("Normal WebSocket connected");
  };
  loobySocket.onmessage = (message) => {
    const data = JSON.parse(message.data);
    matchCountdown(5, `/game?uuid=${data.game_uuid}`, data.second_player);
  };
}

function startCountdown(seconds, path) {
  const timerElement = document.getElementById("countdown-timer");
  let remainingTime = seconds;

  const intervalId = setInterval(() => {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;

    timerElement.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;

    remainingTime--;

    if (remainingTime < 0) {
      clearInterval(intervalId);
      window.location.href = path;
    }
  }, 1000);
}

function matchCountdown(seconds, path, second_player) {
  const timerElement = document.getElementById("countdown-timer");
  let remainingTime = seconds;

  const intervalId = setInterval(async () => {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    remainingTime--;
    if (second_player) {
      const secondPlayerCard = document.getElementById("second-player");
      const second_player_data = await UserDetailByUsername(second_player);
      secondPlayerCard.innerHTML = "";
      secondPlayerCard.style.height = "null";
      secondPlayerCard.innerHTML = PlayerCard(second_player_data);
    }

    if (remainingTime < 0) {
      clearInterval(intervalId);
      window.location.href = path;
    }
  }, 1000);
}

function handleButtonClick() {
  window.location.href = "/game/choice-game";
}

function SetSecondPlayer(second_player) {
  const secondPlayerCard = document.getElementById("second-player");
  secondPlayerCard.innerHTML = "";
  secondPlayerCard.style.height = "null";
  secondPlayerCard.innerHTML = PlayerCard(second_player);
}

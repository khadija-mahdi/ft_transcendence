const params = new URLSearchParams(window.location.search);
const mode = params.get("mode");
import { fetchMyData } from "/src/_api/user.js";
import AuthWebSocket from "/src/lib/authwebsocket.js";
import { showPopup } from "/src/lib/Confirm.js";

const myData = await fetchMyData();

export default function ()
{

  const game_mode = new URLSearchParams(window.location.search).get("game_mode");
  if (game_mode === undefined)
    game_mode = 'multiplayer'
  if (game_mode !== 'multiplayer' || game_mode !== 'singleplayer') 
  {
    console.log("oussama ddxxx");
    // showPopup({
    //   title: "An Error",
    //   subtitle: "You've Selected UnRecognazed Game Mode Please try Again",
    //   onCancel: () => {
    //     window.location.href = "/";
    //   },
    // });
  }
  const loobySocket = new AuthWebSocket(`/ws/game/normal/looby/?game_mode=${game_mode}`);
  loobySocket.onopen = () =>
  {
    console.log("WebSocket connected -------------------------------");
  };
  loobySocket.onmessage = (message) => {
    const data = JSON.parse(message.data);
    window.location.href = `/game?uuid=${data.game_uuid}`;
  };

  console.log("match making worjk here ", myData.username);

}

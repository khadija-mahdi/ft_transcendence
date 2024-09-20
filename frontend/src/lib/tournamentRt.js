import AuthWebSocket from "./authwebsocket.js";
import { fetchWithAuth } from "./apiMock.js";
import { showPopup } from "/src/lib/Confirm.js";
import { fetchMyData } from "/src/_api/user.js";

export function TournamentWs(uuid, me) {
  const socket = new AuthWebSocket(`/ws/game/tournament/${uuid}/`);
  socket.onopen = () => {
    console.log("connected to ws");
  };
  socket.onclose = () => {
    console.log("disconnected from ws");
  };
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    switch (data.type) {
      case "match_info":
        const opponent =
          data.first_player === me.username
            ? data.second_player
            : data.first_player;
        showPopup({
          title: "Match Info",
          subtitle: `You have been matched with ${opponent}`,
          onConfirm: () => {
            window.location.href = `/game?uuid=${data.match_uuid}`;
          },
          closeable: false,
        });
        break;
      case "tournament_end":
        const reason = data.message ? `Reason: ${data.message}` : "";
        showPopup({
          title: "Tournament Ended",
          subtitle: `The tournament has ended.\n${reason}`,
        });
        break;
      case "tournament_completed":
        showPopup({
          title: "Tournament Completed",
          subtitle: `You have completed the tournament and the results are out. The Winner is ${data.winner}`,
        });
        break;
      default:
        console.log("Unknown message type");
    }
  };
}

export async function mountTournamentsWs() {
  const list = await fetchWithAuth("/api/v1/game/ongoing-tournaments/");
  const me = await fetchMyData();
  if (list.count === 0) return;
  list.results.forEach((tournament) => TournamentWs(tournament.uuid, me));
}

import AuthWebSocket from "./authwebsocket.js";
import { fetchWithAuth } from "./apiMock.js";

export function TournamentWs(uuid) {
  const socket = new AuthWebSocket(`/ws/game/tournament/${uuid}/`);
  socket.onopen = () => {
    console.log("connected to ws");
  };
  socket.onclose = () => {
    console.log("disconnected from ws");
  };
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log("data:", data);
  };
}

export async function mountTournamentsWs() {
  const list = await fetchWithAuth("/api/v1/game/ongoing-tournaments/");
  if (list.count === 0) return;
  list.results.forEach((tournament) => TournamentWs(tournament.uuid));
}

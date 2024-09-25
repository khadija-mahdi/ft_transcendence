import { fetchWithAuth } from "/src/lib/apiMock.js";

export const GetTournamentDetails = async (id) => {
  const Response = await fetchWithAuth(`/api/v1/game/Tournament/detail/${id}/`);
  return Response;
};

export const removeTournament = async (id) => {
  await fetchWithAuth(`/api/v1/game/Tournament/detail/${id}/`, {
    method: "DELETE",
  });
};

export const RegisterTournament = async (id, data) => {
  return await fetchWithAuth(`/api/v1/game/Tournament/register/${id}/`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const UnRegisterTournament = async (id) => {
  return await fetchWithAuth(`/api/v1/game/Tournament/unregister/${id}/`, {
    method: "DELETE",
  });
};
export const getMatchInfo = async (uuid) => {
  const Response = await fetchWithAuth(`/api/v1/game/match-info/${uuid}/`);
  return Response;
};

export const getOfflineGameInfo = async (alias1, alias2) => {
  alias1 = alias1 === null ? "" : alias1
  alias2 = alias2 === null ? "" : alias2
  try {
    const Response = await fetchWithAuth(`/api/v1/game/create-offline-game`, {
      method: "POST",
      body: JSON.stringify({
        first_player_alias: alias1,
        second_player_alias: alias2,
      }),
    });
    return Response;
  } catch (e) {
    return {};
  }
};

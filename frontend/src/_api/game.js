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

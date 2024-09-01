import { fetchWithAuth } from "/lib/apiMock.js";

export const GetTournamentDetails = async (id) => {
	const Response = await fetchWithAuth(`/api/v1/game/Tournament/detail/${id}/`);
	return Response;
};

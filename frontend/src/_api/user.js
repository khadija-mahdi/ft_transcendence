import { fetchWithAuth } from "/lib/apiMock.js";

export const UserDetailByUsername = async (username) => {
  const res = await fetchWithAuth(
    `https://localhost:4433/api/v1/users/${username}/`
  );
  return res;
};

export const MatchHistory = async (id) => {
  try {
    const res = await fetchWithAuth(
      `https://localhost:4433/api/v1/game/match-history/${id}/`
    );
    return res;
  } catch (error) {
    return {};
  }
};

export const TournamentHistory = async (id) => {
  try {
    const res = await fetchWithAuth(
      `https://localhost:4433/api/v1/game/tournament-history/${id}/`
    );
    return res;
  } catch (error) {
    return {};
  }
};

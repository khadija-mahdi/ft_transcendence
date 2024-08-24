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

export const InvitePlayer = async (id) => {
  return await fetchWithAuth(
    `https://localhost:4433/api/v1/users/invite-player/${id}`
  );
};

export const SendFriendRequest = async (id) => {
  await fetchWithAuth(
    `https://localhost:4433/api/v1/users/send-friend-request/${id}/`,
    {
      method: "POST",
    }
  );
};

export const RemoveFriendRequest = async (id) => {
  await fetchWithAuth(
    `https://localhost:4433/api/v1/users/manage_friend_request/${id}/`,
    {
      method: "DELETE",
    }
  );
};

export const AcceptFriendRequest = async (id) => {
  await fetchWithAuth(
    `https://localhost:4433/api/v1/users/manage_friend_request/${id}/`,
    {
      method: "PUT",
    }
  );
};

export const DeclineFriendRequest = async (id) => {
  await fetchWithAuth(
    `https://localhost:4433/api/v1/users/manage_friend_request/${id}/`,
    {
      method: "PUT",
    }
  );
};

export const BlockUser = async (id) => {
  await fetchWithAuth(`https://localhost:4433/api/v1/users/block-user/${id}/`, {
    method: "POST",
  });
};

export const UnblockUser = async (id) => {
  await fetchWithAuth(
    `https://localhost:4433/api/v1/users/unblock-user/${id}/`,
    {
      method: "DELETE",
    }
  );
};

export const RemoveFriend = async (id) => {
  await fetchWithAuth(
    `https://localhost:4433/api/v1/users/remove-friend/${id}/`,
    {
      method: "DELETE",
    }
  );
};

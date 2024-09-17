import { fetchWithAuth } from "/src/lib/apiMock.js";

export const fetchMyData = async () => {
	const apiUrl = "/api/v1/users/me/";

	try {
		const data = await fetchWithAuth(apiUrl, {
			method: "GET",
		});
		return data;
	} catch (error) {
		return {};
	}
};

export async function fetchRooms(q = "", filter = false) {
	let apiUrl = filter
		? "/api/v1/chat/filter-rooms/"
		: q ? `/api/v1/chat/rooms/?q=${q}` : "/api/v1/chat/rooms/";

	try {
		const response = await fetchWithAuth(apiUrl, {
			method: "GET",
		});
		return response.results;
	} catch (error) {
		return [];
	}
}

export async function fetchBlockList(q) {
	let apiUrl = "";
	if (!q || q === '')
		apiUrl = "/api/v1/users/blocked-list/";
	else
		apiUrl = `/api/v1/users/blocked-list/?search_query=${q}`;

	try {
		const response = await fetchWithAuth(apiUrl, {
			method: "GET",
		});
		return response.results
	} catch (error) {
		return [];
	}
}

export const updateProfile = async (data) => {
	const formData = new FormData();
	if (data.image_file) {
		formData.append("image_file", data.image_file);
	}

	for (const key in data) {
		const value = Object(data)[key];
		if (value) formData.append(key, value);
	}
	const Response = await fetchWithAuth("/api/v1/users/me/", {
		method: "PUT",
		body: formData,
	}, false);
	return Response;
};

export async function fetchNotifications() {
	let apiUrl = `/api/v1/notifications/`;
	let Notification = [];
	try {
		// while (apiUrl) {
		const response = await fetchWithAuth(apiUrl, {
			method: 'GET',
		});

		Notification = Notification.concat(response.results);
		apiUrl = response.next;
		// }
		return Notification;
	} catch (error) {
		return [];
	}
}

export const UserDetailByUsername = async (username) =>
{
	const res = await fetchWithAuth(`/api/v1/users/${username}/`);
	return res;
};

export const MatchHistory = async (id) => {
	try {
		const res = await fetchWithAuth(`/api/v1/game/match-history/${id}/`);
		return res;
	} catch (error) {
		return {};
	}
};

export const TournamentHistory = async (id) => {
	try {
		const res = await fetchWithAuth(`/api/v1/game/tournament-history/${id}/`);
		return res;
	} catch (error) {
		return {};
	}
};

export const InvitePlayer = async (id) => {
	return await fetchWithAuth(`/api/v1/users/invite-player/${id}`);
};

export const SendFriendRequest = async (id) => {
	await fetchWithAuth(`/api/v1/users/send-friend-request/${id}/`, {
		method: "POST",
	});
};

export const RemoveFriendRequest = async (id) => {
	await fetchWithAuth(`/api/v1/users/manage_friend_request/${id}/`, {
		method: "DELETE",
	});
};

export const AcceptFriendRequest = async (id) => {
	await fetchWithAuth(`/api/v1/users/manage_friend_request/${id}/`, {
		method: "PUT",
	});
};

export const DeclineFriendRequest = async (id) => {
	await fetchWithAuth(`/api/v1/users/manage_friend_request/${id}/`, {
		method: "PUT",
	});
};

export const BlockUser = async (id) => {
	await fetchWithAuth(`/api/v1/users/block-user/${id}/`, {
		method: "POST",
	});
};

export const UnblockUser = async (id) => {
	await fetchWithAuth(`/api/v1/users/unblock-user/${id}/`, {
		method: "DELETE",
	});
};

export const RemoveFriend = async (id) => {
	await fetchWithAuth(`/api/v1/users/remove-friend/${id}/`, {
		method: "DELETE",
	});
};



export async function fetchMyFriends() {
	const apiUrl = "/api/v1/users/friend-list";
	try {
		const response = await fetchWithAuth(apiUrl, {
			method: "GET",
		});
		return response.results
	} catch (error) {
		return [];
	}
}

export async function fetchLogData() {
	const apiUrl = "/api/v1/users/rank-logs/";
	try {
		const response = await fetchWithAuth(apiUrl, {
			method: "GET",
		});
		return response;
	} catch (error) {
		return [];
	}
}

export async function fetchRanking() {
	const apiUrl = "/api/v1/users/ranking/";
	try {
		const response = await fetchWithAuth(apiUrl, {
			method: "GET",
		});
		return response;
	} catch (error) {
		return [];
	}
}
import { fetchWithAuth } from '/components/api.js/apiMock.js'

export async function fetchMyData() {
	const apiUrl = "https://localhost:4433/api/v1/users/me/";

	try {
		const data = await fetchWithAuth(apiUrl, {
			method: 'GET',
		});

		data.image_url = data.image_url.replace(
			"https://localhost/",
			"https://localhost:4433/"
		);
		data.rank.icon = data.rank.icon.replace(
			"https://localhost/",
			"https://localhost:4433/"
		);
		handleUserData(data);
	} catch (error) {
		console.error("Error fetching user data:", error);
	}
}
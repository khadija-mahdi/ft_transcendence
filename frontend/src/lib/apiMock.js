export function getCookieValue(name) {
	const cookies = document.cookie.split(";");
	for (let i = 0; i < cookies.length; i++) {
		const cookie = cookies[i].trim();
		if (cookie.startsWith(name + "=")) {
			return cookie.substring(name.length + 1).trim();
		}
	}
	return null;
}

export function destroyCookies() {
	document.cookie = "access=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
	document.cookie = "refresh=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

export const fetchWithAuth = async (
	url,
	options = {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	}
) => {
	const refresh = getCookieValue("refresh");
	const access = getCookieValue("access");
	const BaseUrl = "https://localhost:4433";
	if (!access && !refresh) {
		console.log("No access token or refresh token");
		return;
	}

	if (access) {
		options.headers = {
			...options.headers,
			Authorization: `Bearer ${access}`,
		};
	}

	try {
		let response = await fetch(BaseUrl + url, options);

		if (response.status === 401 || response.status === 403) {
			if (refresh) {
				const refreshResponse = await fetch("/api/v1/auth/token/refresh/", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ refresh: refresh }),
				});

				if (refreshResponse.ok) {
					const refreshData = await refreshResponse.json();
					const newAccessToken = refreshData.access;
					document.cookie = `access=${newAccessToken}; path=/;`;

					options.headers["Authorization"] = `Bearer ${newAccessToken}`;
					response = await fetch(url, options);
				} else {
					destroyCookies();
				}
			} else {
				destroyCookies();
			}
		}

		const contentType = response.headers.get("content-type");
		let data =
			contentType && contentType.includes("application/json")
				? await response.json()
				: await response.text();
		if (!response.ok) throw new Error(data?.message || "An error occurred");
		return data;
	} catch (error) {
		throw new Error(error.message);
	}
};

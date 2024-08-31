export function getCookieValue(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
            return cookie.substring(name.length + 1);
        }
    }
    return null;
}

export function destroyCookies() {
    document.cookie = "access=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "refresh=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

export const fetchWithAuth = async (url, options = { method: "GET" }) => {
    const refresh = getCookieValue('refresh');
    const access = getCookieValue('access');

    if (access) {
        options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${access}`,
            'Content-Type': 'application/json',
        };
    }

    try {
        let response = await fetch(url, options);

        if (response.status === 401 || response.status === 403) {
            const originalOptions = { ...options };

            const refreshResponse = await fetch('https://localhost:4433/api/v1/auth/token/refresh/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refresh: refresh }),
            });

            if (refreshResponse.ok) {
                const refreshData = await refreshResponse.json();
                const newAccessToken = refreshData.access;
                document.cookie = `access=${newAccessToken}; path=/;`;

                // Retry the original request with the new token
                originalOptions.headers['Authorization'] = `Bearer ${newAccessToken}`;
                response = await fetch(url, originalOptions);
            } else {
                destroyCookies();
                throw new Error('Unauthorized');
            }
        }
        if (options.method === 'GET' || options.method === 'POST') {
            return response.json();
        }
        return response;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};

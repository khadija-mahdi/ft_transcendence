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

export const fetchWithAuth = async (url, options = {}) => {
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

            // Attempt to refresh the token
            const refreshResponse = await fetch('/auth/token/refresh/', {
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
                window.location.href = '/sign_in';
                throw new Error('Unauthorized');
            }
        }

        return response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};
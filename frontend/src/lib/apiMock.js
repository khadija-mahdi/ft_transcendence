import { API_URL } from "/config.js";
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
  window.location.href = "/auth";
}

function SetCookies({ access = "", refresh = null }) {
  document.cookie = `access=${access}; path=/;`;
  if (refresh) document.cookie = `refresh=${refresh}; path=/;`;
}

export const fetchWithAuth = async (
  url,
  options = {
    method: "GET",
  },
  autoContentType = true
) => {
  if (autoContentType) {
    if (!options.headers) options.headers = {};
    options.headers["Content-Type"] = "application/json";
  }

  const refresh = getCookieValue("refresh");
  const access = getCookieValue("access");

  let BaseUrl = `https://${API_URL}`;
  if (url.startsWith(`https://${API_URL}`)) {
    BaseUrl = "";
  }
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
      if (!refresh) {
        return destroyCookies();
      }
      const refreshResponse = await fetch("/api/v1/auth/token/refresh/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refresh }),
      });
      if (!refreshResponse.ok) {
        return destroyCookies();
      }

      const refreshData = await refreshResponse.json();
      SetCookies(refreshData);
      options.headers["Authorization"] = `Bearer ${refreshData.access}`;
      response = await fetch(BaseUrl + url, options);
    }
    const contentType = response.headers.get("content-type");
    let data =
      contentType && contentType.includes("application/json")
        ? await response.json()
        : await response.text();

    if (!response.ok) throw new Error(JSON.stringify(data));
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

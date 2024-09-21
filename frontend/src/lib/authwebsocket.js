import { API_URL } from "/config.js";

function getCookie(name) {
	const cookieString = document.cookie;
	const nameEQ = name + "=";
	const cookies = cookieString.split(';');
	for (let i = 0; i < cookies.length; i++) {
		let cookie = cookies[i].trim();
		if (cookie.indexOf(nameEQ) === 0) {
			return cookie.substring(nameEQ.length, cookie.length);
		}
	}
	return null;
}

export default class AuthWebSocket extends WebSocket {
	constructor(url, protocols) {
		try {
			url = `wss://${API_URL}` + url;
			const token = getCookie('access');
			const modifiedUrl = url.includes('?') ? `${url}&token=${token}` : `${url}?token=${token}`;
			super(modifiedUrl, protocols);
			this.onerror = function(event) {
				// Suppress the error message
			};
		} catch (error) {
			console.log(error);
		}
	}
}


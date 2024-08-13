function getCookie(name) 
{
    // Create a regular expression to find the cookie name followed by '='
    const cookieString = document.cookie;
    const nameEQ = name + "=";
    const cookies = cookieString.split(';');

    // Loop through all the cookies
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim(); // Trim any leading whitespace
        // If the cookie name is found, return its value
        if (cookie.indexOf(nameEQ) === 0) {
            return cookie.substring(nameEQ.length, cookie.length);
        }
    }
    // If the cookie is not found, return null
    return null;
}

export default class AuthWebSocket extends WebSocket {
    constructor(url, protocols) {
        const token  = getCookie('access');
        const modifiedUrl = url.includes('?') ? `${url}&token=${token}` : `${url}?token=${token}`;
        console.log(modifiedUrl)
        super(modifiedUrl, protocols);
    }
}


// const ws = new AuthWebSocket('wss://localhost/ws/game/d9517b51-d861-4eba-96d6-28ec87f6284a/')

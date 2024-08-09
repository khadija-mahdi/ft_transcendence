import home from "./components/home/home.js";
import chat from "./components/chat/chat.js";
import sign_in from "./components/auth/sing_in.js";
import sign_up from "./components/auth/sign_up.js";
import email from "./components/auth/email_ver.js";
import info from "./components/auth/use_info.js";
import bar from "./components/navBar/navBar.js";
const routes = {
    "/": { title: "Home", render: home },
    "/chat": { title: "Chat", render: chat },
    "/sign_in": { title: "Sign In", render: sign_in },
    "/sign_up": { title: "Sign Up", render: sign_up },
    "/sign_up_email": { title: "Email verification", render: email },
    "/sign_up_info": { title: "Your Information", render: info },
	"/bar": { title: "Bar", render: bar },
};

function navigate(path) {
    const route = routes[path];
    if (route) {
        document.title = route.title;
        const app = document.getElementById('app');
        app.innerHTML = route.render();
		console.log("path: ", app.innerHTML);
    } else {
        console.error('Route not found');
    }
}

window.addEventListener('popstate', () => {
    navigate(window.location.pathname);
});

document.addEventListener('DOMContentLoaded', () => {
    navigate(window.location.pathname || '/');
});

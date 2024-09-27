import routes from "/routesConfig.js";
import AuthWebSocket from "/src/lib/authwebsocket.js";
import { mountTournamentsWs } from "/src/lib/tournamentRt.js";
import { showMainPopup } from "/src/lib/Confirm.js";

function handleConnectWebSocket() {
	let ws = new AuthWebSocket(`/ws/user/connect/`);
	ws.onopen = () => {
		console.log("connected to ws");
	};
	ws.onclose = () => {
		console.log("disconnected from ws");
	};
	ws.onmessage = (event) => {
		const data = JSON.parse(event.data);
		showMainPopup({
			title: data.title,
			subtitle: data.description,
			icon: data.icon || "/public/assets/images/fortnait.jpg" ,
			type: data.type,
			sender: data.sender,
			action: data.action,
			onCancel: () => {
			}
		});
	}
}

async function loadCSS(href) {
	if (!href) return;
	return new Promise((resolve, reject) => {
		let existingLink = document.querySelector(`link[href="${href}"]`);
		if (existingLink) return resolve();
		let link = document.createElement("link");
		link.rel = "stylesheet";
		link.href = href;
		link.onload = () => resolve();
		link.onerror = () => reject(`Failed to load CSS: ${href}`);
		document.head.appendChild(link);
	});
}

function getCookieValue(name) {
	const cookies = document.cookie.split(";");
	for (let i = 0; i < cookies.length; i++) {
		const cookie = cookies[i].trim();
		if (cookie.startsWith(name + "=")) {
			return cookie.substring(name.length + 1);
		}
	}
	return null;
}

function checkSignUpStep(requiredStep) {
	const currentStep = sessionStorage.getItem("signUpStep");
	if (!currentStep) return false;
	const stepSequence = {
		start: 0,
		emailEntered: 1,
		emailVerified: 2,
		infoEntered: 3,
	};
	return stepSequence[currentStep] >= stepSequence[requiredStep];
}

function routeGuard(path) {
	if (path.startsWith("/auth/verify/") && !checkSignUpStep("emailEntered")) {
		return "/auth/register/";
	}
	if (
		path.startsWith("/auth/user-info/") &&
		!checkSignUpStep("emailVerified")
	) {
		return "/auth/register/";
	}
	return path;
}

async function navigate(path) {
	const routeConfig = routes[path] || routes["*"];
	const accessToken = getCookieValue("access");
	const refreshToken = getCookieValue("refresh");
	if (accessToken) handleConnectWebSocket();
	if (path === "/") {
		window.location.href = "/home";
	}

	if ((!accessToken || !refreshToken) && !path.startsWith("/auth/")) {
		window.location.href = "/auth/";
		return;
	}
	if (accessToken && refreshToken && path.startsWith("/auth/")) {
		window.location.href = "/";
		return;
	}

	const guardedPath = routeGuard(path);
	const route = routes[guardedPath] || routes["*"];
	document.title = route.title;
	const app = document.getElementById("main");
	app.style.visibility = "hidden";

	try {
		await loadCSS(route.css);
		const componentModule = await route.component();
		const component = componentModule.default;
		if (typeof component === "function") {
		
			app.innerHTML = component();
		} else {
			app.innerHTML = (await (await routes["*"].component()).default)();
		}
		if (route.controller) {
			const controllerModule = await route.controller();
			if (typeof controllerModule.default === "function") {
				controllerModule.default();
			}
		}
		app.style.visibility = "visible";
	} catch (error) {
		console.error(error);
		app.innerHTML = (await (await routes["*"].component()).default)();
	}
}

window.addEventListener("popstate", () => {
	navigate(window.location.pathname);
});

document.addEventListener("DOMContentLoaded", () => {
	navigate(window.location.pathname || "/");
});

window.addEventListener("load", async () => {
	const accessToken = getCookieValue("access");
	if (!accessToken) return;
	await mountTournamentsWs();
});

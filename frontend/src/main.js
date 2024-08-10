import home from "./components/home/home.js";
import chat from "./components/chat/chat.js";
import auth from './components/auth/index.js';
import game from './components/game/index.js'
import bar from "./components/navBar/navBar.js";
import NotFound from './components/NotFound.js'



const routes = {
    "/": { title: "Home", render: home, css: 'components/home/home.css' },
    "/chat": { title: "Chat", render: chat, css: 'components/chat/chat.css' },
    "/sign_in": { title: "Sign In", render: auth.sign_in, css: 'components/auth/assets/auth.css', init: auth.controller_sign_in },
    "/sign_in_2fa": { title: "Two-Factor Authentication", render: auth.sign_in_verify, css: 'components/auth/assets/auth.css',init: auth.controller_2fa  },
    "/sign_up": { title: "Sign Up", render: auth.sign_up, css: 'components/auth/assets/auth.css', init: auth.controller_sign_up  },
    "/sign_up_email": { title: "Email verification", render: auth.email, css: 'components/auth/assets/auth.css',init: auth.controller_email  },
    "/sign_up_info": { title: "Your Information", render: auth.info, css: 'components/auth/assets/auth.css', init: auth.controller_info},
	"/bar": { title: "Bar", render: bar, css: 'components/navBar/navBar.css' },
	"/game_match_making": {
		title: "Match Making",
		render: game.matchMaking,
		css: 'components/game/match_making/assets/match_making.css',
		init: game.controller_match_making
	},
	"/game": {
		title: " iN Game",
		render: game.in_game,
		css: './components/game/in_game/assets/game.css',
		init: game.controller_game
	},
	"*": { title: "404 Not Found", render: NotFound }  // Wildcard for 404

};

function loadCSS(href) {
	if(!href)
		return
    return new Promise((resolve, reject) => {
        let existingLink = document.querySelector(`link[href="${href}"]`);
        if (existingLink)
            return resolve()
        let link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.onload = () => resolve();
        link.onerror = () => reject(`Failed to load CSS: ${href}`);
        document.head.appendChild(link);
    });
}

function getCookieValue(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
            return cookie.substring(name.length + 1);
        }
    }
    return null;
}



function checkSignUpStep(requiredStep) {
    const currentStep = sessionStorage.getItem('signUpStep');
    console.log("currentStep:", currentStep, "requiredStep:", requiredStep);

    if (!currentStep) {
        return false;
    }
    const stepSequence = {
        'start': 0,
        'emailEntered': 1,
        'emailVerified': 2,
        'infoEntered': 3
    };

    return stepSequence[currentStep] >= stepSequence[requiredStep];
}


function routeGuard(path) {
	console.log(`path :${path}, !checkSignUpStep('emailEntered') ${checkSignUpStep('emailEntered')}`)
	if (path.startsWith('/sign_up_email') && !checkSignUpStep('emailEntered')) {
        return '/sign_up';
    }
    if (path.startsWith('/sign_up_info') && !checkSignUpStep('emailVerified')) {
        return '/sign_up';
    }
    return path;
}


async function navigate(path) {
    const route = routes[path];
	const accessToken = getCookieValue('access');
	const refreshToken = getCookieValue('refresh');

	console.log(`access :${accessToken}\n refresh: ${refreshToken} \n pathChecker: ${path.startsWith('/sign')}`)
	if ((!accessToken || !refreshToken) && !path.startsWith('/sign')) {
		console.log('not auth')
		window.location.href = '/sign_in';
	}
	
	if ((accessToken || refreshToken) && path.startsWith("/sign")){
		console.log('auth')
		window.location.href = '/';
	}
    if (route) {
		const guardedPath = routeGuard(path);
		const route = routes[guardedPath] || routes['*']; 
        document.title = route.title;
        const app = document.getElementById('app');
        app.style.visibility = 'hidden';
        try {
			await loadCSS(route.css);
			app.innerHTML = route.render();
            if (route.init) {
				console.log('HERE')
				route.init();
            }
            app.style.visibility = 'visible';
        } catch (error) {
            console.error(error);
        }
    } else {
		app.innerHTML = NotFound();
    }
}
window.addEventListener('popstate', () => {
	console.log('here')
    
	navigate(window.location.pathname);
});

document.addEventListener('DOMContentLoaded', () => {
	console.log('here')
    navigate(window.location.pathname || '/');
});

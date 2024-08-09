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
		css: './components/game/ingame/assets/game.css',
		init: game.controller_game
	},
	"*": { title: "404 Not Found", render: NotFound }  // Wildcard for 404

};

function loadCSS(href) {
	console.log('href', href)
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


async function navigate(path) {
    const route = routes[path];

    if (route) {
        document.title = route.title;
        const app = document.getElementById('app');

        // Hide the content initially
        app.style.visibility = 'hidden';

        try {
			// Load the appropriate CSS file
			await loadCSS(route.css);

			// Render the HTML after CSS is loaded
			app.innerHTML = route.render();

            if (route.init) {
				console.log('HERE')
				route.init();
            }

            // Show the content after rendering
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

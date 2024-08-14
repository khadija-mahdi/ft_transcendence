const routes = {
    "/": { title: "Home", component: () => import("./components/home/View/home.js"), css: './components/home/assets/home.css', controller: () => import('./components/home/Controller/home.js') },
    "/chat": { title: "Chat", component: () => import("./components/chat/View/chat.js"), css: './components/chat/assets/chat.css', controller: () => import('./components/chat/Controller/chat.js') },
    "/tournaments": { title: "Tournaments", component: () => import("./components/tournaments/View/Tournaments.js"), css: './components/tournaments/assets/Tournaments.css', controller: () => import('./components/tournaments/Controller/Tournaments.js') },
    "/ranking": { title: "Ranking", component: () => import("./components/Ranking/View/Ranking.js"), css: "./components/Ranking/assets/Ranking.css", controller: () => import('./components/Ranking/Controller/Ranking.js') },
    "/sign_in": { title: "Sign In", component: () => import("./components/auth/View/sing_in.js"), css: './components/auth/assets/auth.css', controller: () => import('./components/auth/Controller/sing_in.js') },
    "/sign_in_2fa": { title: "Two-Factor Authentication", component: () => import("./components/auth/View/totp.js"), css: './components/auth/assets/auth.css', controller: () => import('./components/auth/Controller/totp.js') },
    "/sign_up": { title: "Sign Up", component: () => import("./components/auth/View/sign_up.js"), css: './components/auth/assets/auth.css', controller: () => import('./components/auth/Controller/sign_up.js') },
    "/sign_up_email": { title: "Email Verification", component: () => import("./components/auth/View/email_ver.js"), css: './components/auth/assets/auth.css', controller: () => import('./components/auth/Controller/email_ver.js') },
    "/sign_up_info": { title: "Your Information", component: () => import("./components/auth/View/use_info.js"), css: './components/auth/assets/auth.css', controller: () => import('./components/auth/Controller/use_info.js') },
    "/game_match_making": { title: "Match Making", component: () => import("./components/game/match_making/View/match_making.js"), css: './components/game/match_making/assets/match_making.css', controller: () => import('./components/game/match_making/Controller/match_making.js') },
    "/game": { title: "In Game", component: () => import("./components/game/in_game/View/game.js"), css: './components/game/in_game/assets/game.css', controller: () => import('./components/game/in_game/Controller/game.js') },
    "/settings": { title: "Settings", component: () => import("./components/settings/View/Settings.js"), css: './components/settings/assets/style.css', controller: () => import('./components/settings/Controller/Settings.js') },
    "*": { title: "404 Not Found", component: () => import('./lib/NotFound.js') }
};

export default routes;

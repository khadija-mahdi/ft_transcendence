const routes = {
	"/home": {
		title: "Home",
		component: () => import("/src/components/home/View/home.js"),
		css: "/src/components/home/assets/home.css",
		controller: () => import("/src/components/home/Controller/home.js"),
	},
	"/messenger": {
		title: "Chat",
		component: () => import("/src/components/chat/View/chat.js"),
		css: "/src/components/chat/assets/chat.css",
		controller: () => import("/src/components/chat/Controller/chat.js"),
	},
	"/tournaments": {
		title: "Tournaments",
		component: () => import("/src/components/tournaments/View/Tournaments.js"),
		css: "/src/components/tournaments/assets/Tournaments.css",
		controller: () =>
			import("/src/components/tournaments/Controller/Tournaments.js"),
	},
	"/tournaments/tournament": {
		title: "Tournament",
		component: () => import("/src/components/tournament/View/Tournament.js"),
		css: "/src/components/tournament/assets/Tournament.css",
		controller: () => import("/src/components/tournament/Controller/Tournament.js"),
	},
	"/tournaments/create_tournament": {
		title: "Create Tournament",
		component: () =>
			import("/src/components/create_tournament/View/create_tournament.js"),
		css: "/src/components/create_tournament/assets/create_tournament.css",
		controller: () =>
			import("/src/components/create_tournament/Controller/create_tournament.js"),
	},
	"/ranking": {
		title: "Ranking",
		component: () => import("/src/components/Ranking/View/Ranking.js"),
		css: "/src/components/Ranking/assets/Ranking.css",
		controller: () => import("/src/components/Ranking/Controller/Ranking.js"),
	},
	"/auth/": {
		title: "Sign In",
		component: () => import("/src/components/auth/View/sing_in.js"),
		css: "/src/components/auth/assets/auth.css",
		controller: () => import("/src/components/auth/Controller/sing_in.js"),
	},
	"/auth/2fa": {
		title: "Two-Factor Authentication",
		component: () => import("/src/components/auth/View/totp.js"),
		css: "/src/components/auth/assets/auth.css",
		controller: () => import("/src/components/auth/Controller/totp.js"),
	},
	"/auth/register/": {
		title: "Sign Up",
		component: () => import("/src/components/auth/View/sign_up.js"),
		css: "/src/components/auth/assets/auth.css",
		controller: () => import("/src/components/auth/Controller/sign_up.js"),
	},
	"/auth/register/verify/": {
		title: "Email Verification",
		component: () => import("/src/components/auth/View/email_ver.js"),
		css: "/src/components/auth/assets/auth.css",
		controller: () => import("/src/components/auth/Controller/email_ver.js"),
	},
	"/auth/register/user-info/": {
		title: "Your Information",
		component: () => import("/src/components/auth/View/use_info.js"),
		css: "/src/components/auth/assets/auth.css",
		controller: () => import("/src/components/auth/Controller/use_info.js"),
	},
	"/game/match_making": {
		title: "Match Making",
		component: () =>
			import("/src/components/game/match_making/View/match_making.js"),
		css: "/src/components/game/match_making/assets/match_making.css",
		controller: () =>
			import("/src/components/game/match_making/Controller/match_making.js"),
	},
	"/game/choice-game": {
		title: "choice Game Type",
		component: () =>
			import("/src/components/game/choice_game/View/choice_game.js"),
		css: "/src/components/game/choice_game/assets/choice_game.css",
		controller: () =>
			import("/src/components/game/choice_game/Controller/choice_game.js"),
	},
	"/game": {
		title: "In Game",
		component: () => import("/src/components/game/in_game/View/game.js"),
		css: "/src/components/game/in_game/assets/game.css",
		controller: () => import("/src/components/game/in_game/Controller/game.js"),
	},
	"/settings": {
		title: "Settings",
		component: () => import("/src/components/settings/View/Settings.js"),
		css: "/src/components/settings/assets/style.css",
		controller: () => import("/src/components/settings/Controller/Settings.js"),
	},
	"/settings/block-list": {
		title: "Block List",
		component: () => import("/src/components/block_list/View/block_list.js"),
		css: "/src/components/block_list/assets/block_list.css",
		controller: () => import("/src/components/block_list/Controller/block_list.js"),
	},
	"/profile": {
		title: "profile",
		component: () => import("/src/components/profile/view/index.js"),
		css: "/src/components/profile/assets/style.css",
		controller: () => import("/src/components/profile/controller/index.js"),
	},
	"/notification": {
		title: "notification",
		component: () => import("/src/components/notification/View/notification.js"),
		css: "/src/components/notification/assets/style.css",
		controller: () => import("/src/components/notification/Controller/notification.js"),
	},
	"/home/all-players": {
		title: "All players",
		component: () => import("/src/components/all_Players/View/all_players.js"),
		css: "/src/components/all_Players/assets/all_players.css",
		controller: () =>
			import("/src/components/all_Players/Controller/all_players.js"),
	},
	"/home/friends": {
		title: "all Friends",
		component: () => import("/src/components/friends/View/all_friends.js"),
		css: "/src/components/friends/assets/all_friends.css",
		controller: () => import("/src/components/friends/Controller/all_friends.js"),
	},
	"/home/Online-players": {
		title: "All Online Players",
		component: () => import("/src/components/all_Online/View/all_online.js"),
		css: "/src/components/all_Online/assets/all_online.css",
		controller: () => import("/src/components/all_Online/Controller/all_online.js"),
	},
	"*": {
		title: "404 Not Found",
		component: () => import("/src/lib/NotFound/NotFound.js"),
		css: "/src/lib/NotFound/notFound.css",
	},
};

export default routes;

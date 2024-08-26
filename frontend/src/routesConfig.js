const routes = {
	"/home": {
		title: "Home",
		component: () => import("/components/home/View/home.js"),
		css: "/components/home/assets/home.css",
		controller: () => import("/components/home/Controller/home.js"),
	},
	"/messenger": {
		title: "Chat",
		component: () => import("/components/chat/View/chat.js"),
		css: "/components/chat/assets/chat.css",
		controller: () => import("/components/chat/Controller/chat.js"),
	},
	"/messenger/group": {
		title: "Create Group",
		component: () => import("/components/chat/groups/View/groups.js"),
		css: "/components/chat/groups/assets/groups.css",
		controller: () => import("/components/chat/groups/Controller/groups.js"),
	},
	"/messages/group/choice-members": {
		title: "Choose Group Members",
		component: () =>
			import("/components/chat/choice_members/View/choice_members.js"),
		css: "/components/chat/choice_members/assets/choice_members.css",
		controller: () =>
			import("/components/chat/choice_members/Controller/choice_members.js"),
	},
	"/tournaments": {
		title: "Tournaments",
		component: () => import("/components/tournaments/View/Tournaments.js"),
		css: "/components/tournaments/assets/Tournaments.css",
		controller: () =>
			import("/components/tournaments/Controller/Tournaments.js"),
	},
	"/tournaments/tournament": {
		title: "Tournament",
		component: () => import("/components/tournament/View/Tournament.js"),
		css: "/components/tournament/assets/Tournament.css",
		controller: () => import("/components/tournament/Controller/Tournament.js"),
	},
	"/tournaments/create_tournament": {
		title: "Create Tournament",
		component: () =>
			import("/components/create_tournament/View/create_tournament.js"),
		css: "/components/create_tournament/assets/create_tournament.css",
		controller: () =>
			import("/components/create_tournament/Controller/create_tournament.js"),
	},
	"/ranking": {
		title: "Ranking",
		component: () => import("/components/Ranking/View/Ranking.js"),
		css: "/components/Ranking/assets/Ranking.css",
		controller: () => import("/components/Ranking/Controller/Ranking.js"),
	},
	"/sign_in": {
		title: "Sign In",
		component: () => import("/components/auth/View/sing_in.js"),
		css: "/components/auth/assets/auth.css",
		controller: () => import("/components/auth/Controller/sing_in.js"),
	},
	"/sign_in_2fa": {
		title: "Two-Factor Authentication",
		component: () => import("/components/auth/View/totp.js"),
		css: "/components/auth/assets/auth.css",
		controller: () => import("/components/auth/Controller/totp.js"),
	},
	"/sign_up": {
		title: "Sign Up",
		component: () => import("/components/auth/View/sign_up.js"),
		css: "/components/auth/assets/auth.css",
		controller: () => import("/components/auth/Controller/sign_up.js"),
	},
	"/sign_up_email": {
		title: "Email Verification",
		component: () => import("/components/auth/View/email_ver.js"),
		css: "/components/auth/assets/auth.css",
		controller: () => import("/components/auth/Controller/email_ver.js"),
	},
	"/sign_up_info": {
		title: "Your Information",
		component: () => import("/components/auth/View/use_info.js"),
		css: "/components/auth/assets/auth.css",
		controller: () => import("/components/auth/Controller/use_info.js"),
	},
	"/game_match_making": {
		title: "Match Making",
		component: () =>
			import("/components/game/match_making/View/match_making.js"),
		css: "/components/game/match_making/assets/match_making.css",
		controller: () =>
			import("/components/game/match_making/Controller/match_making.js"),
	},
	"/game": {
		title: "In Game",
		component: () => import("/components/game/in_game/View/game.js"),
		css: "/components/game/in_game/assets/game.css",
		controller: () => import("/components/game/in_game/Controller/game.js"),
	},
	"/settings": {
		title: "Settings",
		component: () => import("/components/settings/View/Settings.js"),
		css: "/components/settings/assets/style.css",
		controller: () => import("/components/settings/Controller/Settings.js"),
	},
	"/profile": {
		title: "profile",
		component: () => import("/components/profile/view/index.js"),
		css: "/components/profile/assets/style.css",
		controller: () => import("/components/profile/controller/index.js"),
	},
	"/home/all-players": {
		title: "All players",
		component: () => import("/components/all_Players/View/all_players.js"),
		css: "/components/all_Players/assets/all_players.css",
		controller: () =>
			import("/components/all_Players/Controller/all_players.js"),
	},
	"/home/friends": {
		title: "all Friends",
		component: () => import("/components/friends/View/all_friends.js"),
		css: "/components/friends/assets/all_friends.css",
		controller: () => import("/components/friends/Controller/all_friends.js"),
	},
	"/home/Online-players": {
		title: "All Online Players",
		component: () => import("/components/all_Online/View/all_online.js"),
		css: "/components/all_Online/assets/all_online.css",
		controller: () => import("/components/all_Online/Controller/all_online.js"),
	},
	"*": {
		title: "404 Not Found",
		component: () => import("/lib/NotFound/NotFound.js"),
		css: "/lib/NotFound/notFound.css",
	},
	"not-found": {
		title: "404 Not Found",
		component: () => import("/lib/NotFound/NotFound.js"),
		css: "/lib/NotFound/notFound.css",
	},
};

export default routes;

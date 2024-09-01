import { Empty } from "../../../../lib/Empty.js";
import { fetchWithAuth } from '../../../../lib/apiMock.js';
import { userContext } from "../../userContext.js";

export function MembersContainer({ name, href, number, user }) {
	const container = document.createElement('div');
	container.className = 'friend-container';

	const link = document.createElement('a');
	link.href = `/profile?username=${name}`;
	link.className = 'friend-link';

	const image = document.createElement('img');
	image.className = 'friend-profile-image';
	image.src = href;
	image.alt = 'Profile Image';
	image.width = 53;
	image.height = 53;

	const textContainer = document.createElement('div');
	textContainer.className = 'friend-text-container';

	const nameDiv = document.createElement('div');
	nameDiv.className = 'friend-name';
	nameDiv.textContent = name;

	const levelDiv = document.createElement('div');
	levelDiv.className = 'friend-level';
	levelDiv.textContent = `Level ${number}`;

	textContainer.appendChild(nameDiv);
	textContainer.appendChild(levelDiv);

	link.appendChild(image);
	link.appendChild(textContainer);

	const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	svg.setAttribute("width", "25");
	svg.setAttribute("height", "25");
	svg.setAttribute("viewBox", "0 0 25 25");
	svg.setAttribute("fill", "none");
	svg.setAttribute("data-original", "true"); // Default to add icon

	container.appendChild(link);
	container.appendChild(svg);

	setupSvgIcon(svg, user);

	return container;
}

function setupSvgIcon(svg, user) {
	const isUserInList = userContext.getState().users.some(u => u.id === user.id);

	if (isUserInList) {
		svg.innerHTML = `
            <path d="M5.5 13.4043V11.4043H19.5V13.4043H5.5Z" fill="#C60000" />
        `;
		svg.setAttribute('data-original', 'false'); // Indicates "remove" icon
	} else {
		svg.innerHTML = `
            <path d="M11.5 13.4043H5.5V11.4043H11.5V5.4043H13.5V11.4043H19.5V13.4043H13.5V19.4043H11.5V13.4043Z" fill="#F8F8F8" />
        `;
		svg.setAttribute('data-original', 'true'); // Indicates "add" icon
	}

	svg.addEventListener('click', () => toggleSvgIcon(svg, user));
}

function toggleSvgIcon(svg, user) {
	const isOriginal = svg.getAttribute('data-original') === 'true';

	if (isOriginal) {
		svg.innerHTML = `
            <path d="M5.5 13.4043V11.4043H19.5V13.4043H5.5Z" fill="#C60000" />
        `;
		userContext.addUser(user);
	} else {
		svg.innerHTML = `
            <path d="M11.5 13.4043H5.5V11.4043H11.5V5.4043H13.5V11.4043H19.5V13.4043H13.5V19.4043H11.5V13.4043Z" fill="#F8F8F8" />
        `;
		userContext.removeUser(user.id);
	}

	svg.setAttribute('data-original', !isOriginal);
}


async function fetchMyFriends(q) {
	let apiUrl = "";

	if (!q || q === '')
		apiUrl = "https://localhost:4433/api/v1/users/friend-list";
	else
		apiUrl = `https://localhost:4433/api/v1/users/search-user/?none_friend_only=false&search_query=${q}`;

	if (apiUrl) {
		try {
			const response = await fetchWithAuth(apiUrl, {
				method: 'GET',
			});
			return response.results.map((result) => ({
				...result, image_url: result.image_url?.replace("https://localhost/", "https://localhost:4433/")
			}));
		} catch (error) {
			return [];
		}
	}
}

export default async function renderFriends() {
	const searchInput = document.getElementById('searchInput');
	const friendsContainer = document.getElementById('friends-container');
	const selectBtn = document.getElementById('selectBtn');
	const cancelBtn = document.getElementById('cancelBtn');
	const users = userContext.getUsers();

	cancelBtn.addEventListener('click', () => {
		users.forEach(user => {
			userContext.removeUser(user.id);

		});
		window.location.href = '/messenger/group';
	});

	selectBtn.addEventListener('click', () => {
		window.location.href = '/messenger/group'; // Change URL to /messenger/group
	});
	searchInput.addEventListener('input', debounce(async (e) => {
		const term = e.target.value;
		const urlParams = new URLSearchParams(window.location.search);

		if (term) {
			urlParams.set('q', term);
		} else {
			urlParams.delete('q');
		}

		window.history.replaceState(null, '', `${window.location.pathname}?${urlParams}`);

		const friends = await fetchMyFriends(term);
		renderMembersList(friends);
	}, 300));

	const friends = await fetchMyFriends();
	renderMembersList(friends);

	function debounce(func, delay) {
		let timeout;
		return function () {
			clearTimeout(timeout);
			timeout = setTimeout(() => func.apply(this, arguments), delay);
		};
	}

	function renderMembersList(friends) {
		friendsContainer.innerHTML = '';
		if (!friends.length) {
			const emptyComponent = Empty('No Friends Found');
			const emptyContainer = document.createElement('div');
			emptyContainer.className = 'emptyContainer';
			emptyContainer.appendChild(emptyComponent);
			friendsContainer.appendChild(emptyContainer);
		} else {
			friends.forEach(friend => {
				const friendComponent = MembersContainer({
					id: friend.id,
					name: friend.username,
					href: friend.image_url,
					number: friend.level,
					user: friend,
				});
				const friendWrapper = document.createElement('div');
				friendWrapper.className = 'friend-wrapper';
				friendWrapper.appendChild(friendComponent);
				friendsContainer.appendChild(friendWrapper);
			});
		}
	}
}

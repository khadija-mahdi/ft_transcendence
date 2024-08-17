import { Empty } from "../../../../lib/Empty.js";
import { fetchWithAuth } from '../../../../lib/apiMock.js'


export function FriendContainer({ name, href, number }) {
	const container = document.createElement('div');
	container.className = 'friend-container';

	const link = document.createElement('a');
	link.href = `/profile/${name}`;
	link.className = 'friend-link';

	const image = document.createElement('img');
	image.className = 'firend-profile-image';
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
	svg.setAttribute("fill", "none");

	const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
	path.setAttribute("stroke", "#fff");
	path.setAttribute("stroke-linecap", "round");
	path.setAttribute("stroke-linejoin", "round");
	path.setAttribute("stroke-width", "1.5");
	path.setAttribute("d", "m9 5.5 7 7-7 7");

	svg.appendChild(path);

	const arrowLink = document.createElement('a');
	arrowLink.href = `/profile/${name}`;
	arrowLink.className = 'friend-arrow-link';
	arrowLink.appendChild(svg);

	container.appendChild(link);
	container.appendChild(arrowLink);

	return container;
}


async function fetchMyFriends() {
	const apiUrl = "https://localhost:4433/api/v1/users/friend-list";
	try {
		const response = await fetchWithAuth(apiUrl, {
			method: 'GET',
		});
		return response.results.map((result) => ({
			...result, image_url: result.image_url?.replace("https://localhost/",
				"https://localhost:4433/")
		}));
	} catch (error) {
		console.error("Error fetching user data:", error);
	}
}


export default async function renderFriends() {
	const friends = await fetchMyFriends();
	const friendsContainer = document.getElementById('friends-container');

	friendsContainer.innerHTML = '';

	if (!friends.length) {
		const emptyComponent = Empty('No Friends Found');
		const emptyContainer = document.createElement('div');
		emptyContainer.className = 'emptyContainer';
		emptyContainer.appendChild(emptyComponent);
		friendsContainer.appendChild(emptyContainer);
	} else {
		friends.slice(0, 4).forEach(friend => {
			const friendComponent = FriendContainer({
				name: friend.username,
				href: friend.image_url,
				number: friend.level,
			});
			const friendWrapper = document.createElement('div');
			friendWrapper.className = 'friend-wrapper';
			friendWrapper.appendChild(friendComponent);
			friendsContainer.appendChild(friendWrapper);
		});

		if (friends.length > 4) {
			const viewAllContainer = document.createElement('div');
			viewAllContainer.className = 'view-all-container';
			const gridContainer = document.createElement('div');
			gridContainer.className = 'view-all-grid';
			const flexContainer = document.createElement('div');
			flexContainer.className = 'view-all-flex';

			const viewAllLink = document.createElement('a');
			viewAllLink.href = '/home/friends';
			viewAllLink.className = 'view-all-link';

			const viewAllText = document.createTextNode('View All');
			viewAllLink.appendChild(viewAllText);

			flexContainer.appendChild(viewAllLink);
			gridContainer.appendChild(flexContainer);
			viewAllContainer.appendChild(gridContainer);
			friendsContainer.appendChild(viewAllContainer);
		}
	}
}
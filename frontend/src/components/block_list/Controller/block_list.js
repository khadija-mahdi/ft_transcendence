import { Empty } from "/src/lib/Empty.js";
import { fetchWithAuth } from "/src/lib/apiMock.js";

export function BlockListContainer({ name, href, number, index }) {
	const container = document.createElement("div");
	container.className = "friend-container";

	const link = document.createElement("a");
	link.href = `/profile?username=${name}`;
	link.className = "friend-link";

	const image = document.createElement("img");
	image.className = "friend-profile-image";
	image.src = href;
	image.alt = "Profile Image";
	image.width = 53;
	image.height = 53;
	const textContainer = document.createElement("div");
	textContainer.className = "friend-text-container";

	const nameDiv = document.createElement("div");
	nameDiv.className = "friend-name";
	nameDiv.textContent = name;

	const levelDiv = document.createElement("div");
	levelDiv.className = "friend-level";
	levelDiv.textContent = `Level ${number}`;

	textContainer.appendChild(nameDiv);
	textContainer.appendChild(levelDiv);

	link.appendChild(image);
	link.appendChild(textContainer);

	const inviteLink = document.createElement("button");
	inviteLink.className = "invite-button";

	const inviteContent = document.createElement("div");
	inviteContent.className = "invite-content";

	const inviteText = document.createElement("div");
	inviteText.className = "invite-text";
	inviteText.textContent = "Unblock";

	inviteContent.appendChild(inviteText);
	inviteLink.appendChild(inviteContent);

	container.appendChild(link);
	container.appendChild(inviteLink);

	return container;
}

async function fetchBlockList(q) {
	let apiUrl = "";
	if (!q || q === '')
		apiUrl = "/api/v1/users/blocked-list/";
	else
		apiUrl = `/api/v1/users/blocked-list/?search=${q}`;

	try {
		const response = await fetchWithAuth(apiUrl, {
			method: "GET",
		});
		console.log("url : ", apiUrl, "response.results : ", response.results);
		return response.results
	} catch (error) {
		return [];
	}
}



function handleUnblockUser(userId, Button) {
	console.log("userId : ", userId, "Button : ", Button);
	Button.addEventListener("click", async function () {
		await processUnblockUser(userId, Button);
	});

}

async function processUnblockUser(userId, button) {
	try {
		const url = `/api/v1/users/unblock-user/${userId}/`;
		await fetchWithAuth(url, {
			method: "DELETE",
		});

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

		button.innerHTML = "";
		button.style.backgroundColor = "#373737";
		button.style.justifyContent = "end";
		button.appendChild(svg);
	} catch (error) {
		return;
	}
}


export default async function renderBlockList() {
	const BlokContainer = document.getElementById(
		"BlockList-container"
	);
	const searchInput = document.getElementById("searchInput");

	searchInput.addEventListener(
		"input",
		debounce(async (e) => {
			const term = e.target.value;
			const urlParams = new URLSearchParams(window.location.search);

			if (term) {
				urlParams.set("q", term);
			} else {
				urlParams.delete("q");
			}

			window.history.replaceState(
				null,
				"",
				`${window.location.pathname}?${urlParams}`
			);

			const BlockList = await fetchBlockList(term);
			renderBlockList(BlockList); BlockList
		}, 300)
	);

	const BlockList = await fetchBlockList();
	renderBlockList(BlockList);

	function debounce(func, delay) {
		let timeout;
		return function () {
			clearTimeout(timeout);
			timeout = setTimeout(() => func.apply(this, arguments), delay);
		};
	}

	function renderBlockList(BlockList) {
		BlokContainer.innerHTML = "";
		if (!BlockList.length) {
			const emptyComponent = Empty("No User Blocked");
			const emptyContainer = document.createElement("div");
			emptyContainer.className = "emptyContainer";
			emptyContainer.appendChild(emptyComponent);
			BlokContainer.appendChild(emptyContainer);
		} else {
			BlockList.forEach((friend) => {
				const BlockListComponent = BlockListContainer({
					name: friend.username,
					href: friend.image_url,
					number: friend.level,
				});
				const friendWrapper = document.createElement("div");
				friendWrapper.className = "friend-wrapper";
				friendWrapper.appendChild(BlockListComponent);
				BlokContainer.appendChild(friendWrapper);

				const UnblockButton = friendWrapper.querySelector(".invite-button");
				handleUnblockUser(
					friend.id,
					UnblockButton,
				);
			});
		}
	}
}

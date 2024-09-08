import { fetchWithAuth } from "/src/lib/apiMock.js";
import AuthWebSocket from "/lib/authwebsocket.js";
import { renderMessagesItems } from "./headerChat.js";

let clickedIndex = 0;
let isFilter = false;
let rooms = [];

async function fetchRooms(q = "", filter = false) {
	let apiUrl = filter
		? "/api/v1/chat/filter-rooms/"
		: `/api/v1/chat/rooms/?q=${q}`;

	try {
		const response = await fetchWithAuth(apiUrl, {
			method: "GET",
		});
		return response.results;
	} catch (error) {
		return [];
	}
}

function getLastMessage({ lastMessage, type }) {
	const username = "YourUsername";
	if (lastMessage === null) return "";

	let sender = lastMessage.sender_username;
	if (username === sender) sender = "You";

	if (!lastMessage.message) {
		if (lastMessage.type === "image" && type === "group")
			return `${sender}: Sent a Photo`;
		return "Photo";
	} else {
		if (lastMessage.type === "text" && type === "group")
			return `${sender}: ${lastMessage.message}`;
		return lastMessage.message;
	}
}

function formatTime(timestamp) {
	if (timestamp === undefined) return "";
	const messageDate = new Date(timestamp);
	const currentDate = new Date();

	if (messageDate.toDateString() === currentDate.toDateString()) {
		return `${messageDate.getHours().toString().padStart(2, "0")}:${messageDate
			.getMinutes()
			.toString()
			.padStart(2, "0")}`;
	} else {
		const daysAgo = Math.floor(
			(currentDate - messageDate) / (1000 * 60 * 60 * 24)
		);
		if (daysAgo === 1) return "Yesterday";
		if (daysAgo < 7)
			return [
				"Sunday",
				"Monday",
				"Tuesday",
				"Wednesday",
				"Thursday",
				"Friday",
				"Saturday",
			][messageDate.getDay()];
		return `${messageDate.getFullYear()}/${(messageDate.getMonth() + 1)
			.toString()
			.padStart(2, "0")}/${messageDate.getDate().toString().padStart(2, "0")}`;
	}
}

function renderMessengerItem(item) {
	const messengerContainer = document.getElementById("messenger-container");
	const lastMessageContent = getLastMessage({
		lastMessage: item.last_message,
		type: item.type,
	});
	const lastMessageTime = formatTime(item.last_message?.created_at);

	const messengerItem = document.createElement("div");
	messengerItem.className = `messenger-item ${clickedIndex === item.id
			? "selected"
			: item.unseen_messages_count
				? "highlight"
				: ""
		}`;

	messengerItem.innerHTML = `
        <div class="content">
            <div class="avatar">
                <img  src="${item.room_icon ||
		"/public/assets/images/defualtgroupProfile.png"
		}" alt="${item.room_name}">
            </div>
            <div class="info">
                <div class="name">${item.room_name}</div>
                <div class="last-message">${lastMessageContent || ""}</div>
            </div>
        </div>
        <div class="message-info">
            ${item.unseen_messages_count !== 0 &&
			clickedIndex !== item.id &&
			item.last_message &&
			item.last_message.id !== null
			? `<div class="unread-count">${item.unseen_messages_count}</div>`
			: `<div class=""></div>`
		}
			${lastMessageTime
			? `<div class="timestamp">${lastMessageTime}</div>`
			: `<div></div>`
		}
        </div>
    `;

	messengerItem.addEventListener("click", () => handleIconClick(item));
	messengerContainer.appendChild(messengerItem);
}

async function handleIconClick(item) {
	clickedIndex = item.id;
	document.getElementById("messenger-container").innerHTML = "";
	const roomId = item.id;
	const roomDetailUrl = `/api/v1/chat/rooms/${roomId}/`;

	try {
		const response = await fetchWithAuth(roomDetailUrl, {
			method: "GET",
		});

		renderMessagesItems(response);
	} catch (error) {
		return [];
	}

	renderRoomsList(rooms);
}

function updateRooms(newRoom) {
	const roomId = newRoom.id.toString();
	const roomIndex = rooms.findIndex((room) => room.id.toString() === roomId);

	if (roomIndex !== -1) rooms.splice(roomIndex, 1);

	rooms.unshift(newRoom);

	renderRoomsList(rooms);
}

function renderRoomsList(rooms) {
	const messengerContainer = document.getElementById("messenger-container");
	if (messengerContainer) {
		messengerContainer.innerHTML = "";
		rooms.forEach((item) => renderMessengerItem(item));
	}
}

export async function ChatRoomsPanel() {
	const filterButton = document.getElementById("filter");
	const searchInput = document.getElementById("searchInput");

	filterButton.addEventListener("click", async () => {
		isFilter = !isFilter;
		filterButton.style.backgroundColor = isFilter ? "#878787" : "";
		filterButton.style.borderRadius = isFilter ? "5px" : "";

		rooms = await fetchRooms("", isFilter);
		renderRoomsList(rooms);
	});

	searchInput.addEventListener("input", async (e) => {
		const term = e.target.value;
		rooms = await fetchRooms(term, false);
		renderRoomsList(rooms);
	});

	rooms = await fetchRooms("", isFilter);
	renderRoomsList(rooms);

	const socket = new AuthWebSocket("wss://localhost:4433/ws/rooms/");

	socket.onmessage = (event) => {
		const data = JSON.parse(event.data);
		const { message, chat_room } = data;
		const roomId = message.room_id.toString();

		const updatedRoom = {
			id: roomId,
			room_name: chat_room.room_name,
			room_icon: chat_room.room_icon,
			last_message: chat_room.last_message,
			unseen_messages_count: chat_room.unseen_messages_count,
			type: chat_room.type,
			members: chat_room.members,
			admin: chat_room.admin,
			all_messages_count: chat_room.all_messages_count,
		};

		updateRooms(updatedRoom);
	};
	return () => {
		socket.close();
	};
}

function ChatSmallWindow() { }

export default async function () {
	ChatRoomsPanel();
	const urlParams = new URLSearchParams(window.location.search);
	const chatRoom = urlParams.get("chatroom");
	if (chatRoom) {
		const url = `/api/v1/chat/get-chat-room/${chatRoom}/`;
		try {
			const response = await fetchWithAuth(url, {
				method: "GET",
			});
			renderMessagesItems(response.results[0]);
		} catch (error) {
			return [];
		}
	}
}

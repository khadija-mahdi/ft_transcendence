import { showPopup } from "/src/lib/Confirm.js";
import { fetchWithAuth } from "/src/lib/apiMock.js";
import { fetchBlockList } from "/src/_api/user.js";
import { ChatRoomsPanel } from "./chat.js";


const blockList = await fetchBlockList();

export function handleThreeDotPanel(threeDots, optionsPanel, selectedChat, originRooms) {
	const isAdmin = true;
	const isBlocked = selectedChat && selectedChat.receiverUser && blockList.some((user) => user.username === selectedChat.receiverUser[0].username);
	if (threeDots && optionsPanel) {
		threeDots.addEventListener("click", () => {
			optionsPanel.classList.toggle("hidden");
			if (!optionsPanel.classList.contains("hidden")) {
				optionsPanel.innerHTML = `
                    <div class="panel-options-content">
                        ${selectedChat.type === "private"
						? `
                            <button id="clear-chat" class="panel-option-button">Clear Chat</button>
                            <button id="close-chat" class="panel-option-button">Close Chat</button>
                            <button id="delete-chat" class="panel-option-button">Delete Chat</button>
                            <button id="${isBlocked ? "unblock-user" : "block-user"}" class="panel-option-button">${isBlocked ? "unBlock" : "Block"}</button>
                        `
						: `
                            <button id="group-info" class="panel-option-button">Group Info</button>
                            <button id="exit-group" class="panel-option-button">Exit Group</button>
                            ${isAdmin
							? `<button id="delete-group" class="panel-option-button">Delete Group</button>`
							: ""
						}
                        `
					}
                    </div>
                `;

				attachButtonListeners(selectedChat, originRooms);
			}
		});
	}
}

function attachButtonListeners(selectedChat, originRooms) {
	const clearChatBtn = document.getElementById("clear-chat");
	if (clearChatBtn) {
		clearChatBtn.addEventListener("click", () => {
			clearChat(selectedChat.id);
		});
	}

	const closeChatBtn = document.getElementById("close-chat");
	if (closeChatBtn) {
		closeChatBtn.addEventListener("click", () => {
			closeChat(originRooms);
		});
	}

	const deleteChatBtn = document.getElementById("delete-chat");
	if (deleteChatBtn) {
		deleteChatBtn.addEventListener("click", () => {
			deleteChat(selectedChat);
		});
	}

	const blockUserBtn = document.getElementById("block-user");
	const unblockUserBtn = document.getElementById("unblock-user");
	if (blockUserBtn) {
		blockUserBtn.addEventListener("click", () => {
			blockUnBlockUser(selectedChat, "block");
		});
	}
	else if (unblockUserBtn) {

		unblockUserBtn.addEventListener("click", () => {
			blockUnBlockUser(selectedChat, "unblock");
		});
	}

	const groupInfoBtn = document.getElementById("group-info");
	if (groupInfoBtn) {
		groupInfoBtn.addEventListener("click", () => {
			showGroupInfo(selectedChat);
		});
	}
}

function clearChat(id) {
	showPopup({
		title: "Are you sure you want to Clear this Chat?",
		subtitle: "The room will remain, but all messages will be deleted",
		onConfirm: async () => {
			try {
				if (id) {
					let url = `/api/v1/chat/clear-chat/${id}/`;
					await fetchWithAuth(url, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
					});
					window.location.href = "/messenger";
				}
			} catch (error) {
				return;
			}
		},
		onCancel: () => {
			return;
		},
	});
}

function closeChat(originRooms) {
	let previousSmallWindow = null;
	let rooms = document.getElementById("rooms");
	let chatPanel = document.getElementById("chat-panel");
	function checkWindowSize() {
		const isSmallWindow = window.innerWidth <= 836;

		if (isSmallWindow !== previousSmallWindow) {
			previousSmallWindow = isSmallWindow;
			if (isSmallWindow) {
				rooms.innerHTML = "";
				rooms.innerHTML = originRooms;
				rooms.style.padding = "1rem";
				ChatRoomsPanel();
			} else {
				chatPanel.innerHTML = "";
				chatPanel.innerHTML = `				
				<div id="chat-header" class="chat-header">
					<div class="messenger-title">Messenger</div>
					<div class="messenger-subtitle">
						Send and receive messages without keeping your phone online.
					</div>
					<div class="messenger-subtitle">
						Use Messenger Transcendent on your PC.
					</div>
				</div>`;
			}
		}
	}
	checkWindowSize();
	window.addEventListener("resize", () => {
		setTimeout(checkWindowSize, 100);
	});
}

function deleteChat(selectedChat) {
	showPopup({
		title: "Are you sure you want to delete this Chat?",
		subtitle:
			"This action will permanently remove the chat room and all messages.",
		onConfirm: async () => {
			try {
				if (selectedChat.id) {
					let url = `/api/v1/chat/Delete-chat/${selectedChat.id}/`;
					await fetchWithAuth(url, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
					});
					window.location.href = "/messenger";
				}
			} catch (error) {
				return;
			}
		},
		onCancel: () => {
			return;
		},
	});
}

function blockUnBlockUser(selectedChat, action) {
	let met = action === "block" ? "POST" : "DELETE";
	showPopup({
		title: `Are you sure you want to ${action} this user?`,
		subtitle: action === "block" ? "You will no longer be friends or able to send messages."
			: "You will be able to send messages and be friends again.",
		onConfirm: async () => {
			try {
				if (selectedChat.id) {
					let url = action === "block" ? `/api/v1/users/${action}-user/${selectedChat.receiverUser[0].id}/ ` :
						`/api/v1/users/${action}-user/${selectedChat.receiverUser[0].id}/ `;
					await fetchWithAuth(url, {
						method: met,
						headers: {
							"Content-Type": "application/json",
						},
					});
					window.location.href = "/messenger";
				}
			} catch (error) {
				return;
			}
		},
		onCancel: () => {
			return;
		},
	});
}

import { showPopup } from  '/lib/Confirm.js';
import { fetchWithAuth } from '../../../../lib/apiMock.js';



export function handleThreeDotPanel(threeDots, optionsPanel, selectedChat) {
	const isAdmin = true;

	if (threeDots && optionsPanel) {
		threeDots.addEventListener('click', () => {
			optionsPanel.classList.toggle('hidden');
			if (!optionsPanel.classList.contains('hidden')) {
				optionsPanel.innerHTML = `
                    <div class="panel-options-content">
                        ${selectedChat.type === "private" ? `
                            <button id="clear-chat" class="panel-option-button">Clear Chat</button>
                            <button id="close-chat" class="panel-option-button">Close Chat</button>
                            <button id="delete-chat" class="panel-option-button">Delete Chat</button>
                            <button id="block-user" class="panel-option-button">Block</button>
                        ` : `
                            <button id="group-info" class="panel-option-button">Group Info</button>
                            <button id="exit-group" class="panel-option-button">Exit Group</button>
                            ${isAdmin ? `<button id="delete-group" class="panel-option-button">Delete Group</button>` : ''}
                        `}
                    </div>
                `;

				attachButtonListeners(selectedChat);
			}
		});
	}
}

function attachButtonListeners(selectedChat) {
	const clearChatBtn = document.getElementById("clear-chat");
	if (clearChatBtn) {
		clearChatBtn.addEventListener('click', () => {
			clearChat(selectedChat.id);
		});
	}

	const closeChatBtn = document.getElementById("close-chat");
	if (closeChatBtn) {
		closeChatBtn.addEventListener('click', () => {
			closeChat();
		});
	}

	const deleteChatBtn = document.getElementById("delete-chat");
	if (deleteChatBtn) {
		deleteChatBtn.addEventListener('click', () => {
			deleteChat(selectedChat);
		});
	}

	const blockUserBtn = document.getElementById("block-user");
	if (blockUserBtn) {
		blockUserBtn.addEventListener('click', () => {
			blockUser(selectedChat);
		});
	}

	const groupInfoBtn = document.getElementById("group-info");
	if (groupInfoBtn) {
		groupInfoBtn.addEventListener('click', () => {
			showGroupInfo(selectedChat);
		});
	}

	const exitGroupBtn = document.getElementById("exit-group");
	if (exitGroupBtn) {
		exitGroupBtn.addEventListener('click', () => {
			exitGroup(selectedChat);
		});
	}

	const deleteGroupBtn = document.getElementById("delete-group");
	if (deleteGroupBtn) {
		deleteGroupBtn.addEventListener('click', () => {
			deleteGroup(selectedChat);
		});
	}
}

function clearChat(id) {
	showPopup({
		title: 'Are you sure you want to Clear this Chat?',
		subtitle: 'The room will remain, but all messages will be deleted',
		onConfirm: async () => {
			try {
				if (id) {
					let url = `https://localhost:4433/api/v1/chat/clear-chat/${id}/`
					await fetchWithAuth(url, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
					});
					window.location.href = '/messenger';
				}
			} catch (error) {
				console.error('Error blocking user:', error);
			}
		},
		onCancel: () => {
			console.log('Block action canceled');
		}
	});
}

function closeChat() {
	console.log("Close Chat action");
	const chatPanel = document.getElementById("chat-panel");
	chatPanel.innerHTML = '';
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

function deleteChat(selectedChat) {
	showPopup({
		title: 'Are you sure you want to delete this Chat?',
		subtitle: 'This action will permanently remove the chat room and all messages.',
		onConfirm: async () => {
			try {
				if (selectedChat.id) {
					let url = `https://localhost:4433/api/v1/chat/Delete-chat/${selectedChat.id}/`
					await fetchWithAuth(url, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
					});
					window.location.href = '/messenger';
				}
			} catch (error) {
				console.error('Error blocking user:', error);
			}
		},
		onCancel: () => {
			console.log('Block action canceled');
		}
	});
}

function blockUser(selectedChat) {
	showPopup({
		title: 'Are you sure you want to block this user?',
		subtitle: 'You will no longer be friends or able to send messages.',
		onConfirm: async () => {
			try {
				if (selectedChat.id) {
					let url = `https://localhost:4433/api/v1/users/block-user/${selectedChat.id}/`
					await fetchWithAuth(url, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
					});
					window.location.href = '/messenger';
				}
			} catch (error) {
				console.error('Error blocking user:', error);
			}
		},
		onCancel: () => {
			console.log('Block action canceled');
		}
	});
}


function showGroupInfo(selectedChat) {
	console.log("Show Group Info for group:", selectedChat);
	// Logic to show group info
}

function exitGroup(selectedChat) {
	showPopup({
		title: 'Are you sure you want to leave this Group?',
		subtitle: 'You will no longer be part of the conversation',
		onConfirm: async () => {
			try {
				if (selectedChat.id) {
					// const formData = new FormData();
					// formData.append('user_id', id.toString());
					// let url = `https://localhost:4433/api/v1/users/block-user/${selectedChat.receiverUser[0].id}/`
					// await fetchWithAuth(url, {
					// 	method: 'POST',
					// 	headers: {
					// 		'Content-Type': 'application/json',
					// 	},
					// });
					window.location.href = '/messenger';
				}
			} catch (error) {
				console.error('Error blocking user:', error);
			}
		},
		onCancel: () => {
			console.log('Block action canceled');
		}
	});
}

function deleteGroup(selectedChat) {
	showPopup({
		title: 'Are you sure you want to Delete this Group !',
		subtitle: 'all conversations and data associated with it will be permanently lost !!',
		onConfirm: async () => {
			try {
				// if (selectedChat.id) {
				// 	let url = `https://localhost:4433/api/v1/users/`
				// 	await fetchWithAuth(url, {
				// 		method: 'POST',
				// 		headers: {
				// 			'Content-Type': 'application/json',
				// 		},
				// 	});
				// 	window.location.href = '/messenger';
				// }
			} catch (error) {
				console.error('Error blocking user:', error);
			}
		},
		onCancel: () => {
			console.log('Block action canceled');
		}
	});
}

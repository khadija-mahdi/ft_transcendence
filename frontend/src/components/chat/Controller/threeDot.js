import { showPopup } from  '/lib/Confirm.js';


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
			clearChat();
		});
	}

	// Close Chat button
	const closeChatBtn = document.getElementById("close-chat");
	if (closeChatBtn) {
		closeChatBtn.addEventListener('click', () => {
			closeChat();
		});
	}

	// Delete Chat button
	const deleteChatBtn = document.getElementById("delete-chat");
	if (deleteChatBtn) {
		deleteChatBtn.addEventListener('click', () => {
			deleteChat(selectedChat);
		});
	}

	// Block User button
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

function clearChat() {
	console.log("Clear Chat action");
	// Logic to clear chat
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
	console.log("Delete Chat action for chat:", selectedChat);
	// Logic to delete chat
}

function blockUser(selectedChat) {
	showPopup({
		title: 'Are you sure you want to block this user?',
		subtitle: 'You will no longer be friends or able to send messages.',
		onConfirm: async () => {
			try {
				if (selectedChat && selectedChat.receiverUser && selectedChat.receiverUser[0]) {
					// await BlockUser(parseInt(selectedChat.receiverUser[0].id));
					// Redirect to messenger or update UI as needed
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
	console.log("Exit Group action for group:", selectedChat);
	// Logic to exit group
}

function deleteGroup(selectedChat) {
	console.log("Delete Group action for group:", selectedChat);
	// Logic to delete group
}

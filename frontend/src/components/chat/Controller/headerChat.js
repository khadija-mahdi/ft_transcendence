// Function to render chat room header
export function ChatRoomHeaderUi(selectedChat) {
	return /*html */`
        <div class="panel-container">
            <button class="panel-button">
                <div class="panel-inner-container">
                    <div id="left-arrow-container"></div>
                    <img
                        class="panel-image"
                        src="${selectedChat.room_icon || "/public/assets/images/defualtgroupProfile.png"}"
                        alt="Profile Image"
                    />
                    <a href="/profile" class="panel-link">
                        <div class="panel-room-name">
                            ${selectedChat.room_name}
                        </div>
                        <div class="panel-room-status">
                            ${selectedChat.type === 'private' ? selectedChat.receiverUser && selectedChat.receiverUser[0].status : 'No members'}
                        </div>
                    </a>
                </div>
                <div class="panel-three-points-container">
                    <div class="panel-three-points" id="three-dots">
                        <!-- SVG for three dots -->
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width='20'
                            height='21'
                            fill="none"
                        >
                            <path
                                stroke="#F8F8F8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M12 6.42a.96.96 0 1 0 0-1.92.96.96 0 0 0 0 1.92Zm0 7.04a.96.96 0 1 0 0-1.92.96.96 0 0 0 0 1.92Zm0 7.04a.96.96 0 1 0 0-1.92.96.96 0 0 0 0 1.92Z"
                            />
                        </svg>
                    </div>
                </div>
            </button>
            <!-- Options Panel -->
            <div id="options-panel" class="options-panel hidden">
                <!-- Options content will be inserted here by JavaScript -->
            </div>
            <!-- Messages and Send Message Content -->
            <div id="messages-content" class="messages-content">
                Messages here >>
            </div>
            <div id="send-message" class="send-message">
                SEND MESSAGE
            </div>
        </div>
    `;
}

// Function to handle three-dot panel visibility
function handleThreeDotPanel(threeDots, optionsPanel, selectedChat) {
	const isAdmin = true;
	if (threeDots && optionsPanel) {
		threeDots.addEventListener('click', () => {
			optionsPanel.classList.toggle('hidden');
			if (!optionsPanel.classList.contains('hidden')) {
				optionsPanel.innerHTML = `
                    <div class="panel-options-content">
                        ${selectedChat.type === "private" ? `
                            <button class="panel-option-button" onclick="confirmClear()">Clear Chat</button>
                            <button class="panel-option-button" onclick="router.push('/messenger')">Close Chat</button>
                            <button class="panel-option-button" onclick="confirmDelete()">Delete Chat</button>
                            <button class="panel-option-button" onclick="confirmBlock()">Block</button>
                        ` : `
                            <button class="panel-option-button" onclick="handleGroup(true)">Group info</button>
                            <button class="panel-option-button" onclick="confirmExitGroup()">Exit Group</button>
                            ${isAdmin ? `<button class="panel-option-button" onclick="DeleteGroup()">Delete Group</button>` : ''}
                        `}
                    </div>
                `;
			}
		});
	}
}


var messages =  [
	{
		"id": 1,
		"room_id": 2,
		"sender_username": "ayoub",
		"type": "text",
		"message": "hello",
		"image_file": null,
		"seen": true,
		"seen_at": null,
		"created_at": "2024-08-28T09:02:25.912355Z",
		"sender": {
			"id": 1,
			"image_url": "https://localhost:4433/media/public/profile-images/00_img.jpg",
			"fullname": "",
			"username": "ayoub",
			"status": "offline",
			"url": "https://localhost:4433/api/v1/users/1/"
		}
	},
	{
		"id": 2,
		"room_id": 2,
		"sender_username": "me",
		"type": "text",
		"message": "hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh",
		"image_file": null,
		"seen": false,
		"seen_at": null,
		"created_at": "2024-08-28T11:52:45.339557Z",
		"sender": {
			"id": 4,
			"image_url": "https://localhost:4433/media/public/profile-images/00_img.jpg",
			"fullname": "",
			"username": "khadija",
			"status": "offline",
			"url": "https://localhost:4433/api/v1/users/4/"
		}
	}
]

// Function to render chat messages and update the UI
export async function renderMessagesItems(selectedChat) {
	const chatPanel = document.getElementById("chat-panel");
	chatPanel.innerHTML = '';

	const chatHeader = ChatRoomHeaderUi(selectedChat);
	chatPanel.innerHTML = chatHeader;

	const threeDots = document.getElementById("three-dots");
	const optionsPanel = document.getElementById("options-panel");
	handleThreeDotPanel(threeDots, optionsPanel, selectedChat);

	// Assuming messages is a property of selectedChat
	const messagesContent = document.getElementById("messages-content");
	if (messagesContent) {
		messagesContent.innerHTML = messages.map((message, index) => `
            <div class="message ${message.sender_username === 'me' ? 'sent' : 'received'}">
                <div class="message-content">${message.message}</div>
                <div class="message-time ${message.sender_username === 'me' ? 'sent' : ''}">${new Date(message.created_at).toLocaleTimeString()}</div>
            </div>
        `).join('');
	}
}

// Function to render chat room header

import { fetchWithAuth } from '../../../../lib/apiMock.js';

async function fetchMessages(id) {
	let apiUrl = `https://localhost:4433/api/v1/chat/room/${id}`

	try {
		const response = await fetchWithAuth(apiUrl, {
			method: 'GET',
		});
		return response.results;
	} catch (error) {
		console.error("Error fetching user data:", error);
		return [];
	}
}

export function ChatRoomHeaderUi(selectedChat, isFriend) {
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
			<div class="send-message-container">
			${isFriend || selectedChat.type !== 'private' ? `
				<div class="send-message-content">
					${selectedChat.type === 'private' ? `
						<div class="invite-icon-container">
							<a href="/match-making?player=${selectedChat.receiverUser && selectedChat.receiverUser[0].username || 0}">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width='24'
									height='24'
									fill="none"
								>
									<path
									fill="#878787"
									d="M8.253 4.5a6.75 6.75 0 0 0 0 13.5h7.512a6.75 6.75 0 0 0 0-13.5H8.253Zm-2.997 6.75a.75.75 0 0 1 .75-.75h1.5V9a.75.75 0 0 1 1.5 0v1.5h1.5a.75.75 0 1 1 0 1.5h-1.5v1.5a.75.75 0 1 1-1.5 0V12h-1.5a.75.75 0 0 1-.75-.75ZM16.5 13.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0-3a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z"
									/>
								</svg>
							</a>
							<div class="invite-text">Invite</div>
						</div>
					` : ''}
					<div class="send-image-container">
						<!-- Your SendImage component logic goes here -->
					</div>
					<textarea
						class="message-textarea"
						placeholder="Type a message"
						maxLength="1000"
						onClick="setIsEditing(true)"
						onKeyPress="handleTextareaKeyPress(event, null)"
					></textarea>
					<button class="send-button" onClick="handleSendMessage(event, null)">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width='30'
								height='30'
								fill="none"
							>
								<path
									fill="#878787"
									d="m27.925 13.304-.01-.004L2.893 2.92a1.38 1.38 0 0 0-1.302.127 1.444 1.444 0 0 0-.653 1.206v6.638a1.406 1.406 0 0 0 1.144 1.382l13.649 2.523a.234.234 0 0 1 0 .46L2.082 17.78a1.406 1.406 0 0 0-1.144 1.38v6.64a1.38 1.38 0 0 0 .62 1.153 1.402 1.402 0 0 0 1.332.121l25.024-10.32.011-.005a1.875 1.875 0 0 0 0-3.445Z"
								/>
						</svg>
					</button>
				</div>
			` : `
				${selectedChat.type === 'private' ? `
					<div class="no-friend-message">
						You can't send a message to a user that you are not friends with
					</div>
				` : ''}
			`}
		</div>
            </div>
        </div>
    `;
}

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


export async function renderMessagesItems(selectedChat) {
	const chatPanel = document.getElementById("chat-panel");
	chatPanel.innerHTML = '';
	const isFriend = true;
	let messages = await fetchMessages(selectedChat.id);

	const chatHeader = ChatRoomHeaderUi(selectedChat, isFriend);
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

function setIsEditing(isEditing) {
}

function handleTextareaKeyPress(e, additionalParam) {
	if (e.key === 'Enter') {
		e.preventDefault();
		handleSendMessage(e, additionalParam);
	}
}

function handleSendMessage(e, additionalParam) {
}

function SendImage({ onImageUpload, onImageConfirm }) {

}

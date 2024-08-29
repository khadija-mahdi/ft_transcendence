import { fetchWithAuth } from '../../../../lib/apiMock.js';
import AuthWebSocket from '../../../lib/authwebsocket.js';
import { fetchMyData } from '/_api/user.js'
import { handleThreeDotPanel } from './threeDot.js';
const myData = await fetchMyData();


async function fetchMessages(id) {
	if (id) {
		let apiUrl = `https://localhost:4433/api/v1/chat/room/${id}`;
		let allMessages = [];

		try {
			while (apiUrl) {
				const response = await fetchWithAuth(apiUrl, {
					method: 'GET',
				});

				// Add the current page of messages to the allMessages array
				allMessages = allMessages.concat(response.results);

				// Update the apiUrl to the next page's URL
				apiUrl = response.next;
			}

			return allMessages;
		} catch (error) {
			console.error("Error fetching messages:", error);
			return [];
		}
	}
}


export function ChatRoomHeaderUi(selectedChat, isFriend) {
	return /*html*/ `
	<div class="panel-container">
		<!-- Header content -->
		<button class="panel-button">
			<div class="panel-inner-container">
				<div id="left-arrow-container"></div>
				<img
					class="panel-image"
					src="${selectedChat.room_icon || " /public/assets/images/defaultGroupProfile.png"}"
				alt="Profile Image"
                    />
				<a href='/profile?username=${selectedChat.room_name}' class="panel-link">
					<div class="panel-room-name">${selectedChat.room_name}</div>
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
		<div id="messages-content" class="messages-content"></div>
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
							<div class="send-image-container" id="send-image-container">
								<!-- Image upload UI will be rendered here -->
							</div>
                            <textarea
                                class="message-textarea"
                                placeholder="Type a message"
                                maxLength="1000"
                            ></textarea>
                            <button class="send-button">
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



// WebSocket handling
let socket = null;
let selectedImage = null;

function handleWebSocket(selectedChat) {
	console.log("my data", myData);
	if (selectedChat.id) {
		console.log("Creating new WebSocket connection", selectedChat.id);
		socket = new AuthWebSocket(`wss://localhost:4433/ws/chat/${selectedChat.id}/`);

		socket.onerror = (err) => {
			console.error("WebSocket error:", err);
		};

		socket.onmessage = (event) => {
			const receivedMessage = JSON.parse(event.data);
			console.log('New message:', receivedMessage);

			const newMessage = {
				message: receivedMessage.message.message,
				image_file: receivedMessage.message.image,
				seen: false,
				created_at: new Date(receivedMessage.message.created_at).toLocaleTimeString(),
				id: receivedMessage.message.id || 0,
				sender_username: receivedMessage.message.sender_username,
				type: receivedMessage.message.message ? 'text' : 'image'
			};

			appendMessageToUI(newMessage);
		};

	}
}

function appendMessageToUI(message) {
	const messagesContent = document.getElementById("messages-content");

	if (messagesContent) {
		const messageElement = document.createElement('div');
		messageElement.classList.add('message');
		messageElement.classList.add(message.sender_username === myData.username ? 'sent' : 'received');

		messageElement.innerHTML = `
            <div class="message-content">${message.message}</div>
            <div class="message-time ${message.sender_username === myData.username ? 'sent' : ''}">
                ${new Date(message.created_at).toLocaleTimeString()}
            </div>
        `;

		messagesContent.appendChild(messageElement);

		messagesContent.scrollTop = messagesContent.scrollHeight;
	}
}


async function sendMessage(content, selectedChat, imageFile = null) {
	console.log("Sending message:", content, imageFile);

	let imageBase64 = null;
	if (imageFile) {
		imageBase64 = await new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onloadend = () => {
				const base64data = reader.result?.split(',')[1];
				base64data ? resolve(base64data) : reject(new Error('Failed to read image file.'));
			};
			reader.onerror = reject;
			reader.readAsDataURL(imageFile);
		});
	}

	try {
		const payload = {
			id: selectedChat.id,
			message: content,
			image_file: imageBase64 ? `data:${imageFile?.type};base64,${imageBase64}` : null,
			seen: false,
			sender_username: myData.username,
			type: imageFile ? 'image' : 'text',
			room_id: selectedChat.id,
			created_at: new Date().toISOString()
		};

		// Append the message to the UI immediately
		const messagesContent = document.getElementById("messages-content");
		if (messagesContent) {
			const messageElement = document.createElement('div');
			messageElement.className = 'message sent';
			messageElement.innerHTML = `
                <div class="message-content">${payload.message}</div>
                <div class="message-time">${new Date(payload.created_at).toLocaleTimeString()}</div>
            `;
			messagesContent.appendChild(messageElement);
			messagesContent.scrollTop = messagesContent.scrollHeight;  // Auto-scroll to the latest message
		}

		socket.send(JSON.stringify(payload));
	} catch (error) {
		console.error("Error sending message:", error);
	}
}

function handleImageConfirm(file) {
	selectedImage = file;
	sendMessage('', selectedChat, file);
}

function handleTextareaKeyPress(event, selectedChat) {
	if (event.key === 'Enter' && !event.shiftKey) {
		event.preventDefault();
		const message = event.target.value.trim();
		if (message) {
			sendMessage(message, selectedChat);
			event.target.value = '';
		}
	}
}

function handleSendMessage(event, selectedChat) {
	event.preventDefault();
	const textarea = document.querySelector('.message-textarea');
	const message = textarea.value.trim();
	if (message) {
		sendMessage(message, selectedChat);
		textarea.value = '';
	}
} []

function initializeSendImage() {
	const sendImageContainer = document.getElementById('send-image-container');

	let selectedImage = null;
	let file = null;
	let error = false;

	const renderUploadUI = () => {
		sendImageContainer.innerHTML = selectedImage
			? `
                <label class="upload-label">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width='24'
					height='24'
					fill="none"
				>
					<path
						fill='#3342ff'
						fillRule="evenodd"
						d="M12 1.25a.75.75 0 0 1 .57.262l3 3.5a.75.75 0 0 1-1.14.976l-1.68-1.96V15a.75.75 0 1 1-1.5 0V4.027L9.57 5.988a.75.75 0 0 1-1.14-.976l3-3.5A.75.75 0 0 1 12 1.25ZM6.996 8.252a.75.75 0 0 1 .008 1.5c-1.093.006-1.868.034-2.457.142-.566.105-.895.272-1.138.515-.277.277-.457.666-.556 1.4-.101.755-.103 1.756-.103 3.191v1c0 1.436.002 2.437.103 3.192.099.734.28 1.122.556 1.4.277.276.665.456 1.4.555.754.102 1.756.103 3.191.103h8c1.435 0 2.436-.001 3.192-.103.734-.099 1.122-.279 1.399-.556.277-.277.457-.665.556-1.399.101-.755.103-1.756.103-3.192v-1c0-1.435-.002-2.436-.103-3.192-.099-.733-.28-1.122-.556-1.399-.244-.243-.572-.41-1.138-.515-.589-.108-1.364-.136-2.457-.142a.75.75 0 0 1 .008-1.5c1.082.006 1.983.032 2.72.167.758.14 1.403.405 1.928.93.602.601.86 1.36.982 2.26.116.866.116 1.969.116 3.336v1.11c0 1.368 0 2.47-.116 3.337-.122.9-.38 1.658-.982 2.26-.602.602-1.36.86-2.26.982-.867.116-1.97.116-3.337.116h-8.11c-1.367 0-2.47 0-3.337-.116-.9-.121-1.658-.38-2.26-.982-.602-.602-.86-1.36-.981-2.26-.117-.867-.117-1.97-.117-3.337v-1.11c0-1.367 0-2.47.117-3.337.12-.9.38-1.658.981-2.26.525-.524 1.17-.79 1.928-.929.737-.135 1.638-.161 2.72-.167Z"
						clipRule="evenodd"
					/>
				</svg> 
                <div class="invite-text" style="color: #3342ff">Uploaded</div>
            `
			: `
                <label class="upload-label">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width='24'
					height='24'
					fill="none"
				>
					<path
						fill='#878787'
						fillRule="evenodd"
						d="M12 1.25a.75.75 0 0 1 .57.262l3 3.5a.75.75 0 0 1-1.14.976l-1.68-1.96V15a.75.75 0 1 1-1.5 0V4.027L9.57 5.988a.75.75 0 0 1-1.14-.976l3-3.5A.75.75 0 0 1 12 1.25ZM6.996 8.252a.75.75 0 0 1 .008 1.5c-1.093.006-1.868.034-2.457.142-.566.105-.895.272-1.138.515-.277.277-.457.666-.556 1.4-.101.755-.103 1.756-.103 3.191v1c0 1.436.002 2.437.103 3.192.099.734.28 1.122.556 1.4.277.276.665.456 1.4.555.754.102 1.756.103 3.191.103h8c1.435 0 2.436-.001 3.192-.103.734-.099 1.122-.279 1.399-.556.277-.277.457-.665.556-1.399.101-.755.103-1.756.103-3.192v-1c0-1.435-.002-2.436-.103-3.192-.099-.733-.28-1.122-.556-1.399-.244-.243-.572-.41-1.138-.515-.589-.108-1.364-.136-2.457-.142a.75.75 0 0 1 .008-1.5c1.082.006 1.983.032 2.72.167.758.14 1.403.405 1.928.93.602.601.86 1.36.982 2.26.116.866.116 1.969.116 3.336v1.11c0 1.368 0 2.47-.116 3.337-.122.9-.38 1.658-.982 2.26-.602.602-1.36.86-2.26.982-.867.116-1.97.116-3.337.116h-8.11c-1.367 0-2.47 0-3.337-.116-.9-.121-1.658-.38-2.26-.982-.602-.602-.86-1.36-.981-2.26-.117-.867-.117-1.97-.117-3.337v-1.11c0-1.367 0-2.47.117-3.337.12-.9.38-1.658.981-2.26.525-.524 1.17-.79 1.928-.929.737-.135 1.638-.161 2.72-.167Z"
						clipRule="evenodd"
					/>
				</svg> 
                <div class="invite-text">Upload</div>
				<input class="hidden" type="file" id="image-upload" accept="image/png, image/jpeg" />
                </label>
            `;

		document.getElementById('image-upload')?.addEventListener('change', handleImageUpload);
		document.getElementById('remove-image')?.addEventListener('click', removeImage);
		document.getElementById('confirm-image')?.addEventListener('click', confirmImage);
	};

	const handleImageUpload = (e) => {
		file = e.target.files[0];
		if (file) {
			if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
				error = true;
			} else {
				error = false;
				selectedImage = URL.createObjectURL(file);
			}
			renderUploadUI();
		}
	};

	const removeImage = () => {
		selectedImage = null;
		file = null;
		renderUploadUI();
	};

	const confirmImage = () => {
		if (file && !error) {
			// Handle image confirmation logic here
			console.log('Image confirmed:', file);
		}
		removeImage();
	};

	renderUploadUI();
}


// Function to render messages and initialize WebSocket
export async function renderMessagesItems(selectedChat) {
	console.log("Selected chat:", selectedChat);
	const chatPanel = document.getElementById("chat-panel");
	chatPanel.innerHTML = '';

	const isFriend = true;
	let messages = await fetchMessages(selectedChat.id);

	const chatHeader = ChatRoomHeaderUi(selectedChat, isFriend);
	chatPanel.innerHTML = chatHeader;

	const threeDots = document.getElementById("three-dots");
	const optionsPanel = document.getElementById("options-panel");
	handleThreeDotPanel(threeDots, optionsPanel, selectedChat);


	const messagesContent = document.getElementById("messages-content");
	if (messagesContent && messages) {
		messagesContent.innerHTML = messages.map((message) => `
            <div class="message ${message.sender_username === myData.username ? 'sent' : 'received'}">
                <div class="message-content">${message.message}</div>
                <div class="message-time ${message.sender_username === 'me' ? 'sent' : ''}">
                    ${new Date(message.created_at).toLocaleTimeString()}
                </div>
            </div>
        `).join('');

	}
	console.log('messages:', messages)
	messagesContent.scrollTop = messagesContent.scrollHeight;

	// Initialize WebSocket
	handleWebSocket(selectedChat);
	initializeSendImage();
	// Bind send button click event
	const sendButton = document.querySelector('.send-button');
	if (sendButton) {
		sendButton.addEventListener('click', (event) => handleSendMessage(event, selectedChat));
	}

	// Bind textarea enter keypress event
	const textarea = document.querySelector('.message-textarea');
	if (textarea) {
		textarea.addEventListener('keypress', (event) => handleTextareaKeyPress(event, selectedChat));
	}
}
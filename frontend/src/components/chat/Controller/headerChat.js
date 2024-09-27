import { fetchWithAuth } from "/src/lib/apiMock.js";
import AuthWebSocket from "/src/lib/authwebsocket.js";
import { handleThreeDotPanel } from "./threeDot.js";
import { ChatRoomsPanel } from "./chat.js";
import { fetchMyData, fetchMyFriends } from "/src/_api/user.js";
import { InvitePlayer } from "/src/_api/user.js";

const html = String.raw;

const myData = await fetchMyData();
let selectedImage = null;
let apiUrl = null;
let isLoading = false;
let socket = null;

export function showSendImagePopup({ imageSrc, onConfirm, onCancel, error }) {
  const popupContainer = document.getElementById("popup-sendImage-container");
  const popupPreview = document.getElementById("popup-sendImage-preview");
  const popupError = document.getElementById("popup-sendImage-error");
  const popupConfirm = document.getElementById("popup-sendImage-confirm");
  const popupCancel = document.getElementById("popup-sendImage-cancel");
  const popupClose = document.getElementById("popup-sendImage-close");

  if (error) {
    popupPreview.classList.add("hidden");
    popupError.classList.remove("hidden");
  } else {
    popupPreview.src = imageSrc;
    popupPreview.classList.remove("hidden");
    popupError.classList.add("hidden");
  }

  popupContainer.classList.remove("hidden");

  popupConfirm.onclick = () => {
    if (onConfirm) onConfirm();
    hideSendImagePopup();
  };

  popupCancel.onclick = () => {
    if (onCancel) onCancel();
    hideSendImagePopup();
  };

  popupClose.onclick = () => {
    if (onCancel) onCancel();
    hideSendImagePopup();
  };
}

export function hideSendImagePopup() {
  const popupContainer = document.getElementById("popup-sendImage-container");
  popupContainer.classList.add("hidden");
}

async function fetchMessages(id, isScroll) {
  if (!isScroll) apiUrl = `/api/v1/chat/room/${id}`;
  try {
    const response = await fetchWithAuth(apiUrl, { method: "GET" });
    if (response.results.length) {
      apiUrl = response.next;
    }
    appendMessages(response.results);
  } catch (error) {
    console.error("Error fetching messages:", error);
  }

  isLoading = false;
}

function appendMessages(messages) {
  messages.forEach((message) => {
    appendMessageToUI(message, true);
  });
}

export function ChatRoomHeaderUi(selectedChat, isFriend) {
  return html`
    <div class="panel-container">
      <button class="panel-button">
        <div class="panel-inner-container">
          <div id="left-arrow-container" class="hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
            >
              <path
                stroke="white"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M15 18.595l-7-7 7-7"
              />
            </svg>
          </div>
          <img
            class="panel-image"
            src="${selectedChat.room_icon}"
            onerror="this.src='/public/assets/images/defaultImageProfile.jpeg';"
            alt="Profile Image"
          />
          <a
            href="/profile?username=${selectedChat.room_name}"
            class="panel-link"
          >
            <div class="panel-room-name">${selectedChat.room_name}</div>
            <div class="panel-room-status">
              ${selectedChat.type === "private"
                ? selectedChat.receiverUser &&
                  selectedChat.receiverUser[0]?.status
                : "No members"}
            </div>
          </a>
        </div>
        <div class="panel-three-points-container">
          <div class="panel-three-points" id="three-dots">
            <!-- SVG for three dots -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="21"
              fill="none"
            >
              <path
                stroke="#F8F8F8"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="{1.5}"
                d="M12 6.42a.96.96 0 1 0 0-1.92.96.96 0 0 0 0 1.92Zm0 7.04a.96.96 0 1 0 0-1.92.96.96 0 0 0 0 1.92Zm0 7.04a.96.96 0 1 0 0-1.92.96.96 0 0 0 0 1.92Z"
              />
            </svg>
          </div>
        </div>
      </button>
      <div id="options-panel" class="options-panel hidden"></div>
      <div id="messages-content" class="messages-content"></div>
      <div id="send-message" class="send-message">
        <div class="send-message-container">
          ${isFriend || selectedChat.type !== "private"
            ? `
                        <div class="send-message-content">
                            ${
                              selectedChat.type === "private"
                                ? `
                                <div  id="invite-chat" class="invite-icon-container">
                                    <div>
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
                                    </div>
                                    <div class="invite-text">Invite</div>
                                </div>
                            `
                                : ""
                            }
					
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
                    `
            : `
                        ${
                          selectedChat.type === "private"
                            ? `
                            <div class="no-friend-message">
                                You can't send a message to a user that you are not friends with
                            </div>
                        `
                            : ""
                        }
                    `}
        </div>
      </div>
    </div>
  `;
}

function handleWebSocket(selectedChat) {
  if (socket) {
    socket.close();
  }
  try {
    if (selectedChat.id) {
      socket = new AuthWebSocket(`/ws/chat/${selectedChat.id}/`);
      socket.onerror = (error) => {
        return;
      };
      socket.onmessage = (event) => {
        const receivedMessage = JSON.parse(event.data);

        if (!receivedMessage.message) return;
        const newMessage = {
          message: receivedMessage.message.message,
          image_file: receivedMessage.message.image,
          seen: false,
          created_at: new Date().toISOString(),
          id: receivedMessage.message.id || 0,
          sender_username: receivedMessage.message.sender_username,
          type: receivedMessage.message.message ? "text" : "image",
        };
        appendMessageToUI(newMessage);
      };
    }
  } catch (error) {
    return;
  }
}

function appendMessageToUI(message, prepend = false) {
  const messagesContent = document.getElementById("messages-content");
  if (messagesContent) {
    const messageElement = document.createElement("div");
    message.message
      ? messageElement.classList.add("message")
      : messageElement.classList.add("image-file-content");
    messageElement.classList.add(
      message.sender_username === myData.username ? "sent" : "received"
    );

    if (message.image_file) {
      messageElement.innerHTML = html`
        <div
          class="image_file ${message.sender_username === myData.username
            ? "sent"
            : "received"}"
        >
          <img
            class="image_file-content"
            src="${message.image_file}"
            onerror="this.src='/public/assets/images/defaultImageProfile.jpeg';"
            alt="image message"
          />
        </div>
      `;
    } else {
      messageElement.innerHTML = `
				<div class="message-content">${message.message}</div>
				<div class="message-time ${
          message.sender_username === myData.username ? "sent" : ""
        }">
					${new Date(message.created_at).toLocaleTimeString()}
				</div>
			`;
    }
    if (prepend) {
      messagesContent.insertBefore(messageElement, messagesContent.firstChild); // Prepend message
    } else {
      messagesContent.appendChild(messageElement);
    }
    messagesContent.scrollTop = messagesContent.scrollHeight;
    messagesContent.scrollTo({
      top: messagesContent.scrollHeight,
      behavior: "smooth",
    });
  }
}

async function sendMessage(content, selectedChat, imageFile = null) {
  let imageBase64 = null;
  if (imageFile) {
    imageBase64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result?.split(",")[1];
        base64data
          ? resolve(base64data)
          : reject(new Error("Failed to read image file."));
      };
      reader.onerror = reject;
      reader.readAsDataURL(imageFile);
    });
  }

  try {
    const payload = {
      id: selectedChat.id,
      message: content,
      image_file: imageBase64
        ? `data:${imageFile?.type};base64,${imageBase64}`
        : null,
      seen: false,
      sender_username: myData.username,
      type: imageFile ? "image" : "text",
      room_id: selectedChat.id,
      created_at: new Date().toISOString(),
    };
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(payload));
      appendMessageToUI(payload);
    } else {
      return;
    }
  } catch (error) {
    return;
  }
}

function handleImageConfirm(file, selectedChat) {
  selectedImage = file;
  sendMessage("", selectedChat, selectedImage);
}

function handleTextareaKeyPress(event, selectedChat) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    const message = event.target.value.trim();
    if (message) {
      sendMessage(message, selectedChat);
      event.target.value = "";
    }
  }
}

function handleSendMessage(event, selectedChat) {
  event.preventDefault();
  const textarea = document.querySelector(".message-textarea");
  const message = textarea.value.trim();
  if (message) {
    sendMessage(message, selectedChat);
    textarea.value = "";
  }
}
[];

function initializeSendImage(selectedChat) {
  const sendImageContainer = document.getElementById("send-image-container");
  if (!sendImageContainer) return;

  let file = null;
  let TypeError = false;

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

    document
      .getElementById("image-upload")
      ?.addEventListener("change", handleImageUpload);
    document
      .getElementById("remove-image")
      ?.addEventListener("click", removeImage);
    document
      .getElementById("confirm-image")
      ?.addEventListener("click", confirmImage);
  };

  const handleImageUpload = (e) => {
    file = e.target.files[0];
    if (file) {
      if (file.type !== "image/png" && file.type !== "image/jpeg") {
        TypeError = true;
      } else {
        TypeError = false;
        selectedImage = URL.createObjectURL(file);
      }
      renderUploadUI();
      showSendImagePopup({
        imageSrc: selectedImage,
        onConfirm: async () => {
          try {
            handleImageConfirm(file, selectedChat);
            removeImage();
          } catch (error) {
            removeImage();
            return;
          }
        },
        onCancel: () => {
          removeImage();
        },
        error: TypeError,
      });
    }
  };

  const removeImage = () => {
    selectedImage = null;
    file = null;
    renderUploadUI();
  };

  const confirmImage = () => {
    if (file && !error) {
      handleImageConfirm(file);
    }
    removeImage();
  };

  renderUploadUI();
}

async function handleChatContent(selectedChat, originRooms) {
  const threeDots = document.getElementById("three-dots");
  const optionsPanel = document.getElementById("options-panel");
  handleThreeDotPanel(threeDots, optionsPanel, selectedChat, originRooms);

  await fetchMessages(selectedChat.id, false);
  handleWebSocket(selectedChat);
  initializeSendImage(selectedChat);

  const sendButton = document.querySelector(".send-button");
  if (sendButton) {
    sendButton.addEventListener("click", (event) =>
      handleSendMessage(event, selectedChat)
    );
  }
  const chatWindow = document.getElementById("messages-content");

  chatWindow.addEventListener("scroll", () => {
    if (chatWindow.scrollTop === 0 && apiUrl) {
      fetchMessages(selectedChat.id, true);
    }
  });
  const inviteBtn = document.getElementById("invite-chat");
  inviteBtn?.addEventListener("click", async () => {
    let id =
      selectedChat && selectedChat.receiverUser
        ? selectedChat.receiverUser[0].id
        : 0;
    const res = await InvitePlayer(id);
    window.location.href = `/game/match_making?player=${selectedChat.room_name}&invite-uuid=${res.invite_id}`;
  });
  const textarea = document.querySelector(".message-textarea");
  if (textarea) {
    textarea.addEventListener("keypress", (event) =>
      handleTextareaKeyPress(event, selectedChat)
    );
  }
}

export async function renderMessagesItems(selectedChat) {
  if (!selectedChat.room_name) window.location.href = "/home";
  let previousSmallWindow = null;
  let chatPanel = "";
  let rooms = document.getElementById("rooms");
  const originRooms = rooms.innerHTML;
  const friends = await fetchMyFriends();

  const isFriend = friends.some(
    (friend) => friend.username === selectedChat.room_name
  );

  function checkWindowSize() {
    const isSmallWindow = window.innerWidth <= 836;

    if (isSmallWindow !== previousSmallWindow) {
      previousSmallWindow = isSmallWindow;

      if (isSmallWindow) {
        rooms.innerHTML = "";
        rooms.style.padding = "0";
        chatPanel = rooms;
        chatPanel.innerHTML = "";
        chatPanel.innerHTML = ChatRoomHeaderUi(selectedChat, isFriend);
        let returnArrow = document.getElementById("left-arrow-container");
        if (returnArrow) {
          returnArrow.style.display = "block";
          returnArrow.addEventListener("click", () => {
            rooms.innerHTML = originRooms;
            rooms.style.padding = "1rem";
            ChatRoomsPanel();
          });
        }
        handleChatContent(selectedChat, originRooms);
      } else {
        rooms.innerHTML = originRooms;
        rooms.style.padding = "1rem";
        ChatRoomsPanel();
        chatPanel = document.getElementById("chat-panel");
        chatPanel.innerHTML = "";
        chatPanel.innerHTML = ChatRoomHeaderUi(selectedChat, isFriend);
        handleChatContent(selectedChat, originRooms);
      }
    }
  }

  checkWindowSize();
  window.addEventListener("resize", () => {
    setTimeout(checkWindowSize, 100);
  });
}

import { fetchWithAuth } from '../../../../lib/apiMock.js'
import { userContext } from '../../userContext.js';
import { MembersContainer } from '../../../chat/choice_members/Controller/choice_members.js';
import { fetchMyData } from '/_api/user.js'
export default function () {
	const form = document.getElementById('create-group-form');
	let imageInput = document.getElementById('imageInput');
	const imageLabel = document.getElementById('imageLabel');
	const errorElement = document.getElementById('error');
	const group_members = document.getElementById('added-group-members');

	let selectedImage = userContext.getGroupImage();

	const initialImageLabelContent = imageLabel.innerHTML;

	function displayImage(image) {
		imageLabel.innerHTML = '';

		const imageContainer = document.createElement('div');
		imageContainer.className = 'image-preview-container';

		const imgElement = document.createElement('img');
		imgElement.src = image;
		imgElement.alt = 'Selected';
		imgElement.className = 'image-preview';

		const closeButton = document.createElement('div');
		closeButton.className = 'close-button';
		closeButton.innerHTML = '<img src="/public/assets/icons/light_close.png" alt="close-icon" class="close-icon">';

		closeButton.addEventListener('click', () => {
			selectedImage = null;
			userContext.RemoveGroupImage();
			imageLabel.innerHTML = initialImageLabelContent;
			reattachImageInputChange();

		});

		imageContainer.appendChild(imgElement);
		imageContainer.appendChild(closeButton);
		imageLabel.appendChild(imageContainer);
		imageLabel.style.color = 'transparent';
	}

	function handleImageInputChange(e) {
		const file = e.target.files[0];
		if (!file) return;

		userContext.setGroupImage(file);
		const reader = new FileReader();
		reader.onload = (event) => {
			displayImage(event.target.result);
		};
		reader.readAsDataURL(file);
	}

	function reattachImageInputChange() {
		if (selectedImage) {
			displayImage(selectedImage);
		} else {

			imageInput = document.getElementById('imageInput');
			imageInput.addEventListener('change', handleImageInputChange);
		}
	}

	reattachImageInputChange();
	userContext.subscribe(() => {
		const users = userContext.getUsers();
		renderMembersList(users);
	});

	const initialUsers = userContext.getUsers();
	renderMembersList(initialUsers)

	function renderMembersList(friends) {
		group_members.innerHTML = '';
		friends.forEach(friend => {
			const friendComponent = MembersContainer({
				id: friend.id,
				name: friend.username,
				href: friend.image_url,
				number: friend.level,
				user: friend,
			});
			const friendWrapper = document.createElement('div');
			friendWrapper.className = 'friend-wrapper';
			friendWrapper.appendChild(friendComponent);
			group_members.appendChild(friendWrapper);
		});

	}

	form.addEventListener('submit', async (e) => {
		e.preventDefault(); // Prevent form submission and page reload

		let groupName = document.getElementById('group-name').value;

		const user = await fetchMyData('me');
		const users = userContext.getUsers();
		if (!users.some(u => u.id === user.id)) {
			userContext.addUser(user);
		}

		// Build the JSON object
		const data = {
			name: groupName,
			type: "group",
			icon: selectedImage,
			input_members: users.map(user => user.id.toString())
		};

		try {
			const res = await fetchWithAuth('https://localhost:4433/api/v1/chat/rooms/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});

			if (!res.ok) {
				throw new Error('Failed to create the Group Chat');
			}

			window.location.href = '/messages/';
		} catch (error) {
			errorElement.textContent = 'An error occurred while creating the Group Chat.';
			errorElement.style.color = 'red';
		}
	});



}
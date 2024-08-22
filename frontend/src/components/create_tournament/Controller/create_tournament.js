import { fetchWithAuth } from '../../../../lib/apiMock.js'

export default function () {
	const form = document.getElementById('createTournamentForm');
	let imageInput = document.getElementById('imageInput');
	const imageLabel = document.getElementById('imageLabel');
	const errorElement = document.getElementById('error');
	const tr_errorElement = document.getElementById('rt-error');

	let selectedImage = null;

	// Store the initial content of the image label
	const initialImageLabelContent = imageLabel.innerHTML;

	function handleImageInputChange(e) {
		imageLabel.innerHTML = '';
		const file = e.target.files[0];
		if (!file) return;

		selectedImage = file;
		console.log('Selected image: ', selectedImage);

		const reader = new FileReader();
		reader.onload = (event) => {
			const imageContainer = document.createElement('div');
			imageContainer.className = 'image-preview-container';

			const imgElement = document.createElement('img');
			imgElement.src = event.target.result;
			imgElement.alt = 'Selected';
			imgElement.className = 'image-preview';

			const closeButton = document.createElement('div');
			closeButton.className = 'close-button';
			closeButton.innerHTML = '<img src="/public/assets/icons/light_close.png" alt="close-icon" class="close-icon">';

			closeButton.addEventListener('click', () => {
				selectedImage = null;
				imageLabel.innerHTML = initialImageLabelContent;
				reattachImageInputChange();
			});

			imageContainer.appendChild(imgElement);
			imageContainer.appendChild(closeButton);
			imageLabel.appendChild(imageContainer);
			imageLabel.style.color = 'transparent';
		};
		reader.readAsDataURL(file);
	}

	function reattachImageInputChange() {
		imageInput = document.getElementById('imageInput');
		imageInput.addEventListener('change', handleImageInputChange);
	}

	reattachImageInputChange();

	form.addEventListener('submit', async (e) => {
		e.preventDefault();
		const name = document.getElementById('name').value;
		const description = document.getElementById('description').value;
		const maxPlayers = document.getElementById('maxPlayers').value;
		const startDate = document.getElementById('startDate').value;
		const isPublic = document.getElementById('isPublic').checked;
		const isMonetized = document.getElementById('isMonetized').checked;
		const inputTime = new Date(startDate);
		const currentTime = new Date();

		if (inputTime <= currentTime) {
			errorElement.textContent = 'Please select a time in the future.';
			errorElement.style.color = 'red';
			return;
		} else {
			errorElement.textContent = '';
		}

		const formData = new FormData();
		formData.append('name', name);
		formData.append('description', description);
		formData.append('start_date', startDate);
		formData.append('max_players', maxPlayers);
		formData.append('is_public', isPublic);
		formData.append('is_monetized', isMonetized);

		if (selectedImage) {
			formData.append('icon_file', selectedImage);
		}

		try {
			const res = await fetchWithAuth('https://localhost:4433/api/v1/game/Tournament/', {
				method: 'POST',
				headers: {
					'Content-Type': 'multipart/form-data'
				},
				body: formData,
			});
			console.log(res);
			if (!res.ok) {
				throw new Error('Failed to create the tournament');
			}
			window.location.href = '/home';
		} catch (error) {
			console.error(error);
			errorElement.textContent = 'An error occurred while creating the tournament.';
			errorElement.style.color = 'red';
		}
	});
}

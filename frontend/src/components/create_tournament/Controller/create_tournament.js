export default function () {
	document.addEventListener('DOMContentLoaded', () => {
		const form = document.getElementById('createTournamentForm');
		const imageInput = document.getElementById('imageInput');
		const imageLabel = document.getElementById('imageLabel');
		const errorElement = document.getElementById('error');
		
		let selectedImage = null;
	
		imageInput.addEventListener('change', (e) => {
			const file = e.target.files[0];
			if (!file) return;
	
			selectedImage = file;
	
			const reader = new FileReader();
			reader.onload = (event) => {
				imageLabel.style.backgroundImage = `url(${event.target.result})`;
				imageLabel.style.backgroundSize = 'cover';
				imageLabel.style.backgroundPosition = 'center';
			};
			reader.readAsDataURL(file);
		});
	
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
				const res = await fetch('/game/Tournament/', {
					method: 'POST',
					body: formData,
				});
	
				if (!res.ok) {
					throw new Error('Failed to create the tournament');
				}
				window.location.href = '/home';
			} catch (error) {
				console.error(error);
			}
		});
	});
	
}


const notifications = [
	{
		text: "You have a new message",
		time: "10:24",
		image: "components/auth/assets/google.svg"
	},
	{
		text: "You have a new message",
		time: "10:24",
		image: "components/auth/assets/google.svg"
	},
	{
		text: "You have a new message",
		time: "10:24",
		image: "components/auth/assets/google.svg"
	},
	{
		text: "You have a new message",
		time: "10:24",
		image: "components/auth/assets/google.svg"
	},
	{
		text: "You have a new message",
		time: "10:24",
		image: "components/auth/assets/google.svg"
	},
	{
		text: "You have a new message",
		time: "10:24",
		image: "components/auth/assets/google.svg"
	},
	{
		text: "You have a new message",
		time: "10:24",
		image: "components/auth/assets/google.svg"
	},
	{
		text: "Your order has been shipped",
		time: "11:00",
		image: "/components/auth/assets/42_logo.svg"
	}
];

function getCookieValue(name) {
	const cookies = document.cookie.split(';');
	for (let i = 0; i < cookies.length; i++) {
		const cookie = cookies[i].trim();
		if (cookie.startsWith(name + '=')) {
			return cookie.substring(name.length + 1);
		}
	}
	return null;
}


async function loadNavbar() {
	const path = window.location.pathname;

	if (!path.startsWith('/game') && !path.startsWith('/sign')) {
		try {
			const response = await fetch('components/navBar/View/navBar.html');
			if (!response.ok) throw new Error('Network response was not ok');
			const navbarHTML = await response.text();

			document.body.insertAdjacentHTML('afterbegin', navbarHTML);

			renderNavBrContent();

			fetchMyData();
			renderNotifications();

			document.getElementById('notif').addEventListener('click', function () {
				const panel = document.getElementById('notification-panel');
				panel.classList.toggle('hidden');
			});

			document.addEventListener('DOMContentLoaded', renderNotifications);

			document.addEventListener('click', function (event) {
				const panel = document.getElementById('notification-panel');
				const notifButton = document.getElementById('notif');
				if (!panel.contains(event.target) && !notifButton.contains(event.target)) {
					panel.classList.add('hidden');
				}
			});

		} catch (error) {
			console.error('Error loading navbar:', error);
		}
	}
}

function renderNotifications() {
	const notificationList = document.getElementById('notification-list');
	notificationList.innerHTML = '';

	notifications.forEach(notification => {
		const notificationItem = document.createElement('div');
		notificationItem.className = 'notification-item';

		notificationItem.innerHTML = `
            <a href="${notification.link}" class="notification-link">
                <div class="notification-image-container">
                    <img class="notification-image" src="${notification.image}" alt="Profile Image" width="35" height="35" />
                </div>
                <div class="notification-text-container">
                    <div class="notification-text">${notification.text}</div>
                    <div class="notification-time">${notification.time}</div>
                </div>
            </a>
            <div class="notification-menu-container">
                <div class="notification-menu">
                    <div class="three-points-trigger">
						<svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M12 6.42C12.2546 6.42 12.4988 6.31886 12.6789 6.13882C12.8589 5.95879 12.96 5.71461 12.96 5.46C12.96 5.20539 12.8589 4.96121 12.6789 4.78118C12.4988 4.60114 12.2546 4.5 12 4.5C11.7454 4.5 11.5013 4.60114 11.3212 4.78118C11.1412 4.96121 11.04 5.20539 11.04 5.46C11.04 5.71461 11.1412 5.95879 11.3212 6.13882C11.5013 6.31886 11.7454 6.42 12 6.42ZM12 13.46C12.2546 13.46 12.4988 13.3589 12.6789 13.1788C12.8589 12.9988 12.96 12.7546 12.96 12.5C12.96 12.2454 12.8589 12.0012 12.6789 11.8212C12.4988 11.6411 12.2546 11.54 12 11.54C11.7454 11.54 11.5013 11.6411 11.3212 11.8212C11.1412 12.0012 11.04 12.2454 11.04 12.5C11.04 12.7546 11.1412 12.9988 11.3212 13.1788C11.5013 13.3589 11.7454 13.46 12 13.46ZM12 20.5C12.2546 20.5 12.4988 20.3989 12.6789 20.2188C12.8589 20.0388 12.96 19.7946 12.96 19.54C12.96 19.2854 12.8589 19.0412 12.6789 18.8612C12.4988 18.6811 12.2546 18.58 12 18.58C11.7454 18.58 11.5013 18.6811 11.3212 18.8612C11.1412 19.0412 11.04 19.2854 11.04 19.54C11.04 19.7946 11.1412 20.0388 11.3212 20.2188C11.5013 20.3989 11.7454 20.5 12 20.5Z" stroke="#F8F8F8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
					</div>
                </div>
            </div>
        `;

		notificationList.appendChild(notificationItem);
	});
}


function renderNavBrContent() {


	console.log("Applying navbar styles...");
	const navItems = document.querySelectorAll('.nav-item.nav a');

	navItems.forEach(navItem => {
		if (window.location.pathname === navItem.getAttribute('href')) {
			const svg = navItem.querySelector('svg path');
			const paragraph = navItem.querySelector('p');

			if (svg) svg.setAttribute('fill', '#FD4106');
			if (paragraph) paragraph.style.color = '#FD4106';
			const underline = document.createElement('div');
			underline.style.width = '100%';
			underline.style.height = '2px';
			underline.style.backgroundColor = '#FD4106';
			underline.style.position = 'absolute';
			underline.style.bottom = '0';
			underline.style.left = '0';
			navItem.style.position = 'relative';

			navItem.appendChild(underline);
		}
	});
}

async function fetchMyData() {
	const accessToken = getCookieValue('access');
	const refreshToken = getCookieValue('refresh'); // Note: This might not be needed for this request

	if (!accessToken || refreshToken) return;
	const apiUrl = 'https://localhost:4433/api/v1/users/me/';

	try {
		const response = await fetch(apiUrl, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${accessToken}` // Include the access token in the Authorization header
			}
		});
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		data.image_url = data.image_url.replace('https://localhost/', 'https://localhost:4433/');
		data.rank.icon = data.rank.icon.replace('https://localhost/', 'https://localhost:4433/');
		handleUserData(data);
	} catch (error) {
		console.error('Error fetching user data:', error);
	}
}

function handleUserData(data) {
	const profileButton = document.querySelector('.profile-button .profile');
	console.log(data.username);
	if (!profileButton) return;

	profileButton.innerHTML = `
		<div class="profile-content">
			<div class="profile-image">
				<img src="${data.image_url || 'components/auth/assets/google.svg'}" alt="Profile Image" />
			</div>
			<div class="profile-details">
				<div class="profile-name">${data.username}</div>
				<div class="profile-level">Level ${data.current_xp + "/" + data.rank.xp_required}</div>
			</div>
		</div>
		<div id="profile-icon" class="profile-dropdown-icon">
			<svg class="dropdown-svg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 8">
				<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.52" d="M13 7 7.674 1.3a.91.91 0 0 0-1.348 0L1 7" />
			</svg>
		</div>
	`;
}

// Ensure DOM is fully loaded before calling fetchMyData
document.addEventListener('DOMContentLoaded', function () {
	fetchMyData();
});

loadNavbar();

// loadNavbar();

const html = String.raw;
import { Empty } from "../../../../lib/Empty.js";
import { fetchWithAuth } from '../../../../lib/apiMock.js'

export function SliderItem(tournament, index) {
	let href = 'components/home/components/assets/valorant1.jpg'
	if (index === 1)
		href = 'components/home/components/assets/valorant_img.jpg'
	else if (index === 2)
		href = 'components/home/components/assets/valorant_img0.jpg'
	console.log("start rander the consol html ", index)
	return html`
	<div class='t-container'>
		<div class='t-container-details'>
			<div class="t-title-container">
				<button class='highlighted t-title'> REGISTRATION OPENS </button>
			</div>
			<div class="t-name">
				${tournament.name}
			</div>
			<div class="t-description">
				${tournament.description}
			</div>

			<div class='t-cta-container'>
				<div class="t-cta-list" aria-label="Navigate to profile">
					<a href='/tournaments' style='z-index: 99'>
						<button class=' t-cta'>Register now</button>
					</a>
					<a href='/tournaments' class="t-learn-container"><button class='t-learn'>Learn more</button>
					</a>
				</div>
			</div>
		</div>

		<div class="t-img-bg-container">
			<div class="t-img-bg">
				<img src=${href} alt="anouncement background img" />
			</div>
		</div>
		<div class="t-primary-img-container">
			<div class="t-primary-img">
				<img src=${href} alt="anouncement primary Image" />
			</div>
		</div>
	</div>`
}

async function fetchAnnouncement() {
	const apiUrl = "https://localhost:4433/api/v1/game/Tournament-announcements/";
	try {
		const response = await fetchWithAuth(apiUrl, {
			method: 'GET',
		});
		return response.results
			.slice(0, 3)
			.map((result) => ({
				...result,
				icon: result.icon?.replace("https://localhost/", "https://localhost:4433/")
			}));
	} catch (error) {
		console.error("Error fetching user data:", error);
	}
}

export default async function renderCarousel() {
	const tournaments = await fetchAnnouncement()
	let carouselItems = tournaments.map((tournament, index) => {
		return html`
            <div class="item ${index === 0 ? 'active' : ''}">
                <div class="slider-container">
                    ${SliderItem(tournament, index)}
                </div>
            </div>
        `;
	}).join('');

	let carouselIndicators = tournaments.map((_, index) => {
		return html`
            <li class="${index === 0 ? 'active' : ''}" data-target="#carousel-example" data-slide-to="${index}"></li>
        `;
	}).join('');

	document.querySelector('.carousel-inner').innerHTML = carouselItems;
	document.querySelector('.carousel-indicators').innerHTML = carouselIndicators;

	initializeCarousel();
}

export function initializeCarousel() {
	console.log('renderCarousel');

	let items = document.querySelectorAll('.carousel .item');
	let dots = document.querySelectorAll('.carousel-indicators li');
	let currentItem = 0;
	let isEnabled = true;
	let timeoutID = null;

	function changeCurrentItem(n) {
		currentItem = (n + items.length) % items.length;
	}

	function nextItem(n) {
		hideItem('to-left');
		changeCurrentItem(n + 1);
		showItem('from-right');
	}

	function previousItem(n) {
		hideItem('to-right');
		changeCurrentItem(n - 1);
		showItem('from-left');
	}

	function goToItem(n) {
		if (n < currentItem) {
			hideItem('to-right');
			currentItem = n;
			showItem('from-left');
		} else {
			hideItem('to-left');
			currentItem = n;
			showItem('from-right');
		}
	}

	function hideItem(direction) {
		isEnabled = false;
		items[currentItem].classList.add(direction);
		dots[currentItem].classList.remove('active');
		items[currentItem].addEventListener('animationend', function () {
			this.classList.remove('active', direction);
		});
	}

	function showItem(direction) {
		items[currentItem].classList.add('next', direction);
		dots[currentItem].classList.add('active');
		items[currentItem].addEventListener('animationend', function () {
			this.classList.remove('next', direction);
			this.classList.add('active');
			isEnabled = true;
		});
	}

	document.querySelector('.carousel-control.left').addEventListener('click', function (e) {
		e.preventDefault();
		if (isEnabled) {
			resetTimer();
			previousItem(currentItem);
		}
	});

	document.querySelector('.carousel-control.right').addEventListener('click', function (e) {
		e.preventDefault();
		if (isEnabled) {
			resetTimer();
			nextItem(currentItem);
		}
	});

	document.querySelector('.carousel-indicators').addEventListener('click', function (e) {
		var target = [].slice.call(e.target.parentNode.children).indexOf(e.target);
		if (target !== currentItem && target < dots.length) {
			goToItem(target);
		}
	});

	function startTimer() {
		// wait 2 seconds before calling goInactive
		timeoutID = window.setInterval(() => nextItem(currentItem), 2000);
	}

	function resetTimer() {
		window.clearInterval(timeoutID);
	}
	startTimer();
}
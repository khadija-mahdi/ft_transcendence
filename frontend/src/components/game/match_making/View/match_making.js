const html = String.raw;

export default () => {
	const htmlContent = html`
		<div class="bg-image">
			<img src="/public/game/matching-bg.jpg" alt="Background" class="bg-img">
		</div>
		<div class="container-match">
			<button class="play_now_button" id="play-now-button">
				<span id="countdown-timer">01:00</span>
			</button>
			<div class='main-cards-container'>
				<div class="player-card">
					<img src="/public/assets/images/Unknown.jpg" alt="Player Image" class="player-image">
					<div class="player-info">
						<div class="player-name">@Aaitouna</div>
						<div class="player-rank">
							<img src="/public/assets/icons/Gold_3_Rank.png" alt="Rank Icon" class="rank-icon">
							<span class="player-level">Lvl.782</span>
						</div>
					</div>
				</div>
				<div class="vs">VS</div>
				<div class="scroll-parent">
					<div class="player-card scroll-element primary">
						<img src="/public/assets/images/Unknown.jpg" alt="Player Image" class="player-image">
						<div class="player-info">
							<div class="player-name">@Unknown</div>
							<div class="player-rank">
								<img src="/public/assets/icons/Gold_3_Rank.png" alt="Rank Icon" class="rank-icon">
								<span class="player-level">Lvl.--- </span>
							</div>
						</div>
					</div>
					<div class="player-card scroll-element secondary">
						<img src="/public/assets/images/Unknown.jpg" alt="Player Image" class="player-image">
						<div class="player-info">
							<div class="player-name">@Unknown</div>
							<div class="player-rank">
								<img src="/public/assets/icons/Gold_3_Rank.png" alt="Rank Icon" class="rank-icon">
								<span class="player-level">Lvl.--- </span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	`;

	document.body.innerHTML = htmlContent;

	document.getElementById('play-now-button').addEventListener('click', handleButtonClick);
	startCountdown(60);
};

function startCountdown(seconds)
{
	const timerElement = document.getElementById('countdown-timer');
	let remainingTime = seconds;

	const intervalId = setInterval(() => {
		const minutes = Math.floor(remainingTime / 60);
		const seconds = remainingTime % 60;

		timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

		remainingTime--;

		if (remainingTime < 0)
		{
			clearInterval(intervalId);
			onCountdownFinish();
		}
	}, 1000);
}

function handleButtonClick()
{
	window.location.href = "https://localhost:4433/game/choice-game";
}

function onCountdownFinish()
{
	window.location.href = "https://localhost:4433/game/choice-game";
}

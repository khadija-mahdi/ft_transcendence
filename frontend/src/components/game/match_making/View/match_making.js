const html = String.raw;

export default () => {
	return html`
				<div class="bg-image">
					<img src="/public/game/matching-bg.jpg" alt="Background" class="bg-img">
				</div>
				<div class="container-match ">
				<button class="play_now_button" onclick="handleButtonClick()">
					<span>01:26</span>
				</button>
				<div class='main-cards-container'>
				<!-- Left Player Card -->
				<div class="player-card">
							<img src="/public/assets/images/Unknown.jpg" alt="Player Image" class="player-image">
						<div class="player-info">
							<div class="player-name">@Aaitouna</div>
							<div class="player-rank">
								<img src="/assets/icons/Gold_3_Rank.png" alt="Rank Icon" class="rank-icon">
								<span class="player-level">Lvl.782</span>
							</div>
						</div>
					</div>
					<div class="vs">VS</div>
					<!-- Right Player Card -->
					<div class="scroll-parent">
						<div class="player-card scroll-element primary ">
							<!-- <div class="player-image-container"> -->
								<img src="/public/assets/images/Unknown.jpg" alt="Player Image" class="player-image">
							<!-- </div> -->
							<div class="player-info">
								<div class="player-name">@Unknown</div>
								<div class="player-rank">
									<img src="/assets/icons/Gold_3_Rank.png" alt="Rank Icon" class="rank-icon">
									<span class="player-level">Lvl.--- </span>
								</div>
							</div>
						</div>
						<div class="player-card scroll-element secondary">
								<img src="/public/assets/images/Unknown.jpg" alt="Player Image" class="player-image">							<div class="player-info">
								<div class="player-name">@Unknown</div>
								<div class="player-rank">
									<img src="/assets/icons/Gold_3_Rank.png" alt="Rank Icon" class="rank-icon">
									<span class="player-level">Lvl.--- </span>
								</div>
							</div>
						</div>
			 		</div>
					</div>
				</div>
	`;
};


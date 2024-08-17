const html = String.raw;

export default function () {
	return html`
	<div class="carousel">
  <div class="carousel-inner">
    <div class="item active">
      <div class="slider-container">
       ${SliderItem()}
      </div>
    </div>
    <div class="item">
      <div class="slider-container">
	  ${SliderItem()}
      </div>
    </div>
    <div class="item">
      <div class="slider-container">
	  ${SliderItem()}
      </div>
    </div>
  </div>
  <a class="carousel-control left" href="#carousel-example" data-slide="prev">
    <div class="arrow left"></div>
  </a>
  <a class="carousel-control right" href="#carousel-example" data-slide="next">
    <div class="arrow right"></div>
  </a>
  <ol class="carousel-indicators">
    <li class="active" data-target="#carousel-example" data-slide-to="0"></li>
    <li data-target="#carousel-example" data-slide-to="1"></li>
    <li data-target="#carousel-example" data-slide-to="2"></li>
  </ol>
</div>
    `;
};


function SliderItem() {
	return html`
	<div class='t-container'>
		<div class='t-container-details'>
			<div class="t-title-container">
				<button class='highlighted t-title'> REGISTRATION OPENS </button>
			</div>
			<div class="t-name">
				<div> VALORANT 2024 TOURNAMENT </div>
			</div>
			<div class="t-description">
				<div>lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
					et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
					aliquip ex ea commodo consequat.</div>
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
				<img src="./valorant1.jpg" alt="anouncement background img" />
			</div>
		</div>
		<div class="t-primary-img-container">
			<div class="t-primary-img">
				<img src="./valorant1.jpg" alt="anouncement primary Image" />
			</div>
		</div>
	</div>`
}


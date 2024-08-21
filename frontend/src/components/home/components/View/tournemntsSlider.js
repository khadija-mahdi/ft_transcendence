
const html = String.raw;

export default function () {
	return html`
	<div id="carousel" class="carousel">
		<div class="carousel-inner">
			<div class="item active">
				<div class="slider-container">
				</div>
			</div>
			<div class="item">
				<div class="slider-container">
				</div>
			</div>
			<div class="item">
				<div class="slider-container">
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



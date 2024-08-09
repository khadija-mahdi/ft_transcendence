export const navBarUI  =() => {
    loadCSS('components/navBar/navBar.css');
	

    return /*html*/`
		<div class="navbar">
			<div class="navbar-content">
				<!-- PlayNowIcon equivalent -->
				<svg class="play-now-icon"><!-- SVG content --></svg>
				<!-- Links equivalent, shown only on large screens -->
				<div class="nav-links hidden-lg">
					<a href="/link1">Link 1</a>
					<a href="/link2">Link 2</a>
					<!-- More links -->
				</div>
			</div>
			<div class="social-and-profile">
				<!-- SocialPanel equivalent, shown only on large screens -->
				<div class="social-links hidden-lg">
					<a href="/social1">Social 1</a>
					<a href="/social2">Social 2</a>
					<!-- More social links -->
				</div>
				<!-- ProfileIcon equivalent -->
				<svg class="profile-icon"><!-- SVG content --></svg>
			</div>
		</div>
    `;
};

function loadCSS(href) {
    let link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
}

export default () => {
	console.log("Nav bar page");
    const nav_barUI = navBarUI ();
	document.body.insertAdjacentHTML('beforeend',nav_barUI); 
	return '<div></div>';
};
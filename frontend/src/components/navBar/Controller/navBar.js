async function loadNavbar() {
    const path = window.location.pathname;

    if (!path.startsWith('/game') && !path.startsWith('/sign')) {
        try {
            console.log("Loading navbar...");
            const response = await fetch('/components/navBar/View/navBar.html');
            if (!response.ok) throw new Error('Network response was not ok');
            const navbarHTML = await response.text();
            document.body.insertAdjacentHTML('afterbegin', navbarHTML);

            // Apply navbar styles after inserting the HTML
            console.log("Applying navbar styles...");
            const navItems = document.querySelectorAll('.nav-item.nav a');

            navItems.forEach(navItem => {
                if (window.location.pathname === navItem.getAttribute('href')) {
                    const svg = navItem.querySelector('svg path');
                    const paragraph = navItem.querySelector('p');

                    // Change SVG color to red
                    if (svg) svg.setAttribute('fill', '#FD4106');

                    // Change paragraph text color to red
                    if (paragraph) paragraph.style.color = '#FD4106';

                    // Create an underline
                    const underline = document.createElement('div');
                    underline.style.width = '100%';
                    underline.style.height = '2px';  // Adjust the thickness of the underline
                    underline.style.backgroundColor = '#FD4106';  // Underline color
                    underline.style.position = 'absolute';
                    underline.style.bottom = '0';
                    underline.style.left = '0';

                    // Position the parent anchor tag relatively
                    navItem.style.position = 'relative';

                    // Append the underline to the anchor tag
                    navItem.appendChild(underline);
                }
            });
        } catch (error) {
            console.error('Error loading navbar:', error);
        }
    }
}

loadNavbar();

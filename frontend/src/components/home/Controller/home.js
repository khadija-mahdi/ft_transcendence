import controller_Tournaments from '../../tournaments/Controller/Tournaments.js';
import UserSection from '../components/Controller/UserSection.js';

export default function () {
    console.log("Home JS is working!");
    const head = document.head;

    const cssFiles = [
        './components/tournaments/assets/Tournaments.css',
		'./components/home/components/assets/UserSection.css'
    ];

    function loadCSS(href, onLoad, onError) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.onload = onLoad;
        link.onerror = onError;
        head.appendChild(link);
    }
    cssFiles.forEach(cssFile => {
        loadCSS(
            cssFile,
            () => console.log(`${cssFile} loaded`),
            () => console.error(`Failed to load ${cssFile}`)
        );
    });

    controller_Tournaments();
}

import routes from './routesConfig.js';

async function loadCSS(href) {
    if (!href) return;
    return new Promise((resolve, reject) => {
        let existingLink = document.querySelector(`link[href="${href}"]`);
        if (existingLink) return resolve();
        let link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.onload = () => resolve();
        link.onerror = () => reject(`Failed to load CSS: ${href}`);
        document.head.appendChild(link);
    });
}

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

function checkSignUpStep(requiredStep) {
    const currentStep = sessionStorage.getItem('signUpStep');
    if (!currentStep) return false;
    const stepSequence = {
        'start': 0,
        'emailEntered': 1,
        'emailVerified': 2,
        'infoEntered': 3
    };
    return stepSequence[currentStep] >= stepSequence[requiredStep];
}

function routeGuard(path) {
    if (path.startsWith('/sign_up_email') && !checkSignUpStep('emailEntered')) {
        return '/sign_up';
    }
    if (path.startsWith('/sign_up_info') && !checkSignUpStep('emailVerified')) {
        return '/sign_up';
    }
    return path;
}

async function navigate(path) {
    const routeConfig = routes[path] || routes['*'];
    const accessToken = getCookieValue('access');
    const refreshToken = getCookieValue('refresh');

    if ((!accessToken || !refreshToken) && !path.startsWith('/sign')) {
        window.location.href = '/sign_in';
        return;
    }
    if ((accessToken || refreshToken) && path.startsWith("/sign")) {
        window.location.href = '/';
        return;
    }

    const guardedPath = routeGuard(path);
    const route = routes[guardedPath] || routes['*'];
    document.title = route.title;
    const app = document.getElementById('main');
    app.style.visibility = 'hidden';

    try {
        await loadCSS(route.css);
        const componentModule = await route.component();
        const component = componentModule.default;
        if (typeof component === 'function') {
            app.innerHTML = component();
        } else {
            console.error('Component is not a function');
            app.innerHTML = (await (await routes['*'].component()).default)();
        }
        if (route.controller) {
            const controllerModule = await route.controller();
            if (typeof controllerModule.default === 'function') {
                controllerModule.default();
            }
        }
        app.style.visibility = 'visible';
    } catch (error) {
        console.error(error);
        app.innerHTML = (await (await routes['*'].component()).default)();
    }
}

window.addEventListener('popstate', () => {
    navigate(window.location.pathname);
});

document.addEventListener('DOMContentLoaded', () => {
    navigate(window.location.pathname || '/');
});

document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const navToggle = document.querySelector('.nav-toggle');
    const bodyNav = document.querySelector('.body-nav');

    const readThemePreference = () => {
        try {
            return localStorage.getItem('themePreference');
        } catch (error) {
            return null;
        }
    };

    const writeThemePreference = (theme) => {
        try {
            localStorage.setItem('themePreference', theme);
        } catch (error) {
            // Ignora errores de almacenamiento si el navegador bloquea localStorage.
        }
    };

    const applyTheme = (theme) => {
        const safeTheme = theme === 'dark' ? 'dark' : 'light';

        document.documentElement.setAttribute('data-theme', safeTheme === 'dark' ? 'dark' : 'light');

        if (themeIcon) {
            themeIcon.textContent = safeTheme === 'dark' ? '🌙' : '☀️';
        }

        if (toggleButton) {
            toggleButton.setAttribute('aria-label', safeTheme === 'dark' ? 'Activar tema claro' : 'Activar tema oscuro');
        }
    };

    const getSystemTheme = () => {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    const getDeviceMode = () => {
        const ua = navigator.userAgent || '';

        if (/Android/i.test(ua)) return 'android';
        if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';

        if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
            return 'webapp';
        }

        return 'web';
    };

    if (navToggle && bodyNav) {
        const deviceMode = getDeviceMode();
        navToggle.dataset.device = deviceMode;
        bodyNav.dataset.device = deviceMode;

        const label = document.createElement('span');
        label.className = 'menu-label';
        label.textContent = deviceMode === 'ios' ? 'Más' : 'Menú';

        const icon = document.createElement('span');
        icon.className = 'menu-icon';
        icon.setAttribute('aria-hidden', 'true');

        if (deviceMode === 'android') {
            icon.textContent = '⋮';
        } else if (deviceMode === 'ios') {
            icon.textContent = '…';
        } else {
            icon.textContent = '⋯';
        }

        navToggle.innerHTML = '';
        navToggle.appendChild(label);
        navToggle.appendChild(icon);

        navToggle.addEventListener('click', () => {
            const isOpen = bodyNav.classList.toggle('is-open');
            navToggle.setAttribute('aria-expanded', String(isOpen));
        });

        document.addEventListener('click', (event) => {
            if (!bodyNav.contains(event.target)) {
                bodyNav.classList.remove('is-open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    if (toggleButton && themeIcon) {
        const preferredTheme = readThemePreference() || getSystemTheme();
        applyTheme(preferredTheme);

        toggleButton.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

            applyTheme(nextTheme);
            writeThemePreference(nextTheme);
        });

        const colorSchemeMedia = window.matchMedia('(prefers-color-scheme: dark)');
        const handleSystemThemeChange = (event) => {
            if (!readThemePreference()) {
                applyTheme(event.matches ? 'dark' : 'light');
            }
        };

        if (typeof colorSchemeMedia.addEventListener === 'function') {
            colorSchemeMedia.addEventListener('change', handleSystemThemeChange);
        } else if (typeof colorSchemeMedia.addListener === 'function') {
            colorSchemeMedia.addListener(handleSystemThemeChange);
        }
    }
});

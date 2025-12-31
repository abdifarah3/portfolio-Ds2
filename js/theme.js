/* ============================================
   GESTION DU THÈME (CLAIR/SOMBRE)
   ============================================ */

// Initialiser le thème au chargement
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeHamburger();
});

// Initialiser le thème
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    // Ajouter l'event listener au checkbox
    const themeSwitch = document.querySelector('.theme-switch__input');
    if (themeSwitch) {
        themeSwitch.addEventListener('change', function() {
            const newTheme = this.checked ? 'dark' : 'light';
            setTheme(newTheme);
        });
    }
}

// Basculer le thème
function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

// Définir le thème
function setTheme(theme) {
    const html = document.documentElement;
    const themeSwitch = document.querySelector('.theme-switch__input');

    if (theme === 'dark') {
        html.setAttribute('data-theme', 'dark');
        if (themeSwitch) themeSwitch.checked = true;
    } else {
        html.removeAttribute('data-theme');
        if (themeSwitch) themeSwitch.checked = false;
    }

    localStorage.setItem('theme', theme);
}

/* ============================================
   GESTION DU MENU HAMBURGER
   ============================================ */

function initializeHamburger() {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');
    
    if (!hamburger) return;
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
    });
    
    // Fermer le menu quand on clique sur un lien
    const navLinks = nav.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
        });
    });
    
    // Fermer le menu quand on clique en dehors
    document.addEventListener('click', function(event) {
        const isClickInsideNav = nav.contains(event.target);
        const isClickInsideHamburger = hamburger.contains(event.target);
        
        if (!isClickInsideNav && !isClickInsideHamburger) {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
        }
    });
}

/* ============================================
   ANIMATIONS AU CHARGEMENT
   ============================================ */

// Animer les sections au scroll
function observeSections() {
    const sections = document.querySelectorAll('section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeIn 0.6s ease-in-out';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Appeler la fonction au chargement
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeSections);
} else {
    observeSections();
}

/* ============================================
   UTILITAIRES
   ============================================ */

// Smooth scroll pour les ancres
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});


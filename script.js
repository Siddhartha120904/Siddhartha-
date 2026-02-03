const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;
const sunIcon = document.getElementById('sun-icon');
const moonIcon = document.getElementById('moon-icon');

lucide.createIcons();

const updateIcons = (isDark) => {
    if (isDark) {
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
    } else {
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
    }
};

const savedTheme = localStorage.getItem('portfolio-theme');
if (savedTheme === 'dark') {
    htmlElement.setAttribute('data-theme', 'dark');
    updateIcons(true);
}

themeToggle.addEventListener('click', () => {
    const isDark = htmlElement.getAttribute('data-theme') === 'dark';
    
    if (isDark) {
        htmlElement.removeAttribute('data-theme');
        localStorage.setItem('portfolio-theme', 'light');
        updateIcons(false);
    } else {
        htmlElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('portfolio-theme', 'dark');
        updateIcons(true);
    }
});
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
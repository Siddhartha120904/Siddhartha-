/* ============================================
   GSAP + ScrollTrigger
============================================ */
gsap.registerPlugin(ScrollTrigger);

/* ============================================
   ICONS
============================================ */
lucide.createIcons();

/* ============================================
   LOADER → then launch everything
============================================ */
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');

    gsap.to(loader, {
        opacity: 0,
        duration: 0.8,
        delay: 1.8,
        ease: 'power2.inOut',
        onComplete: () => {
            loader.style.display = 'none';
            launchSite();
        }
    });
});

/* ============================================
   CUSTOM CURSOR
============================================ */
const cursorDot  = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    gsap.to(cursorDot, { x: mx, y: my, duration: 0.08, ease: 'none' });
});

(function trackRing() {
    rx += (mx - rx) * 0.11;
    ry += (my - ry) * 0.11;
    gsap.set(cursorRing, { x: rx, y: ry });
    requestAnimationFrame(trackRing);
})();

document.querySelectorAll('a, button, [data-tilt], .badge, .social-link, .detail-item').forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
});

/* ============================================
   SCROLL PROGRESS
============================================ */
const progressBar = document.getElementById('scrollProgress');

window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    progressBar.style.width = (pct * 100) + '%';
}, { passive: true });

/* ============================================
   NAV SCROLL SHRINK
============================================ */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ============================================
   SMOOTH SCROLL
============================================ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.getBoundingClientRect().top + window.scrollY - 80,
                behavior: 'smooth'
            });
        }
    });
});

/* ============================================
   THEME TOGGLE
============================================ */
const themeToggle = document.getElementById('theme-toggle');
const sunIcon     = document.getElementById('sun-icon');
const moonIcon    = document.getElementById('moon-icon');
const html        = document.documentElement;

const applyIcons = dark => {
    sunIcon.classList.toggle('hidden', dark);
    moonIcon.classList.toggle('hidden', !dark);
};

if (localStorage.getItem('portfolio-theme') === 'dark') {
    html.setAttribute('data-theme', 'dark');
    applyIcons(true);
}

themeToggle.addEventListener('click', () => {
    const isDark = html.getAttribute('data-theme') === 'dark';
    isDark ? html.removeAttribute('data-theme') : html.setAttribute('data-theme', 'dark');
    localStorage.setItem('portfolio-theme', isDark ? 'light' : 'dark');
    applyIcons(!isDark);
});

/* ============================================
   THREE.JS — HERO PARTICLE FIELD
============================================ */
function initThreeJS() {
    const canvas   = document.getElementById('heroCanvas');
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(innerWidth, innerHeight);
    renderer.setClearColor(0x000000, 0);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, 0.1, 1000);
    camera.position.z = 5;

    /* — particles — */
    const COUNT = window.innerWidth < 768 ? 600 : 1800;
    const pos   = new Float32Array(COUNT * 3);
    const col   = new Float32Array(COUNT * 3);
    const c1    = new THREE.Color('#D49e8d');
    const c2    = new THREE.Color('#38bdf8');
    const c3    = new THREE.Color('#818cf8');

    for (let i = 0; i < COUNT; i++) {
        pos[i*3]   = (Math.random() - 0.5) * 22;
        pos[i*3+1] = (Math.random() - 0.5) * 22;
        pos[i*3+2] = (Math.random() - 0.5) * 12;
        const c = [c1, c2, c3][Math.floor(Math.random() * 3)];
        col[i*3] = c.r; col[i*3+1] = c.g; col[i*3+2] = c.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));

    const mat = new THREE.PointsMaterial({
        size: 0.028,
        vertexColors: true,
        transparent: true,
        opacity: 0.75,
        sizeAttenuation: true
    });

    const pts = new THREE.Points(geo, mat);
    scene.add(pts);

    /* — mouse parallax — */
    let tRX = 0, tRY = 0;
    document.addEventListener('mousemove', e => {
        tRY = ((e.clientX / innerWidth)  - 0.5) * 0.6;
        tRX = ((e.clientY / innerHeight) - 0.5) * 0.4;
    });

    /* — animate — */
    const clock = new THREE.Clock();
    (function tick() {
        requestAnimationFrame(tick);
        const t = clock.getElapsedTime();
        pts.rotation.y += (tRY - pts.rotation.y) * 0.04;
        pts.rotation.x += (tRX - pts.rotation.x) * 0.04;
        pts.rotation.z  = t * 0.04;
        const s = 1 + Math.sin(t * 0.4) * 0.015;
        pts.scale.set(s, s, s);
        renderer.render(scene, camera);
    })();

    window.addEventListener('resize', () => {
        camera.aspect = innerWidth / innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(innerWidth, innerHeight);
    });
}

/* ============================================
   HERO PARALLAX — image tilts with mouse
============================================ */
function initHeroParallax() {
    const wrapper = document.querySelector('.hero-image-wrapper');
    if (!wrapper) return;

    document.addEventListener('mousemove', e => {
        const xP = (e.clientX / innerWidth  - 0.5) * 18;
        const yP = (e.clientY / innerHeight - 0.5) * 18;
        gsap.to(wrapper, {
            rotateY: xP * 0.55,
            rotateX: -yP * 0.55,
            duration: 1,
            ease: 'power2.out',
            transformPerspective: 900
        });
    });
}

/* ============================================
   GSAP SCROLL ANIMATIONS
============================================ */
function initScrollAnimations() {

    /* section headers */
    gsap.utils.toArray('.section-header').forEach(el => {
        gsap.from(el, {
            scrollTrigger: { trigger: el, start: 'top 88%' },
            opacity: 0, y: 55, duration: 0.9, ease: 'power3.out'
        });
    });

    /* title line wipe */
    gsap.utils.toArray('.title-line').forEach(line => {
        gsap.from(line, {
            scrollTrigger: { trigger: line, start: 'top 90%' },
            scaleX: 0, transformOrigin: 'left', duration: 0.8, ease: 'power3.out'
        });
    });

    /* intern cards */
    gsap.utils.toArray('.intern-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: { trigger: card, start: 'top 92%' },
            opacity: 0, y: 70, rotateX: 18,
            duration: 0.85, delay: (i % 3) * 0.13,
            ease: 'power3.out',
            transformPerspective: 800
        });
    });

    /* project cards */
    gsap.utils.toArray('.project-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: { trigger: card, start: 'top 92%' },
            opacity: 0, y: 70, rotateX: 15, scale: 0.96,
            duration: 0.85, delay: (i % 3) * 0.13,
            ease: 'power3.out',
            transformPerspective: 800
        });
    });

    /* skill cards */
    gsap.utils.toArray('.skill-category-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: { trigger: card, start: 'top 92%' },
            opacity: 0, y: 60, rotateX: 12,
            duration: 0.8, delay: (i % 3) * 0.1,
            ease: 'power3.out',
            transformPerspective: 800
        });
    });

    /* cert cards */
    gsap.utils.toArray('.cert-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: { trigger: card, start: 'top 92%' },
            opacity: 0, x: i % 2 === 0 ? -60 : 60, rotateY: i % 2 === 0 ? -12 : 12,
            duration: 0.85, delay: (i % 2) * 0.1,
            ease: 'power3.out',
            transformPerspective: 800
        });
    });

    /* skill tags pop */
    gsap.utils.toArray('.skills-tags span').forEach((span, i) => {
        gsap.from(span, {
            scrollTrigger: { trigger: span, start: 'top 95%' },
            opacity: 0, scale: 0.4,
            duration: 0.4, delay: i * 0.025,
            ease: 'back.out(2.5)'
        });
    });

    /* contact */
    gsap.from('.contact-info-side', {
        scrollTrigger: { trigger: '.contact-footer', start: 'top 82%' },
        opacity: 0, x: -70, duration: 1, ease: 'power3.out'
    });

    gsap.from('.contact-form-card', {
        scrollTrigger: { trigger: '.contact-footer', start: 'top 82%' },
        opacity: 0, x: 70, duration: 1, ease: 'power3.out'
    });

    /* social icons */
    gsap.from('.social-link', {
        scrollTrigger: { trigger: '.footer-bottom', start: 'top 95%' },
        opacity: 0, y: 25, stagger: 0.1, duration: 0.5, ease: 'back.out(2)'
    });
}

/* ============================================
   HERO ENTRY ANIMATION
============================================ */
function initHeroAnim() {
    const tl = gsap.timeline({ delay: 0.1 });
    tl.from('.hero-greeting',   { opacity:0, x:-40, duration:0.7, ease:'power3.out' })
      .from('.hero-text h1',    { opacity:0, y:50,  duration:0.9, ease:'power3.out' }, '-=0.4')
      .from('.hero-desc',       { opacity:0, y:35,  duration:0.7, ease:'power3.out' }, '-=0.5')
      .from('.badge',           { opacity:0, y:25, scale:0.8, stagger:0.1, duration:0.5, ease:'back.out(2)' }, '-=0.4')
      .from('.hero-image-wrapper',{ opacity:0, scale:0.75, rotation:-8, duration:1.1, ease:'power3.out' }, '-=0.9')
      .from('.floating-card',   { opacity:0, scale:0.4, stagger:0.15, duration:0.55, ease:'back.out(2.5)' }, '-=0.5')
      .from('.scroll-indicator',{ opacity:0, y:20, duration:0.5 }, '-=0.2');
}

/* ============================================
   VANILLA TILT
============================================ */
function initTilt() {
    if (window.innerWidth < 768) return;
    VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
        max: 12,
        speed: 450,
        glare: true,
        'max-glare': 0.12,
        easing: 'cubic-bezier(.03,.98,.52,.99)',
        perspective: 1000,
        scale: 1.025
    });
}

/* ============================================
   MAGNETIC BUTTONS
============================================ */
function initMagnetic() {
    document.querySelectorAll('.magnetic-btn').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const r = btn.getBoundingClientRect();
            gsap.to(btn, {
                x: (e.clientX - r.left - r.width  / 2) * 0.32,
                y: (e.clientY - r.top  - r.height / 2) * 0.32,
                duration: 0.35, ease: 'power2.out'
            });
        });
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { x:0, y:0, duration:0.7, ease:'elastic.out(1,0.5)' });
        });
    });
}

/* ============================================
   ACTIVE NAV HIGHLIGHT
============================================ */
function initNavObserver() {
    const links    = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id], div[id="home"]');

    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                links.forEach(l => l.classList.remove('active'));
                const match = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
                if (match) match.classList.add('active');
            }
        });
    }, { rootMargin: '-40% 0px -40% 0px' });

    sections.forEach(s => obs.observe(s));
}

/* ============================================
   FLOATING CARDS — subtle parallax on mouse
============================================ */
function initFloatingParallax() {
    const cards = document.querySelectorAll('.floating-card');
    document.addEventListener('mousemove', e => {
        const xP = e.clientX / innerWidth  - 0.5;
        const yP = e.clientY / innerHeight - 0.5;
        cards.forEach((c, i) => {
            const f = (i + 1) * 7;
            gsap.to(c, { x: xP * f, y: yP * f, duration:0.9, ease:'power2.out' });
        });
    });
}

/* ============================================
   LAUNCH
============================================ */
function launchSite() {
    initThreeJS();
    initHeroParallax();
    initHeroAnim();
    initScrollAnimations();
    initTilt();
    initMagnetic();
    initNavObserver();
    initFloatingParallax();
}

/* ============================================================
   ZYNTRIX — Ambient Interactions & Logic (Optimized for High FPS)
   ============================================================ */

// ============================================================
// 1. LENIS SMOOTH SCROLL WITH NATIVE FALLBACK
// ============================================================
let lenis = null;

if (window.Lenis) {
    lenis = new Lenis({
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        smoothTouch: false, // Ensures snappy native behavior on mobile
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
}

const scrollEngine = {
    stop() {
        if (lenis) lenis.stop();
    },
    start() {
        if (lenis) lenis.start();
    },
    to(target, options = {}) {
        if (lenis) {
            lenis.scrollTo(target, options);
            return;
        }

        const offset = options.offset || 0;
        const top = target.getBoundingClientRect().top + window.scrollY + offset;
        window.scrollTo({ top, behavior: 'smooth' });
    },
};

// ============================================================
// 2. PARALLAX LIQUID ORBS (Mouse Move Interaction)
// ============================================================
const orbs = document.querySelectorAll('.orb');
let mouseX = 0;
let mouseY = 0;
let isOrbUpdating = false;

// Disable expensive mouse tracking on touch devices for pure performance
const isTouchDevice = (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));

if (!isTouchDevice) {
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX / window.innerWidth - 0.5;
        mouseY = e.clientY / window.innerHeight - 0.5;

        // requestAnimationFrame prevents DOM layout thrashing
        if (!isOrbUpdating) {
            isOrbUpdating = true;
            requestAnimationFrame(() => {
                orbs.forEach((orb, index) => {
                    const speed = (index + 1) * 30; 
                    const xOffset = mouseX * speed;
                    const yOffset = mouseY * speed;
                    
                    // Uses CSS variables to beautifully complement CSS keyframes instead of overwriting them
                    orb.style.setProperty('--mx', `${xOffset}px`);
                    orb.style.setProperty('--my', `${yOffset}px`);
                });
                isOrbUpdating = false;
            });
        }
    }, { passive: true });
}

// ============================================================
// 3. NAVBAR SCROLL EFFECT
// ============================================================
const navbar = document.getElementById('navbar');
let isNavUpdating = false;

if (navbar) {
    window.addEventListener('scroll', () => {
        if (!isNavUpdating) {
            isNavUpdating = true;
            requestAnimationFrame(() => {
                navbar.style.background = window.scrollY > 60
                    ? 'rgba(3, 4, 9, 0.85)'
                    : 'rgba(3, 4, 9, 0.6)';
                navbar.style.borderBottom = window.scrollY > 60
                    ? '1px solid rgba(255,255,255,0.08)'
                    : '1px solid rgba(255,255,255,0.05)';
                isNavUpdating = false;
            });
        }
    }, { passive: true });
}

// ============================================================
// 4. HAMBURGER MENU
// ============================================================
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        navLinks.classList.toggle('open');
        if (navLinks.classList.contains('open')) {
            scrollEngine.stop();
            document.body.style.overflow = 'hidden';
        } else {
            scrollEngine.start();
            document.body.style.overflow = '';
        }
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            navLinks.classList.remove('open');
            scrollEngine.start();
            document.body.style.overflow = '';
        });
    });
}

// ============================================================
// 5. SIDE PANEL
// ============================================================
const sidePanel    = document.querySelector('.side-panel');
const panelOverlay = document.querySelector('.side-panel-overlay');
const closeBtn     = document.querySelector('.close-panel');
const panelContent = document.querySelector('.panel-content');

function openPanel(targetId) {
    const template = document.getElementById(targetId);
    if (template && panelContent && sidePanel && panelOverlay) {
        panelContent.innerHTML = template.innerHTML;
        sidePanel.classList.add('active');
        panelOverlay.classList.add('active');
        scrollEngine.stop();
        document.body.style.overflow = 'hidden';
    }
}

function closePanel() {
    if (!sidePanel || !panelOverlay) return;
    sidePanel.classList.remove('active');
    panelOverlay.classList.remove('active');
    scrollEngine.start();
    document.body.style.overflow = '';
}

document.querySelectorAll('.view-details-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = btn.getAttribute('data-target');
        openPanel(targetId);
    });
});

if (closeBtn)     closeBtn.addEventListener('click', closePanel);
if (panelOverlay) panelOverlay.addEventListener('click', closePanel);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePanel();
});

// ============================================================
// 6. HERO ANIMATIONS
// ============================================================
document.querySelectorAll('.fade-in-hero').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.filter = 'blur(10px)';
    el.style.transition = `opacity 1.2s ease ${0.2 + i * 0.15}s, transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${0.2 + i * 0.15}s, filter 1.2s ease ${0.2 + i * 0.15}s`;
    
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0) translateZ(0)';
            el.style.filter = 'blur(0)';
        });
    });
});

// ============================================================
// 7. GSAP SCROLL REVEAL (Refined for Liquid Feel & GPU Speed)
// ============================================================
if (window.gsap && window.ScrollTrigger) {
    document.documentElement.classList.add('js-animations-ready');
    gsap.registerPlugin(ScrollTrigger);

    document.querySelectorAll('.fade-up').forEach((el) => {
        gsap.fromTo(el,
            { opacity: 0, y: 50, filter: 'blur(8px)' },
            {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                duration: 1.2,
                ease: 'power3.out',
                force3D: true, // Forces Hardware Acceleration for silky smooth scrolling
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                },
            }
        );
    });
}

// ============================================================
// 8. CERT SCROLL — PAUSE ON HOVER
// ============================================================
const certTrack = document.querySelector('.cert-scroll-inner');
if (certTrack) {
    certTrack.addEventListener('mouseenter', () => {
        certTrack.style.animationPlayState = 'paused';
    });
    certTrack.addEventListener('mouseleave', () => {
        certTrack.style.animationPlayState = 'running';
    });
}

// ============================================================
// 9. SMOOTH ANCHOR SCROLLING
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            scrollEngine.to(target, { offset: -84, duration: 1.5 });
        }
    });
});

// ============================================================
// 10. ACTIVE NAV LINK HIGHLIGHT
// ============================================================
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

if ('IntersectionObserver' in window) {
    let activeId = null;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                // Only touch DOM if the active element actually changes (performance boost)
                if (activeId !== id) {
                    activeId = id;
                    navAnchors.forEach(a => {
                        const isMatch = a.getAttribute('href') === `#${id}`;
                        a.style.color = isMatch ? 'var(--text-main)' : '';
                        a.style.textShadow = isMatch ? '0 0 10px rgba(0, 232, 255, 0.5)' : 'none';
                    });
                }
            }
        });
    }, { threshold: 0.3 });

    sections.forEach(s => observer.observe(s));
}
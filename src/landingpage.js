/* =========================================================
   KICKOFFBOX MUNDIAL EDITION
   Archivo: src/landingpage.js

   Requiere:
   npm install gsap lenis split-type
========================================================= */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

/* =========================================================
   1. CONFIGURACIÓN GLOBAL
========================================================= */

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const SELECTORS = {
    navbar: "[data-navbar]",
    menuToggle: "[data-menu-toggle]",
    mobileMenu: "[data-mobile-menu]",
    splitTitle: "[data-split-title]",
    heroCopy: '[data-animate="hero-copy"]',
    heroVisual: '[data-animate="hero-visual"]',
    reveal: ".reveal",
    counters: "[data-count]",
    favoriteRows: ".favorite-row",
    tiltCards: "[data-tilt-card]",
    magneticButtons: ".btn--magnetic",
    trailerStage: "[data-video-stage]",
    floatingLights: ".floating-light",
    premiumPoster: ".premium-poster",
};

const EASE = {
    soft: "power3.out",
    sharp: "power4.out",
    smooth: "expo.out",
};

let lenis = null;
let splitTitle = null;

/* =========================================================
   2. UTILIDADES
========================================================= */

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function isTouchDevice() {
    return window.matchMedia("(pointer: coarse)").matches;
}

function formatNumber(value) {
    return Number(value).toLocaleString("es-BO");
}

/* =========================================================
   3. INICIALIZACIÓN PRINCIPAL
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    document.documentElement.classList.add("js-ready");

    initNavbar();
    initMobileMenu();

    if (prefersReducedMotion) {
        initReducedMotionMode();
        return;
    }

    initSmoothScroll();
    initHeroAnimation();
    initScrollReveals();
    initCounters();
    initFavoriteBars();
    initParallax();
    initVideoAnimation();
    initTiltCards();
    initMagneticButtons();
    initMarqueePause();
});

/* =========================================================
   4. MODO REDUCIDO DE MOVIMIENTO
========================================================= */

function initReducedMotionMode() {
    $$(SELECTORS.reveal).forEach((element) => element.classList.add("is-visible"));

    $$(SELECTORS.counters).forEach((counter) => {
        const target = Number(counter.dataset.count || 0);
        counter.textContent = formatNumber(target);
    });

    $$(SELECTORS.favoriteRows).forEach((row) => {
        const value = Number(row.dataset.value || 0);
        const bar = $(".favorite-bar span", row);

        if (bar) {
            bar.style.width = `${value}%`;
        }
    });

    const heroCopy = $(SELECTORS.heroCopy);
    const heroVisual = $(SELECTORS.heroVisual);

    heroCopy?.classList.add("is-visible");
    heroVisual?.classList.add("is-visible");
}

/* =========================================================
   5. NAVBAR DINÁMICO
========================================================= */

function initNavbar() {
    const navbar = $(SELECTORS.navbar);
    if (!navbar) return;

    const updateNavbar = () => {
        navbar.classList.toggle("is-scrolled", window.scrollY > 24);
    };

    updateNavbar();

    window.addEventListener("scroll", updateNavbar, {
        passive: true,
    });
}

/* =========================================================
   6. MENÚ MÓVIL
========================================================= */

function initMobileMenu() {
    const toggle = $(SELECTORS.menuToggle);
    const menu = $(SELECTORS.mobileMenu);

    if (!toggle || !menu) return;

    const openMenu = () => {
        menu.classList.add("is-open");
        menu.setAttribute("aria-hidden", "false");
        toggle.setAttribute("aria-label", "Cerrar menú");
        toggle.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    };

    const closeMenu = () => {
        menu.classList.remove("is-open");
        menu.setAttribute("aria-hidden", "true");
        toggle.setAttribute("aria-label", "Abrir menú");
        toggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    };

    toggle.addEventListener("click", () => {
        if (menu.classList.contains("is-open")) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    $$("a", menu).forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMenu();
        }
    });

    document.addEventListener("click", (event) => {
        const clickedInsideMenu = menu.contains(event.target);
        const clickedToggle = toggle.contains(event.target);

        if (!clickedInsideMenu && !clickedToggle) {
            closeMenu();
        }
    });
}

/* =========================================================
   7. LENIS SMOOTH SCROLL
========================================================= */

function initSmoothScroll() {
    lenis = new Lenis({
        duration: 1.12,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 0.95,
        touchMultiplier: 1.15,
        infinite: false,
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
}

/* =========================================================
   8. HERO ANIMATION
========================================================= */

function initHeroAnimation() {
    const heroTitle = $(SELECTORS.splitTitle);
    const heroCopy = $(SELECTORS.heroCopy);
    const heroVisual = $(SELECTORS.heroVisual);
    const poster = $(SELECTORS.premiumPoster);

    if (!heroTitle || !heroCopy) return;

    splitTitle = new SplitType(heroTitle, {
        types: "lines, words",
        lineClass: "split-line",
        wordClass: "split-word",
    });

    gsap.set(".split-line", {
        overflow: "hidden",
    });

    gsap.set(".split-word", {
        yPercent: 115,
        opacity: 0,
        filter: "blur(10px)",
    });

    gsap.set([
        ".section-kicker",
        ".hero__lead",
        ".hero__actions",
        ".hero__badges span",
    ], {
        opacity: 0,
        y: 24,
        filter: "blur(8px)",
    });

    if (heroVisual) {
        gsap.set(heroVisual, {
            opacity: 0,
            y: 42,
            scale: 0.94,
            rotateY: -12,
            filter: "blur(12px)",
        });
    }

    const tl = gsap.timeline({
        defaults: {
            ease: EASE.sharp,
        },
        onComplete: () => {
            heroCopy.classList.add("is-visible");
            heroVisual?.classList.add("is-visible");
        },
    });

    tl.to(".section-kicker", {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.72,
    })
        .to(
            ".split-word",
            {
                yPercent: 0,
                opacity: 1,
                filter: "blur(0px)",
                duration: 1.08,
                stagger: 0.035,
            },
            "-=0.28",
        )
        .to(
            ".hero__lead",
            {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.78,
            },
            "-=0.52",
        )
        .to(
            ".hero__actions",
            {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.68,
            },
            "-=0.45",
        )
        .to(
            ".hero__badges span",
            {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.56,
                stagger: 0.07,
            },
            "-=0.36",
        );

    if (heroVisual) {
        tl.to(
            heroVisual,
            {
                opacity: 1,
                y: 0,
                scale: 1,
                rotateY: 0,
                filter: "blur(0px)",
                duration: 1.05,
                ease: EASE.smooth,
            },
            "-=0.96",
        );
    }

    if (poster && !isTouchDevice()) {
        gsap.to(poster, {
            y: -14,
            rotateY: -4,
            rotateX: 3,
            duration: 4,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
        });
    }
}

/* =========================================================
   9. REVEAL GENERAL POR SCROLL
========================================================= */

function initScrollReveals() {
    const revealItems = $$(SELECTORS.reveal);

    if (!revealItems.length) return;

    gsap.set(revealItems, {
        opacity: 0,
        y: 42,
        filter: "blur(10px)",
    });

    ScrollTrigger.batch(revealItems, {
        start: "top 86%",
        once: true,
        batchMax: 6,
        onEnter: (batch) => {
            gsap.to(batch, {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.86,
                stagger: 0.08,
                ease: EASE.sharp,
                onComplete: () => {
                    batch.forEach((element) => element.classList.add("is-visible"));
                },
            });
        },
    });
}

/* =========================================================
   10. CONTADORES ANIMADOS
========================================================= */

function initCounters() {
    const counters = $$(SELECTORS.counters);

    counters.forEach((counter) => {
        const target = Number(counter.dataset.count || 0);

        counter.textContent = "0";

        ScrollTrigger.create({
            trigger: counter,
            start: "top 86%",
            once: true,
            onEnter: () => {
                const state = {
                    value: 0,
                };

                gsap.to(state, {
                    value: target,
                    duration: target > 1000 ? 1.8 : 1.35,
                    ease: EASE.sharp,
                    onUpdate: () => {
                        counter.textContent = formatNumber(Math.round(state.value));
                    },
                    onComplete: () => {
                        counter.textContent = formatNumber(target);
                    },
                });
            },
        });
    });
}

/* =========================================================
   11. BARRAS DE FAVORITOS
========================================================= */

function initFavoriteBars() {
    const rows = $$(SELECTORS.favoriteRows);

    rows.forEach((row, index) => {
        const value = clamp(Number(row.dataset.value || 0), 0, 100);
        const bar = $(".favorite-bar span", row);

        if (!bar) return;

        gsap.set(bar, {
            width: "0%",
        });

        ScrollTrigger.create({
            trigger: row,
            start: "top 88%",
            once: true,
            onEnter: () => {
                gsap.to(bar, {
                    width: `${value}%`,
                    duration: 1.1,
                    delay: index * 0.045,
                    ease: "power3.out",
                });

                gsap.fromTo(
                    row,
                    {
                        x: 24,
                        opacity: 0.55,
                    },
                    {
                        x: 0,
                        opacity: 1,
                        duration: 0.55,
                        ease: EASE.soft,
                    },
                );
            },
        });
    });
}

/* =========================================================
   12. PARALLAX SUAVE
========================================================= */

function initParallax() {
    const floatingLights = $$(SELECTORS.floatingLights);
    const trailerStage = $(SELECTORS.trailerStage);
    const poster = $(SELECTORS.premiumPoster);

    floatingLights.forEach((light, index) => {
        gsap.to(light, {
            yPercent: index === 0 ? 14 : -12,
            xPercent: index === 0 ? 6 : -5,
            ease: "none",
            scrollTrigger: {
                trigger: document.body,
                start: "top top",
                end: "bottom bottom",
                scrub: 1.2,
            },
        });
    });

    if (poster) {
        gsap.to(poster, {
            y: 42,
            ease: "none",
            scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "bottom top",
                scrub: 1.25,
            },
        });
    }

    if (trailerStage) {
        gsap.fromTo(
            trailerStage,
            {
                scale: 0.94,
                y: 40,
            },
            {
                scale: 1,
                y: 0,
                ease: "none",
                scrollTrigger: {
                    trigger: trailerStage,
                    start: "top 92%",
                    end: "top 42%",
                    scrub: 1,
                },
            },
        );
    }
}

/* =========================================================
   13. VIDEO / TRAILER ANIMATION
========================================================= */

function initVideoAnimation() {
    const stage = $(SELECTORS.trailerStage);

    if (!stage) return;

    const frame = $(".video-frame", stage);
    const caption = $(".trailer-caption", stage);

    gsap.set(frame, {
        clipPath: "inset(12% 12% 12% 12% round 32px)",
        filter: "brightness(0.72) blur(8px)",
    });

    gsap.set(caption, {
        opacity: 0,
        y: 20,
    });

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: stage,
            start: "top 78%",
            once: true,
        },
    });

    tl.to(frame, {
        clipPath: "inset(0% 0% 0% 0% round 32px)",
        filter: "brightness(1) blur(0px)",
        duration: 1.15,
        ease: EASE.smooth,
    }).to(
        caption,
        {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: EASE.soft,
        },
        "-=0.45",
    );

    if (!isTouchDevice()) {
        stage.addEventListener("mouseenter", () => {
            gsap.to(stage, {
                scale: 1.012,
                duration: 0.35,
                ease: EASE.soft,
            });
        });

        stage.addEventListener("mouseleave", () => {
            gsap.to(stage, {
                scale: 1,
                duration: 0.35,
                ease: EASE.soft,
            });
        });
    }
}

/* =========================================================
   14. TILT 3D EN PLAYER CARDS
========================================================= */

function initTiltCards() {
    if (isTouchDevice()) return;

    const cards = $$(SELECTORS.tiltCards);

    cards.forEach((card) => {
        const image = $(".player-card__image img", card);

        card.addEventListener("mousemove", (event) => {
            const rect = card.getBoundingClientRect();

            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const rotateY = ((x / rect.width) - 0.5) * 10;
            const rotateX = ((0.5 - y / rect.height)) * 10;

            gsap.to(card, {
                rotateX,
                rotateY,
                y: -8,
                scale: 1.018,
                transformPerspective: 900,
                transformOrigin: "center",
                duration: 0.35,
                ease: EASE.soft,
            });

            if (image) {
                gsap.to(image, {
                    scale: 1.08,
                    x: rotateY * 0.8,
                    y: -rotateX * 0.8,
                    duration: 0.35,
                    ease: EASE.soft,
                });
            }
        });

        card.addEventListener("mouseleave", () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                y: 0,
                scale: 1,
                duration: 0.55,
                ease: "elastic.out(1, 0.45)",
            });

            if (image) {
                gsap.to(image, {
                    scale: 1,
                    x: 0,
                    y: 0,
                    duration: 0.55,
                    ease: EASE.soft,
                });
            }
        });
    });
}

/* =========================================================
   15. BOTONES MAGNÉTICOS
========================================================= */

function initMagneticButtons() {
    if (isTouchDevice()) return;

    const buttons = $$(SELECTORS.magneticButtons);

    buttons.forEach((button) => {
        button.addEventListener("mousemove", (event) => {
            const rect = button.getBoundingClientRect();

            const x = event.clientX - rect.left - rect.width / 2;
            const y = event.clientY - rect.top - rect.height / 2;

            gsap.to(button, {
                x: x * 0.18,
                y: y * 0.22,
                duration: 0.32,
                ease: EASE.soft,
            });
        });

        button.addEventListener("mouseleave", () => {
            gsap.to(button, {
                x: 0,
                y: 0,
                duration: 0.55,
                ease: "elastic.out(1, 0.35)",
            });
        });
    });
}

/* =========================================================
   16. MARQUEE: PAUSAR EN HOVER
========================================================= */

function initMarqueePause() {
    const marquee = $(".hero-marquee div");

    if (!marquee) return;

    marquee.addEventListener("mouseenter", () => {
        marquee.style.animationPlayState = "paused";
    });

    marquee.addEventListener("mouseleave", () => {
        marquee.style.animationPlayState = "running";
    });
}

/* =========================================================
   17. ACTUALIZAR SCROLLTRIGGER EN CARGA DE ASSETS
========================================================= */

window.addEventListener("load", () => {
    ScrollTrigger.refresh();
});

/* =========================================================
   18. LIMPIEZA EN HOT RELOAD DE VITE
========================================================= */

if (import.meta.hot) {
    import.meta.hot.dispose(() => {
        splitTitle?.revert();

        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

        if (lenis) {
            lenis.destroy();
            lenis = null;
        }

        gsap.killTweensOf("*");
    });
}
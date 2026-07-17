/**
 * KOTLERX - Scraped Design Interactions & Form Handlers
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- Twinkling Starfield Initialization ---
    createStars();

    // --- Theme Toggle Handler ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            if (document.body.classList.contains('theme-night')) {
                document.body.classList.remove('theme-night');
                localStorage.setItem('theme', 'day');
            } else {
                document.body.classList.add('theme-night');
                localStorage.setItem('theme', 'night');
            }
        });
    }

    // --- 1. Hero Scroll Parallax Effect ---
    const giantBgText = document.querySelector('.giant-bg-text');
    const heroImg = document.querySelector('.hero-img');
    const bottomShelf = document.querySelector('.bottom-shelf');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        // Background text shifts slower for depth
        if (giantBgText) {
            giantBgText.style.transform = `translateY(calc(-50% + ${scrolled * 0.15}px))`;
        }

        // Foreground rider image shifts slightly
        if (heroImg) {
            heroImg.style.transform = `translateX(-50%) translateY(${scrolled * 0.05}px)`;
        }

    });

    // --- 2. Arrow Scroll Button ---
    const arrowBtn = document.querySelector('.arrow-btn');
    const scrollSection = document.querySelector('.scroll-section');

    if (arrowBtn && scrollSection) {
        arrowBtn.addEventListener('click', () => {
            const offset = scrollSection.getBoundingClientRect().top + window.pageYOffset - 10;
            window.scrollTo({
                top: offset,
                behavior: 'smooth'
            });
        });
    }

    // --- 3. Smooth Scrolling for Header Links ---
    const navLinks = document.querySelectorAll('nav a, .logo');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || !targetId.startsWith('#')) return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const offset = targetElement.getBoundingClientRect().top + window.pageYOffset - 30;
                window.scrollTo({
                    top: offset,
                    behavior: 'smooth'
                });
            }
        });
    });



    // --- 5. Interactive Admissions Callback Form ---
    const callbackForm = document.getElementById('callbackForm');
    const formAlert = document.getElementById('formAlert');

    if (callbackForm && formAlert) {
        callbackForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('clientName').value.trim();
            const email = document.getElementById('clientEmail').value.trim();
            const phone = document.getElementById('clientPhone').value.trim();
            const programSelect = document.getElementById('clientProgram');
            const programText = programSelect.options[programSelect.selectedIndex].text;

            if (!name || !email || !phone || !programSelect.value) {
                showAlert('Please fill out all input fields correctly.', 'error');
                return;
            }

            const sendBtn = callbackForm.querySelector('.btn-form-send');
            const originalText = sendBtn.innerHTML;
            sendBtn.disabled = true;
            sendBtn.innerHTML = '<span>Registering on KXGRID...</span>';

            setTimeout(() => {
                showAlert(`Success! Thank you, ${name}. Your callback request for "${programText}" has been logged on KXGRID. An admissions mentor will reach out shortly.`, 'success');
                callbackForm.reset();
                sendBtn.disabled = false;
                sendBtn.innerHTML = originalText;
            }, 1200);
        });
    }

    // --- 6. Programs Scroll Pinning Horizontal Scroll ---
    const programsSection = document.getElementById('programs');
    const programsTrack = document.querySelector('.programs-track');
    const zoomCircle = document.querySelector('.programs-zoom-circle');

    if (programsSection && programsTrack) {
        const cards = programsTrack.querySelectorAll('.program-card');
        const hoveredCardMap = new Map(); // Track which card is hovered

        cards.forEach((card, idx) => {
            let translateY = 0;
            if (window.innerHeight >= 780) {
                if ((idx + 1) % 3 === 1) translateY = -40;
                else if ((idx + 1) % 3 === 2) translateY = 40;
            }
            card.dataset.translateY = translateY;

            // Mouse enter/move/leave event listeners for dynamic 3D tilt
            card.addEventListener('mouseenter', () => {
                hoveredCardMap.set(card, true);
                card.style.transition = 'transform 0.1s ease, box-shadow 0.3s ease, border-color 0.3s ease';
            });

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const percentX = (x - centerX) / centerX;
                const percentY = (y - centerY) / centerY;
                
                const tiltX = percentY * -10; // Tilt up/down (max 10 deg)
                const tiltY = percentX * 10;  // Tilt left/right (max 10 deg)
                
                const tY = parseFloat(card.dataset.translateY || '0');
                
                card.style.transform = `translateY(${tY - 12}px) perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.03)`;
                
                const img = card.querySelector('.program-card-img');
                if (img) {
                    img.style.transform = `translateX(${percentX * -15}px) translateY(${percentY * -15}px) scale(1.15)`;
                }
            });

            card.addEventListener('mouseleave', () => {
                hoveredCardMap.delete(card);
                card.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.3s ease, border-color 0.3s ease';
                
                // Re-apply standard scroll transform state smoothly
                setTimeout(() => {
                    if (!hoveredCardMap.has(card)) {
                        card.style.transition = '';
                    }
                }, 500);
                
                handleScroll();
            });
        });

        const handleScroll = () => {
            const rect = programsSection.getBoundingClientRect();
            const sectionTop = window.pageYOffset + rect.top;
            const sectionHeight = rect.height;
            const viewportHeight = window.innerHeight;

            const startScroll = sectionTop;
            const endScroll = sectionTop + sectionHeight - viewportHeight;
            const currentScroll = window.pageYOffset;

            let pct = (currentScroll - startScroll) / (endScroll - startScroll);
            pct = Math.max(0, Math.min(1, pct));

            const maxTranslation = Math.max(0, programsTrack.scrollWidth - window.innerWidth);
            const xTranslation = pct * maxTranslation;

            programsTrack.style.transform = `translateX(-${xTranslation}px)`;

            // Update card transforms based on scroll (only if not currently hovered)
            cards.forEach(card => {
                if (hoveredCardMap.has(card)) return;

                const cardRect = card.getBoundingClientRect();
                const cardCenter = cardRect.left + cardRect.width / 2;
                const viewportCenter = window.innerWidth / 2;
                
                let distanceFromCenter = (cardCenter - viewportCenter) / (window.innerWidth / 2);
                distanceFromCenter = Math.max(-1.5, Math.min(1.5, distanceFromCenter));

                const rotateY = distanceFromCenter * -8; // Rotation based on scroll position
                const tY = parseFloat(card.dataset.translateY || '0');

                card.style.transform = `translateY(${tY}px) perspective(1000px) rotateY(${rotateY}deg)`;

                const img = card.querySelector('.program-card-img');
                if (img) {
                    const imgTranslation = distanceFromCenter * 20;
                    img.style.transform = `translateX(${imgTranslation}px) scale(1.15)`;
                }
            });

            if (zoomCircle) {
                if (pct > 0.85) {
                    const zoomPct = (pct - 0.85) / 0.15;
                    const scale = 1 + (zoomPct * 0.15);
                    zoomCircle.style.transform = `scale(${scale})`;
                } else {
                    zoomCircle.style.transform = 'scale(1)';
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleScroll);
        setTimeout(handleScroll, 100);
    }

    // --- 7. Experience KXGRID 3D Rotating Carousel Animation ---
    const scene = document.querySelector('.scene');
    const a3d = document.querySelector('.a3d');
    const sceneCards = document.querySelectorAll('.scene .card');
    const floor = document.querySelector('.scene .floor');
    const trackPath = document.querySelector('.scene .track-line');
    const bikePink = document.querySelector('.scene .bike-pink');
    const bikeYellow = document.querySelector('.scene .bike-yellow');
    const bikeCyan = document.querySelector('.scene .bike-cyan');

    let racingBikes = [];
    if (scene && a3d && sceneCards.length > 0) {
        if (trackPath && bikePink && bikeYellow && bikeCyan) {
            try {
                const pathLength = trackPath.getTotalLength();
                racingBikes = [
                    { element: bikePink, baseSpeed: 1.1, currentSpeed: 1.1, progress: 0 },
                    { element: bikeYellow, baseSpeed: 1.3, currentSpeed: 1.3, progress: pathLength / 3 },
                    { element: bikeCyan, baseSpeed: 0.9, currentSpeed: 0.9, progress: 2 * pathLength / 3 }
                ];
            } catch (e) {
                console.error("Error initializing racing bikes:", e);
            }
        }
        const firstCard = sceneCards[0];
        const cardWidth = firstCard ? firstCard.offsetWidth : 280;
        const initialR_12 = (0.5 * cardWidth + 8) / Math.tan(Math.PI / 12);

        const cardStates = Array.from(sceneCards).map((card, i) => {
            const angle = i * (2 * Math.PI / 12);
            return {
                element: card,
                currentAngle: angle,
                currentTranslateZ: -initialR_12,
                currentScale: 1,
                currentOpacity: 1,
                currentBlur: 0
            };
        });

        let globalRotation = 0;
        let hoveredIndex = null;

        sceneCards.forEach((card, index) => {
            card.addEventListener('mouseenter', () => {
                hoveredIndex = index;
            });
        });

        // Use scene container mouseleave to reset the focused card
        scene.addEventListener('mouseleave', () => {
            hoveredIndex = null;
        });

        const animateCarousel = () => {
            globalRotation += 0.003; // Rotation speed

            const currentFirstCard = sceneCards[0];
            const currentCardWidth = currentFirstCard ? currentFirstCard.offsetWidth : 280;
            const R_12 = (0.5 * currentCardWidth + 8) / Math.tan(Math.PI / 12);
            const R_11 = (0.5 * currentCardWidth + 8) / Math.tan(Math.PI / 11);

            cardStates.forEach((state, i) => {
                let targetAngle, targetTranslateZ, targetScale, targetOpacity, targetBlur;

                if (hoveredIndex === null) {
                    // Normal state: 12 cards evenly distributed
                    targetAngle = globalRotation + i * (2 * Math.PI / 12);
                    targetTranslateZ = -R_12;
                    targetScale = 1;
                    targetOpacity = 1;
                    targetBlur = 0;
                } else {
                    if (i === hoveredIndex) {
                        // Hovered card: in the center, facing user, scaled up
                        targetAngle = Math.round(state.currentAngle / (2 * Math.PI)) * 2 * Math.PI;
                        targetTranslateZ = -R_12 * 0.3; // Nestled slightly behind the center axis
                        targetScale = 1.15; // Slightly scaled up for focus
                        targetOpacity = 1;
                        targetBlur = 0;
                    } else {
                        // Other cards: 11 cards distributed evenly to fill the gap
                        const indexInCircle = i < hoveredIndex ? i : i - 1;
                        targetAngle = globalRotation + indexInCircle * (2 * Math.PI / 11);
                        targetTranslateZ = -R_11;
                        targetScale = 0.85;
                        targetOpacity = 0.2;
                        targetBlur = 4;
                    }
                }

                // Interpolate angle with wrapping protection
                let angleDiff = targetAngle - state.currentAngle;
                angleDiff = Math.atan2(Math.sin(angleDiff), Math.cos(angleDiff));
                state.currentAngle += angleDiff * 0.08;

                // Interpolate other properties
                state.currentTranslateZ += (targetTranslateZ - state.currentTranslateZ) * 0.08;
                state.currentScale += (targetScale - state.currentScale) * 0.08;
                state.currentOpacity += (targetOpacity - state.currentOpacity) * 0.08;
                state.currentBlur += (targetBlur - state.currentBlur) * 0.08;

                // Apply transforms
                const transformStr = `rotateY(${state.currentAngle}rad) translateZ(${state.currentTranslateZ}px) scale(${state.currentScale})`;
                state.element.style.transform = transformStr;
                state.element.style.opacity = state.currentOpacity;
                state.element.style.filter = state.currentBlur > 0.1 ? `blur(${state.currentBlur}px)` : 'none';
                
                if (hoveredIndex !== null && i === hoveredIndex) {
                    state.element.style.zIndex = 100;
                    state.element.style.pointerEvents = 'auto';
                } else {
                    state.element.style.zIndex = 1;
                    state.element.style.pointerEvents = hoveredIndex !== null ? 'none' : 'auto';
                }
            });

            if (floor) {
                const floorTranslateY = window.innerWidth <= 768 ? '10.5em' : '14.2em';
                floor.style.transform = `translateY(${floorTranslateY}) rotateX(90deg) rotateZ(${globalRotation}rad)`;
            }

            if (trackPath && racingBikes.length > 0) {
                try {
                    const pathLength = trackPath.getTotalLength();
                    racingBikes.forEach((bike) => {
                        // Calculate curvature using heading difference between path points
                        const pt1 = trackPath.getPointAtLength(bike.progress);
                        const pt2 = trackPath.getPointAtLength((bike.progress + 2) % pathLength);
                        const pt3 = trackPath.getPointAtLength((bike.progress + 4) % pathLength);
                        
                        const angle1 = Math.atan2(pt2.y - pt1.y, pt2.x - pt1.x);
                        const angle2 = Math.atan2(pt3.y - pt2.y, pt3.x - pt2.x);
                        
                        let diff = angle2 - angle1;
                        diff = Math.atan2(Math.sin(diff), Math.cos(diff));
                        
                        const curvature = Math.abs(diff);
                        // Slow down (up to 55%) in tight corners
                        const targetSpeed = bike.baseSpeed * (1.0 - Math.min(curvature * 3.5, 0.55));
                        
                        bike.currentSpeed += (targetSpeed - bike.currentSpeed) * 0.15;
                        bike.progress = (bike.progress + bike.currentSpeed) % pathLength;
                        
                        // Map 200x200 SVG space to floor percentages (offset 10%, scale 80%)
                        const pt = trackPath.getPointAtLength(bike.progress);
                        const left = 10 + 80 * (pt.x / 200);
                        const top = 10 + 80 * (pt.y / 200);
                        
                        bike.element.style.left = `${left}%`;
                        bike.element.style.top = `${top}%`;
                        bike.element.style.setProperty('--rot', `${angle1}rad`);
                    });
                } catch (e) {
                    console.error("Error animating bikes:", e);
                }
            }

            requestAnimationFrame(animateCarousel);
        };

        animateCarousel();
    }

    function showAlert(message, type) {
        formAlert.textContent = message;
        formAlert.className = 'form-alert'; // reset class
        formAlert.classList.add(type);
        formAlert.classList.remove('hidden');

        // Scroll form slightly to ensure alert visibility
        formAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // --- Dynamic Twinkling Starfield Generator ---
    function createStars() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        const starsContainer = document.createElement('div');
        starsContainer.className = 'stars-container';
        hero.appendChild(starsContainer);

        const starCount = 75;
        const colors = ['#ffffff', '#e0f2fe', '#fef08a', '#fbcfe8']; // cosmic palette (white, light blue, soft yellow, soft pink)

        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = 'star';

            // Random positions in the top 75% height of the hero section
            const x = Math.random() * 100;
            const y = Math.random() * 75;

            // Random sizes (1px to 2.5px)
            const size = Math.random() * 1.5 + 1;

            // Random animation delay and duration for asynchronous twinkling
            const delay = Math.random() * 4;
            const duration = Math.random() * 3 + 2;

            star.style.left = `${x}%`;
            star.style.top = `${y}%`;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.animationDelay = `${delay}s`;
            star.style.animationDuration = `${duration}s`;
            star.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

            starsContainer.appendChild(star);
        }
    }

    // --- Responsive Clip Path for Scroll Container ---
    const clipPathElement = document.getElementById('scroll-clip-path');
    const scrollContainer = document.querySelector('.scroll-container');

    function updateClipPath() {
        if (!clipPathElement || !scrollContainer) return;
        const W = scrollContainer.offsetWidth;
        const H = 30000; // Large height to cover all content expansion
        const L = W / 2 - 240;

        const path = `M 0 145 A 40 40 0 0 1 40 105 L ${L} 105 C ${L + 38.4} 105, ${L + 57.6} 80, ${L + 96} 80 C ${L + 129.6} 80, ${L + 144} 30, ${L + 192} 30 C ${L + 220.8} 30, ${L + 230.4} 0, ${L + 240} 0 C ${L + 249.6} 0, ${L + 259.2} 30, ${L + 288} 30 C ${L + 336} 30, ${L + 350.4} 80, ${L + 384} 80 C ${L + 422.4} 80, ${L + 441.6} 105, ${L + 480} 105 L ${W - 40} 105 A 40 40 0 0 1 ${W} 145 L ${W} ${H} L 0 ${H} Z`;

        clipPathElement.setAttribute('d', path);
    }

    if (clipPathElement && scrollContainer) {
        updateClipPath();
        window.addEventListener('resize', updateClipPath);
    }
});

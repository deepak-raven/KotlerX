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

        const updateSingleCardTransform = (card) => {
            const baseTY = parseFloat(card.dataset.translateY || '0');
            const tY = parseFloat(card.dataset.scrollTranslateY || '0');
            const tX = parseFloat(card.dataset.scrollTranslateX || '0');
            const baseScale = parseFloat(card.dataset.scrollScale || '1');
            
            const tiltX = parseFloat(card.dataset.tiltX || '0');
            const tiltY = parseFloat(card.dataset.tiltY || '0');
            const percentX = parseFloat(card.dataset.percentX || '0');
            const percentY = parseFloat(card.dataset.percentY || '0');
            
            let distanceFromCenter = tX / (window.innerWidth / 2);
            const rotateY = distanceFromCenter * -12;
            
            const isHovered = hoveredCardMap.has(card);
            const hoverOffset = isHovered ? -12 : 0;
            const hoverScale = isHovered ? 1.03 : 1;
            
            card.style.transform = `translate(${tX}px, ${baseTY + tY + hoverOffset}px) perspective(1000px) rotateX(${tiltX}deg) rotateY(${rotateY + tiltY}deg) scale(${baseScale * hoverScale})`;
            
            const img = card.querySelector('.program-card-img');
            if (img) {
                img.style.transform = `translateX(${percentX * -15}px) translateY(${percentY * -15}px) scale(1.15)`;
            }
        };

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
                
                card.dataset.tiltX = tiltX;
                card.dataset.tiltY = tiltY;
                card.dataset.percentX = percentX;
                card.dataset.percentY = percentY;
                
                updateSingleCardTransform(card);
            });

            card.addEventListener('mouseleave', () => {
                hoveredCardMap.delete(card);
                card.dataset.tiltX = 0;
                card.dataset.tiltY = 0;
                card.dataset.percentX = 0;
                card.dataset.percentY = 0;
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

            const progress = pct * cards.length; // From 0 to 6 (6 is the zoom circle)

            // Update card transforms based on scroll
            cards.forEach((card, idx) => {
                const diff = idx - progress;

                let translateX = 0;
                let translateY = 0;
                let scale = 1;
                let zIndex = 1;

                if (diff < 0) {
                    // Card has scrolled past (moving to the left, scaling up slightly)
                    translateX = diff * 500; // moves left
                    scale = 1 - diff * 0.15; // grows slightly or stays large
                    zIndex = Math.max(1, 10 + Math.round(diff));
                } else {
                    // Card is in focus or approaching from the deep background
                    // Exponential scale makes it look far away
                    scale = Math.pow(0.35, diff);
                    
                    // Recedes to the right-depth
                    translateX = Math.pow(diff, 0.7) * 450;
                    
                    // Curved approach path
                    translateY = Math.sin(diff * 0.5) * 40;
                    
                    zIndex = Math.max(1, Math.round(100 - diff * 15));
                }

                card.style.opacity = '1';

                // Save to dataset for hover interactions
                card.dataset.scrollTranslateX = translateX;
                card.dataset.scrollTranslateY = translateY;
                card.dataset.scrollScale = scale;

                // Update zIndex dynamically based on hover state
                const isHovered = hoveredCardMap.has(card);
                card.style.zIndex = isHovered ? 200 : zIndex;

                updateSingleCardTransform(card);
            });

            // Update zoom circle container transform and opacity
            const zoomContainer = programsTrack.querySelector('.programs-zoom-container');
            if (zoomContainer) {
                const diff = cards.length - progress; // index 6

                let translateX = 0;
                let translateY = 0;
                let scale = 1;
                let zIndex = 1;

                if (diff < 0) {
                    // Zoom circle scales up extra large as scroll goes beyond
                    scale = 1 + Math.abs(diff) * 1.5;
                    zIndex = 100;
                } else {
                    scale = Math.pow(0.35, diff);
                    translateX = Math.pow(diff, 0.7) * 450;
                    translateY = Math.sin(diff * 0.5) * 40;
                    zIndex = Math.max(1, Math.round(100 - diff * 15));
                }

                zoomContainer.style.zIndex = zIndex;
                zoomContainer.style.opacity = '1';
                
                zoomContainer.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
                
                if (zoomCircle) {
                    if (diff <= 0) {
                        const scaleInner = 1 + Math.abs(diff) * 0.5;
                        zoomCircle.style.transform = `scale(${scaleInner})`;
                    } else {
                        zoomCircle.style.transform = 'scale(1)';
                    }
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

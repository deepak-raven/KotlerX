/**
 * KOTLERX - Scraped Design Interactions & Form Handlers
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- Twinkling Starfield Initialization ---
    createStars();

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

    // --- 6. Programs Horizontal Scrolling Carousel ---
    const grid = document.querySelector('.programs-grid-new');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const progressFill = document.querySelector('.carousel-progress-fill');

    if (grid) {
        let isDown = false;
        let startX;
        let scrollLeftStart;
        
        let velocity = 0;
        let lastX;
        let lastTime;
        
        let targetScroll = grid.scrollLeft;
        let currentScroll = grid.scrollLeft;
        let animationFrameId = null;
        let isAnimating = false;

        const getCardWidth = () => {
            const card = grid.querySelector('.program-card-new');
            const cardWidth = card ? card.offsetWidth : 340;
            const gap = parseFloat(window.getComputedStyle(grid).gap) || 30;
            return cardWidth + gap;
        };

        // Smoothly update scrollLeft using requestAnimationFrame (lerp)
        const updateScroll = () => {
            if (isAnimating) {
                // If dragging, follow target quickly. If releasing, slide with inertia.
                const ease = isDown ? 0.15 : 0.08;
                const diff = targetScroll - currentScroll;
                
                if (Math.abs(diff) > 0.25) {
                    currentScroll += diff * ease;
                    grid.scrollLeft = currentScroll;
                    animationFrameId = requestAnimationFrame(updateScroll);
                } else {
                    currentScroll = targetScroll;
                    grid.scrollLeft = currentScroll;
                    isAnimating = false;
                    grid.classList.remove('active-drag');
                }
            }
        };

        const startAnimation = () => {
            if (!isAnimating) {
                isAnimating = true;
                currentScroll = grid.scrollLeft;
                animationFrameId = requestAnimationFrame(updateScroll);
            }
        };

        // Nav Buttons scroll
        if (prevBtn && nextBtn) {
            nextBtn.addEventListener('click', () => {
                const cardWidth = getCardWidth();
                const maxScroll = grid.scrollWidth - grid.clientWidth;
                // Find next snap position
                let nextPos = Math.ceil((grid.scrollLeft + 5) / cardWidth) * cardWidth;
                if (nextPos > maxScroll) nextPos = maxScroll;
                
                targetScroll = nextPos;
                grid.classList.add('active-drag'); // disable css native scroll-snap/behavior temporarily
                startAnimation();
            });

            prevBtn.addEventListener('click', () => {
                const cardWidth = getCardWidth();
                // Find prev snap position
                let prevPos = Math.floor((grid.scrollLeft - 5) / cardWidth) * cardWidth;
                if (prevPos < 0) prevPos = 0;
                
                targetScroll = prevPos;
                grid.classList.add('active-drag');
                startAnimation();
            });
        }

        // Progress Bar Fill
        const updateProgressBar = () => {
            if (progressFill) {
                const maxScroll = grid.scrollWidth - grid.clientWidth;
                const ratio = maxScroll > 0 ? (grid.scrollLeft / maxScroll) : 0;
                const minFill = 16.67;
                const fillWidth = minFill + (ratio * (100 - minFill));
                progressFill.style.width = `${fillWidth}%`;
            }
        };

        grid.addEventListener('scroll', updateProgressBar);
        window.addEventListener('resize', updateProgressBar);
        setTimeout(updateProgressBar, 100);

        // Drag to scroll logic
        grid.addEventListener('mousedown', (e) => {
            isDown = true;
            grid.classList.add('active-drag');
            startX = e.pageX - grid.offsetLeft;
            scrollLeftStart = grid.scrollLeft;
            targetScroll = grid.scrollLeft;
            
            lastX = e.pageX;
            lastTime = performance.now();
            velocity = 0;
            
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                isAnimating = false;
            }
        });

        grid.addEventListener('mouseleave', () => {
            if (isDown) handleDragEnd();
        });

        grid.addEventListener('mouseup', () => {
            if (isDown) handleDragEnd();
        });

        grid.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            
            const x = e.pageX - grid.offsetLeft;
            const walk = (x - startX) * 1.4; // drag multiplier
            targetScroll = scrollLeftStart - walk;
            
            // Constrain targetScroll to bounds
            const maxScroll = grid.scrollWidth - grid.clientWidth;
            if (targetScroll < 0) targetScroll = 0;
            if (targetScroll > maxScroll) targetScroll = maxScroll;

            // Calculate velocity (pixels per millisecond)
            const currentTime = performance.now();
            const timeElapsed = currentTime - lastTime;
            if (timeElapsed > 0) {
                const distance = e.pageX - lastX;
                velocity = distance / timeElapsed;
            }
            lastX = e.pageX;
            lastTime = currentTime;

            startAnimation();
        });

        const handleDragEnd = () => {
            isDown = false;
            
            // Inertia calculation
            const inertiaMultiplier = 120; // controls how far the inertia carries
            let finalScroll = targetScroll - (velocity * inertiaMultiplier);
            
            // Snap to nearest card
            const cardWidth = getCardWidth();
            const maxScroll = grid.scrollWidth - grid.clientWidth;
            
            let snappedScroll = Math.round(finalScroll / cardWidth) * cardWidth;
            if (snappedScroll < 0) snappedScroll = 0;
            if (snappedScroll > maxScroll) snappedScroll = maxScroll;
            
            targetScroll = snappedScroll;
            startAnimation();
        };
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
});

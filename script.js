// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Try to play the birthday song, fallback to melody if file missing
function tryPlayBirthdayMusic() {
    const audio = document.getElementById('birthdaySong');
    if (audio) {
        // Check if file exists by trying to play and listening for error
        let triedFallback = false;
        const fallback = () => {
            if (!triedFallback) {
                triedFallback = true;
                playHappyBirthdayMelodyFallback();
            }
        };
        audio.onerror = fallback;
        audio.currentTime = 0;
        audio.volume = 0.9;
        audio.play().catch(fallback);
    } else {
        playHappyBirthdayMelodyFallback();
    }
}

// ========================================
// CONFIGURATION
// ========================================

// Set the birthday moment once here (Month is 0-indexed)
const BIRTHDAY_DATE = new Date(2025, 11, 17, 0, 0, 0);

// Toggle lock mode: when true, main content stays locked until BIRTHDAY_DATE
// We'll leave this false until you confirm everything, then switch to true.
const LOCK_UNTIL_BIRTHDAY = true;

let lockedActive = false;

function initializeApp() {
    createFloatingHearts();
    createBalloons();
    setupEventListeners();
    setupCountdown();
    initConfetti();
    setupGalleryLightbox();
    addGalleryFallbacks();
    optimizeGalleryLayout();
}

// ========================================
// FLOATING HEARTS ANIMATION
// ========================================

function createFloatingHearts() {
    // Don't create hearts if locked
    if (LOCK_UNTIL_BIRTHDAY) {
        return;
    }
    
    const heartsContainer = document.getElementById('hearts');
    const heartEmojis = ['❤️', '💕', '💖', '💗', '💓', '💝'];
    
    setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (Math.random() * 3 + 5) + 's';
        heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
        
        heartsContainer.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 8000);
    }, 300);
}

// ========================================
// EVENT LISTENERS
// ========================================

function setupEventListeners() {
    // Start button
    const startBtn = document.getElementById('startBtn');
    if (startBtn) {
        startBtn.disabled = true;
        startBtn.style.opacity = 0.6;
        startBtn.title = 'Please wait for the countdown to finish!';
        startBtn.addEventListener('click', function() {
            if (!startBtn.disabled) {
                tryPlayBirthdayMusic();
                showBirthdayCard();
            }
        });
    }
    
    // Cake interaction
    const cakeImg = document.getElementById('cakeImg');
    if (cakeImg) cakeImg.addEventListener('click', blowCandles);
    
    // Music button
    const musicBtn = document.getElementById('musicBtn');
    if (musicBtn) musicBtn.addEventListener('click', toggleMusic);
    
    // Surprise button
    const surpriseBtn = document.getElementById('surpriseBtn');
    if (surpriseBtn) surpriseBtn.addEventListener('click', triggerSurprise);
    
    // Love letter button
    const letterBtn = document.getElementById('letterBtn');
    if (letterBtn) letterBtn.addEventListener('click', showLoveLetter);
    
    // Close letter button
    const closeLetter = document.getElementById('closeLetter');
    if (closeLetter) closeLetter.addEventListener('click', hideLoveLetter);

    // Close when clicking outside the letter content (overlay click)
    const loveLetterOverlay = document.getElementById('loveLetter');
    if (loveLetterOverlay) {
        loveLetterOverlay.addEventListener('click', (e) => {
            if (e.target === loveLetterOverlay) hideLoveLetter();
        });
    }

    // Close with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') hideLoveLetter();
    });
}

// ========================================
// SHOW BIRTHDAY CARD
// ========================================

function showBirthdayCard() {
    const welcomeScreen = document.getElementById('welcomeScreen');
    const birthdayCard = document.getElementById('birthdayCard');
    
    welcomeScreen.style.animation = 'fadeOut 0.5s ease-out forwards';
    
    setTimeout(() => {
        welcomeScreen.style.display = 'none';
        birthdayCard.classList.remove('hidden');
        launchConfetti();
        playSound('celebration');
        // Play birthday song when card is opened
        const audio = document.getElementById('birthdaySong');
        if (audio) {
            audio.currentTime = 0;
            audio.volume = 0.9;
            audio.play().catch(() => {
                // If blocked, try again on next user interaction
                const tryPlay = () => {
                    audio.play().then(() => {
                        window.removeEventListener('click', tryPlay);
                        window.removeEventListener('keydown', tryPlay);
                    }).catch(() => {});
                };
                window.addEventListener('click', tryPlay);
                window.addEventListener('keydown', tryPlay);
            });
        }
        applyLockState();
    }, 500);
}

// Add fadeOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(0.8); }
    }
`;
document.head.appendChild(style);

// ========================================
// COUNTDOWN TIMER
// ========================================

function setupCountdown() {
        // Helper to enable the start button
        function enableStartBtn() {
            const startBtn = document.getElementById('startBtn');
            if (startBtn) {
                startBtn.disabled = false;
                startBtn.style.opacity = 1;
                startBtn.title = '';
            }
        }
    const birthday = BIRTHDAY_DATE;
    const countdownElement = document.getElementById('countdown');
    const countdownSection = document.getElementById('countdownSection');
    
    let hasCelebrated = false;

    function celebrateBirthday() {
        if (hasCelebrated) return;
        hasCelebrated = true;
        
        console.log('CELEBRATION TRIGGERED!');
        
        // First unlock the card to show everything
        unlockCard();
        
        // Then trigger all the celebrations
        setTimeout(() => {
            launchConfetti();
            triggerFireworks();
            const name = (document.querySelector('.name-highlight')?.textContent || 'Beautiful').trim();
            showMessage(`🎉 Happy Birthday ${name}! 🎉`);
            
            console.log('About to play song...');
            
            // Force the melody to play
            playHappyBirthdayMelodyFallback();
            
            // Also try audio element with autoplay workaround
            const audio = document.getElementById('birthdaySong');
            if (audio) {
                console.log('Audio element found, attempting play...');
                audio.currentTime = 0;
                audio.volume = 0.9;
                audio.play().catch(() => {
                    // If blocked, try again on next user interaction
                    const tryPlay = () => {
                        audio.play().then(() => {
                            window.removeEventListener('click', tryPlay);
                            window.removeEventListener('keydown', tryPlay);
                        }).catch(() => {});
                    };
                    window.addEventListener('click', tryPlay);
                    window.addEventListener('keydown', tryPlay);
                });
            } else {
                console.log('No audio element found');
            }
        }, 300);
    }

    function updateCountdown() {
        const now = new Date();
        const diff = birthday - now;
        
        if (diff <= 0) {
            countdownSection.innerHTML = '<h2 class="glowing-text">🎉 IT\'S YOUR BIRTHDAY! 🎉</h2>';
            enableStartBtn();
            celebrateBirthday();
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        countdownElement.innerHTML = `
            <div class="countdown-item">
                <div class="countdown-value">${days}</div>
                <div class="countdown-label">Days</div>
            </div>
            <div class="countdown-item">
                <div class="countdown-value">${hours}</div>
                <div class="countdown-label">Hours</div>
            </div>
            <div class="countdown-item">
                <div class="countdown-value">${minutes}</div>
                <div class="countdown-label">Minutes</div>
            </div>
            <div class="countdown-item">
                <div class="countdown-value">${seconds}</div>
                <div class="countdown-label">Seconds</div>
            </div>
        `;
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ========================================
// BLOW CANDLES
// ========================================

function blowCandles() {
    if (isCardLocked()) { showLockedMessage(); return; }
    const flames = document.querySelectorAll('.flame');
    const cakeInstruction = document.querySelector('.cake-instruction');
    
    flames.forEach((flame, index) => {
        setTimeout(() => {
            flame.style.animation = 'blowOut 0.5s ease-out forwards';
            setTimeout(() => {
                flame.style.display = 'none';
            }, 500);
        }, index * 200);
    });
    
    cakeInstruction.textContent = '🎊 Your wish will come true! 🎊';
    cakeInstruction.style.color = '#f5576c';
    cakeInstruction.style.fontWeight = 'bold';
    
    launchConfetti();
    triggerFireworks();
}

// Add blowOut animation
const blowOutStyle = document.createElement('style');
blowOutStyle.textContent = `
    @keyframes blowOut {
        0% { opacity: 1; transform: translateX(-50%) scale(1); }
        100% { opacity: 0; transform: translateX(-50%) scale(0.5) translateY(-20px); }
    }
`;
document.head.appendChild(blowOutStyle);

// ========================================
// MUSIC PLAYER
// ========================================

let isPlaying = false;

function toggleMusic() {
    if (isCardLocked()) { showLockedMessage(); return; }
    const audio = document.getElementById('birthdaySong');
    const musicBtn = document.getElementById('musicBtn');
    if (!audio || !musicBtn) return;

    if (audio.paused) {
        audio.volume = 0.0;
        audio.play()
            .then(() => {
                musicBtn.textContent = '⏸️ Pause Song';
                isPlaying = true;
                fadeAudio(audio, 0.9, 1500);
            })
            .catch(() => {
                alert('💡 Add a birthday_song.mp3 file to the folder to play music!');
            });
    } else {
        audio.pause();
        musicBtn.textContent = '🎵 Play Birthday Song';
        isPlaying = false;
    }
}

// Smoothly ramp audio volume to target over durationMs
function fadeAudio(audioEl, targetVolume, durationMs) {
    try {
        const start = audioEl.volume;
        const delta = targetVolume - start;
        const startTime = performance.now();
        function step(now) {
            const t = Math.min(1, (now - startTime) / durationMs);
            audioEl.volume = Math.min(1, Math.max(0, start + delta * t));
            if (t < 1 && !audioEl.paused) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    } catch (_) {}
}

// ========================================
// SURPRISE BUTTON
// ========================================

function triggerSurprise() {
    if (isCardLocked()) { showLockedMessage(); return; }
    const surprises = [
        () => {
            launchConfetti();
            showMessage('🎉 SURPRISE! You are AMAZING! 🎉');
        },
        () => {
            triggerFireworks();
            showMessage('✨ You light up my world! ✨');
        },
        () => {
            createHeartExplosion();
            showMessage('❤️ I love you more than words can say! ❤️');
        },
        () => {
            launchConfetti();
            triggerFireworks();
            showMessage('🌟 You deserve all the happiness in the world! 🌟');
        }
    ];
    
    const randomSurprise = surprises[Math.floor(Math.random() * surprises.length)];
    randomSurprise();
}

function showMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        color: white;
        padding: 30px 50px;
        border-radius: 20px;
        font-size: 2rem;
        font-weight: bold;
        z-index: 3000;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        animation: bounceIn 0.5s ease-out;
        text-align: center;
    `;
    messageDiv.textContent = text;
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.animation = 'fadeOut 0.5s ease-out forwards';
        setTimeout(() => messageDiv.remove(), 500);
    }, 3000);
}

// ========================================
// HEART EXPLOSION
// ========================================

function createHeartExplosion() {
    const heartEmojis = ['❤️', '💕', '💖', '💗', '💓', '💝', '💞', '💟'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
            heart.style.cssText = `
                position: fixed;
                font-size: ${Math.random() * 30 + 20}px;
                left: 50%;
                top: 50%;
                pointer-events: none;
                z-index: 2500;
                animation: heartExplode ${Math.random() * 2 + 2}s ease-out forwards;
            `;
            
            const angle = (Math.PI * 2 * i) / 50;
            const distance = Math.random() * 300 + 200;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            heart.style.setProperty('--hx', tx + 'px');
            heart.style.setProperty('--hy', ty + 'px');
            
            document.body.appendChild(heart);
            
            setTimeout(() => heart.remove(), 4000);
        }, i * 20);
    }
}

// Add heart explosion animation
const heartExplodeStyle = document.createElement('style');
heartExplodeStyle.textContent = `
    @keyframes heartExplode {
        0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
        }
        100% {
            transform: translate(
                calc(-50% + var(--hx)),
                calc(-50% + var(--hy))
            ) scale(1);
            opacity: 0;
        }
    }
`;
document.head.appendChild(heartExplodeStyle);

// ========================================
// LOVE LETTER
// ========================================

function showLoveLetter() {
    if (isCardLocked()) { showLockedMessage(); return; }
    const loveLetter = document.getElementById('loveLetter');
    loveLetter.classList.remove('hidden');
    loveLetter.classList.remove('fade-out');
    createHeartExplosion();
}

function hideLoveLetter() {
    const loveLetter = document.getElementById('loveLetter');
    if (!loveLetter || loveLetter.classList.contains('hidden')) return;
    // Add fade-out class, then hide after animation ends (with fallback)
    loveLetter.classList.add('fade-out');
    let done = false;
    const cleanup = () => {
        if (done) return;
        done = true;
        loveLetter.classList.add('hidden');
        loveLetter.classList.remove('fade-out');
        loveLetter.removeEventListener('animationend', onAnimEnd);
        loveLetter.removeEventListener('webkitAnimationEnd', onAnimEnd);
    };
    const onAnimEnd = (e) => {
        if (e.target === loveLetter) cleanup();
    };
    loveLetter.addEventListener('animationend', onAnimEnd);
    loveLetter.addEventListener('webkitAnimationEnd', onAnimEnd);
    // Fallback timeout in case animationend doesn't fire
    setTimeout(cleanup, 500);
}

// ========================================
// CONFETTI ANIMATION
// ========================================

let confettiCanvas, confettiCtx;
let confettiParticles = [];

function initConfetti() {
    confettiCanvas = document.getElementById('confetti-canvas');
    confettiCtx = confettiCanvas.getContext('2d');
    resizeConfettiCanvas();
    
    window.addEventListener('resize', resizeConfettiCanvas);
}

function resizeConfettiCanvas() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
}

function launchConfetti() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#a29bfe', '#fd79a8', '#fdcb6e'];
    
    for (let i = 0; i < 150; i++) {
        confettiParticles.push({
            x: Math.random() * confettiCanvas.width,
            y: -10,
            size: Math.random() * 8 + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            velocity: {
                x: Math.random() * 4 - 2,
                y: Math.random() * 3 + 2
            },
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 10 - 5
        });
    }
    
    animateConfetti();
}

function animateConfetti() {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    
    confettiParticles.forEach((particle, index) => {
        particle.y += particle.velocity.y;
        particle.x += particle.velocity.x;
        particle.rotation += particle.rotationSpeed;
        particle.velocity.y += 0.1;
        
        confettiCtx.save();
        confettiCtx.translate(particle.x, particle.y);
        confettiCtx.rotate(particle.rotation * Math.PI / 180);
        confettiCtx.fillStyle = particle.color;
        confettiCtx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
        confettiCtx.restore();
        
        if (particle.y > confettiCanvas.height) {
            confettiParticles.splice(index, 1);
        }
    });
    
    if (confettiParticles.length > 0) {
        requestAnimationFrame(animateConfetti);
    }
}

// ========================================
// FIREWORKS
// ========================================

function triggerFireworks() {
    const fireworksContainer = document.getElementById('fireworks');
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#a29bfe', '#fd79a8', '#fdcb6e'];
    
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight * 0.5;
            
            for (let j = 0; j < 30; j++) {
                const firework = document.createElement('div');
                firework.className = 'firework';
                firework.style.left = x + 'px';
                firework.style.top = y + 'px';
                firework.style.background = colors[Math.floor(Math.random() * colors.length)];
                
                const angle = (Math.PI * 2 * j) / 30;
                const distance = Math.random() * 150 + 100;
                const tx = Math.cos(angle) * distance;
                const ty = Math.sin(angle) * distance;
                
                firework.style.setProperty('--tx', tx + 'px');
                firework.style.setProperty('--ty', ty + 'px');
                
                fireworksContainer.appendChild(firework);
                
                setTimeout(() => firework.remove(), 1000);
            }
        }, i * 500);
    }
}

// ========================================
// SOUND EFFECTS (Optional)
// ========================================

function playSound(type) {
    // You can add sound effects here if you have audio files
    // For now, this is a placeholder
    console.log(`Playing ${type} sound`);
}

// ========================================
// ADDITIONAL FEATURES
// ========================================

// Make the whole card interactive
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('birthday-card') || 
        e.target.closest('.birthday-card')) {
        createSparkle(e.pageX, e.pageY);
    }
});

function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.textContent = '✨';
    sparkle.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
        font-size: 20px;
        z-index: 9999;
        animation: sparkleFloat 1s ease-out forwards;
    `;
    document.body.appendChild(sparkle);
    
    setTimeout(() => sparkle.remove(), 1000);
}

// Add sparkle animation
const sparkleStyle = document.createElement('style');
sparkleStyle.textContent = `
    @keyframes sparkleFloat {
        0% {
            transform: translate(0, 0) scale(0);
            opacity: 1;
        }
        100% {
            transform: translate(0, -50px) scale(1);
            opacity: 0;
        }
    }
`;
document.head.appendChild(sparkleStyle);

console.log('🎉 Birthday Card Loaded Successfully! 🎉');

// ========================================
// LOCK MODE HELPERS
// ========================================

function applyLockState() {
    if (!LOCK_UNTIL_BIRTHDAY) { unlockCard(); return; }
    const now = new Date();
    if (now >= BIRTHDAY_DATE) {
        unlockCard();
    } else {
        lockCard();
    }
}

function lockCard() {
    const card = document.getElementById('birthdayCard');
    if (!card) return;
    lockedActive = true;
    card.classList.add('locked');
    // Add banner if not present
    if (!document.getElementById('lockBanner')) {
        const banner = document.createElement('div');
        banner.id = 'lockBanner';
        banner.className = 'lock-banner';
        banner.innerHTML = 'Opens at midnight 💫';
        card.appendChild(banner);
    }
}

function unlockCard() {
    const card = document.getElementById('birthdayCard');
    if (!card) return;
    lockedActive = false;
    card.classList.remove('locked');
    const banner = document.getElementById('lockBanner');
    if (banner) banner.remove();
}

function isCardLocked() {
    return lockedActive === true;
}

function showLockedMessage() {
    showMessage('⏳ The surprise unlocks at midnight!');
}

// ========================================
// BALLOONS DECOR
// ========================================

function createBalloons() {
    // Don't create balloons if locked
    if (LOCK_UNTIL_BIRTHDAY) {
        return;
    }
    
    const containerId = 'balloonsContainer';
    let container = document.getElementById(containerId);
    if (!container) {
        container = document.createElement('div');
        container.id = containerId;
        container.className = 'balloons-container';
        document.body.appendChild(container);
    }

    const colors = ['#ff6b6b', '#f093fb', '#f9ca24', '#6c5ce7', '#4ecdc4', '#fd79a8'];
    const spawn = () => {
        const b = document.createElement('div');
        b.className = 'balloon';
        const color = colors[Math.floor(Math.random() * colors.length)];
        b.style.background = color;
        b.style.color = color;
        const left = Math.random() * 100; // viewport width percent
        b.style.left = left + 'vw';
        const duration = Math.random() * 6 + 10; // 10-16s
        const delay = Math.random() * 2; // 0-2s
        b.style.animationDuration = duration + 's, ' + (Math.random() * 2 + 2) + 's';
        b.style.animationDelay = delay + 's, 0s';
        b.style.opacity = '0.9';
        container.appendChild(b);
        setTimeout(() => b.remove(), (duration + delay) * 1000);
    };

    // Initial burst
    for (let i = 0; i < 6; i++) spawn();
    // Continuous gentle spawn
    setInterval(spawn, 1500);
}

// ========================================
// GALLERY LIGHTBOX
// ========================================

function setupGalleryLightbox() {
    const grid = document.querySelector('.gallery-grid');
    if (!grid) return;

    // Gather images and set data-index
    const images = Array.from(grid.querySelectorAll('img'));
    images.forEach((img, idx) => img.dataset.index = String(idx));

    grid.addEventListener('click', (e) => {
        const img = e.target.closest('img');
        if (!img || !img.src) return;
        const startIndex = parseInt(img.dataset.index || '0', 10);
        openLightboxWithList(images, startIndex);
    });
}

function openLightboxWithList(imageList, startIndex) {
    let current = startIndex;
    const overlay = document.createElement('div');
    overlay.className = 'image-lightbox';
    overlay.innerHTML = `
        <button class="lightbox-close" aria-label="Close">Close ✕</button>
        <button class="lightbox-prev" aria-label="Previous">◀</button>
        <img alt="Photo">
        <button class="lightbox-next" aria-label="Next">▶</button>
    `;

    const imgEl = overlay.querySelector('img');
    const closeBtn = overlay.querySelector('.lightbox-close');
    const prevBtn = overlay.querySelector('.lightbox-prev');
    const nextBtn = overlay.querySelector('.lightbox-next');

    const show = (index) => {
        if (index < 0) index = imageList.length - 1;
        if (index >= imageList.length) index = 0;
        current = index;
        const src = imageList[current].src;
        const alt = imageList[current].alt || 'Photo';
        imgEl.src = src;
        imgEl.alt = alt;
    };

    const close = () => {
        overlay.style.animation = 'fadeOutOverlay 0.2s ease forwards';
        overlay.addEventListener('animationend', () => overlay.remove(), { once: true });
        document.removeEventListener('keydown', onKey);
    };

    const onKey = (ev) => {
        if (ev.key === 'Escape') close();
        if (ev.key === 'ArrowLeft') show(current - 1);
        if (ev.key === 'ArrowRight') show(current + 1);
    };

    // Click handlers
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay || e.target.classList.contains('lightbox-close')) close();
    });
    prevBtn.addEventListener('click', (e) => { e.stopPropagation(); show(current - 1); });
    nextBtn.addEventListener('click', (e) => { e.stopPropagation(); show(current + 1); });

    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    overlay.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    overlay.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const dx = touchEndX - touchStartX;
        if (Math.abs(dx) > 40) {
            if (dx > 0) show(current - 1); else show(current + 1);
        }
    });

    document.body.appendChild(overlay);
    document.addEventListener('keydown', onKey);
    show(current);
}

// ========================================
// GALLERY FALLBACKS (OFFLINE-SAFE)
// ========================================

function addGalleryFallbacks() {
        const grid = document.querySelector('.gallery-grid');
        if (!grid) return;
        const imgs = grid.querySelectorAll('img');

        // Simple elegant SVG placeholder that works offline
        const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='800'>
            <defs>
                <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
                    <stop offset='0%' stop-color='#a8edea'/>
                    <stop offset='100%' stop-color='#fed6e3'/>
                </linearGradient>
            </defs>
            <rect width='100%' height='100%' fill='url(#g)'/>
            <g fill='rgba(0,0,0,0.35)'>
                <circle cx='400' cy='360' r='140'/>
                <rect x='260' y='360' width='280' height='180' rx='18' ry='18'/>
            </g>
            <text x='50%' y='92%' dominant-baseline='middle' text-anchor='middle'
                        font-family='Segoe UI, Arial' font-size='36' fill='rgba(0,0,0,0.55)'>Add your photo</text>
        </svg>`;
        const FALLBACK_IMG = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);

        imgs.forEach((img) => {
                img.setAttribute('loading', 'lazy');
                const onError = () => {
                        if (img.dataset.fallbackApplied === '1') return;
                        img.dataset.fallbackApplied = '1';
                        img.src = FALLBACK_IMG;
                };
                img.addEventListener('error', onError, { passive: true });
                // In case src is empty or badly named, force error
                if (!img.getAttribute('src')) onError();
        });
}

    // ========================================
    // GALLERY: OPTIMIZE LAYOUT FOR SINGLE PHOTO
    // ========================================

    function optimizeGalleryLayout() {
        const grid = document.querySelector('.gallery-grid');
        if (!grid) return;
        const slots = Array.from(grid.querySelectorAll('.photo-slot'));
        const imgs = slots.map(slot => slot.querySelector('img')).filter(Boolean);
        // Treat .svg placeholders as not real; real photos likely .jpg/.jpeg/.png/.webp
        const real = imgs.filter(img => !/\.svg(\?|$)/i.test((img.getAttribute('src') || '')));

        if (real.length === 1) {
            // Keep only the slot that contains the real image
            const keepImg = real[0];
            const keepSlot = keepImg.closest('.photo-slot');
            slots.forEach(slot => { if (slot !== keepSlot) slot.style.display = 'none'; });
            // Make it wide and center stage
            grid.classList.add('single');
            keepSlot.classList.add('single-wide');
            // Reindex lightbox to only include the single image
            keepImg.dataset.index = '0';
            // Update note if present
            const note = document.querySelector('.gallery-note');
            if (note) note.textContent = '💡 Tip: You can add more photos later — this one already looks perfect!';
        } else {
            // Reindex all in case of mixed replacements
            imgs.forEach((img, idx) => img.dataset.index = String(idx));
        }
    }

        // ========================================
        // MUSIC: PLAY ON OPEN WITH FALLBACK
        // ========================================

        let fallbackAudioCtx = null;

        function playBirthdaySongOnOpen() {
            // Always try fallback first since it's more reliable
            playHappyBirthdayMelodyFallback();
            
            // Also try the audio file if it exists
            const audio = document.getElementById('birthdaySong');
            if (audio) {
                audio.currentTime = 0;
                audio.volume = 0.0;
                audio.play()
                    .then(() => {
                        isPlaying = true;
                        fadeAudio(audio, 0.9, 1500);
                        console.log('Audio file playing');
                    })
                    .catch((err) => {
                        console.log('Audio file not available, using fallback melody');
                    });
            }
        }

        // Simple Web Audio "Happy Birthday" melody as a fallback (public-domain tune)
        function playHappyBirthdayMelodyFallback() {
            console.log('playHappyBirthdayMelodyFallback called!');
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                console.log('AudioContext created:', audioContext.state);
                
                // Resume context if suspended (required for autoplay policy)
                if (audioContext.state === 'suspended') {
                    audioContext.resume().then(() => {
                        console.log('AudioContext resumed');
                    });
                }
                
                const now = audioContext.currentTime;
                
                // Full Happy Birthday melody (G major)
                const melody = [
                    // Line 1: Happy birthday to you
                    { freq: 392, dur: 0.4 },   // G
                    { freq: 392, dur: 0.4 },   // G
                    { freq: 440, dur: 0.8 },   // A
                    { freq: 392, dur: 0.8 },   // G
                    { freq: 523, dur: 0.8 },   // C
                    { freq: 494, dur: 1.2 },   // B
                    // Line 2: Happy birthday to you
                    { freq: 392, dur: 0.4 },   // G
                    { freq: 392, dur: 0.4 },   // G
                    { freq: 440, dur: 0.8 },   // A
                    { freq: 392, dur: 0.8 },   // G
                    { freq: 587, dur: 0.8 },   // D
                    { freq: 523, dur: 1.2 },   // C
                    // Line 3: Happy birthday dear [Name]
                    { freq: 392, dur: 0.4 },   // G
                    { freq: 392, dur: 0.4 },   // G
                    { freq: 784, dur: 0.8 },   // G (octave)
                    { freq: 659, dur: 0.8 },   // E
                    { freq: 523, dur: 0.8 },   // C
                    { freq: 494, dur: 0.8 },   // B
                    { freq: 440, dur: 1.2 },   // A
                    // Line 4: Happy birthday to you
                    { freq: 698, dur: 0.4 },   // F
                    { freq: 698, dur: 0.4 },   // F
                    { freq: 659, dur: 0.8 },   // E
                    { freq: 523, dur: 0.8 },   // C
                    { freq: 587, dur: 0.8 },   // D
                    { freq: 523, dur: 1.6 },   // C
                ];
                
                let time = 0;
                melody.forEach(note => {
                    const oscillator = audioContext.createOscillator();
                    const gainNode = audioContext.createGain();
                    
                    oscillator.type = 'sine';
                    oscillator.frequency.value = note.freq;
                    
                    gainNode.gain.setValueAtTime(0, now + time);
                    gainNode.gain.linearRampToValueAtTime(0.4, now + time + 0.01);
                    gainNode.gain.linearRampToValueAtTime(0.4, now + time + note.dur - 0.01);
                    gainNode.gain.linearRampToValueAtTime(0, now + time + note.dur);
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(audioContext.destination);
                    
                    oscillator.start(now + time);
                    oscillator.stop(now + time + note.dur);
                    
                    time += note.dur;
                });
                
                console.log('Melody scheduled to play for', time, 'seconds');
                
                // Cleanup
                setTimeout(() => {
                    try { audioContext.close(); } catch(e) {}
                }, (time + 1) * 1000);
                
            } catch (e) {
                console.error('Melody failed:', e);
            }
        }

        // Upbeat Afrobeat Celebration using Web Audio (fallback if mp3 unavailable)
        function playAfrobeatCelebration() {
            try {
                if (fallbackAudioCtx) return;
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                fallbackAudioCtx = ctx;

                const now = ctx.currentTime;
                const beatDur = 0.35; // ~170 BPM afrobeat tempo
                const barLen = beatDur * 4;

                // Upbeat bass line (repeating 4-beat pattern)
                const bassPat = [82, 0, 55, 0, 82, 0, 123, 0]; // Hz approx
                const playBass = (start, dur) => {
                    const freq = bassPat[(Math.floor((start - now) / beatDur) * 2) % bassPat.length] || 82;
                    if (freq === 0) return;
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'sine';
                    osc.frequency.value = freq;
                    gain.gain.value = 0.0001;
                    osc.connect(gain).connect(ctx.destination);
                    gain.gain.setValueAtTime(0.0001, start);
                    gain.gain.linearRampToValueAtTime(0.08, start + 0.05);
                    gain.gain.linearRampToValueAtTime(0.0001, start + dur);
                    osc.start(start);
                    osc.stop(start + dur);
                };

                // Drum hits: kick (low 150Hz pulse), snare (noise burst)
                const playKick = (start, dur) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(150, start);
                    osc.frequency.exponentialRampToValueAtTime(50, start + dur);
                    gain.gain.setValueAtTime(0.15, start);
                    gain.gain.linearRampToValueAtTime(0.0001, start + dur);
                    osc.connect(gain).connect(ctx.destination);
                    osc.start(start);
                    osc.stop(start + dur);
                };

                const playSnare = (start, dur) => {
                    const bufferLen = ctx.sampleRate * dur;
                    const buffer = ctx.createBuffer(1, bufferLen, ctx.sampleRate);
                    const data = buffer.getChannelData(0);
                    for (let i = 0; i < bufferLen; i++) {
                        data[i] = (Math.random() - 0.5) * 2 * Math.exp(-i / (ctx.sampleRate * dur * 0.1));
                    }
                    const src = ctx.createBufferSource();
                    src.buffer = buffer;
                    const gain = ctx.createGain();
                    gain.gain.setValueAtTime(0.12, start);
                    gain.gain.linearRampToValueAtTime(0.0001, start + dur);
                    src.connect(gain).connect(ctx.destination);
                    src.start(start);
                };

                // 8-bar celebratory loop (plays 2x ~ 22 seconds total)
                for (let bar = 0; bar < 16; bar++) {
                    const barTime = now + bar * barLen;

                    // Kick on beats 1, 3 (and syncopated)
                    playKick(barTime, 0.08);
                    playKick(barTime + beatDur * 2, 0.08);
                    if (bar % 2 === 0) playKick(barTime + beatDur * 3.5, 0.06);

                    // Snare on 2, 4
                    playSnare(barTime + beatDur, 0.08);
                    playSnare(barTime + beatDur * 3, 0.08);

                    // Bass notes
                    for (let beat = 0; beat < 4; beat++) {
                        playBass(barTime + beat * beatDur, beatDur * 0.9);
                    }

                    // Melodic lead (high synth stabs): celebratory notes
                    if (bar % 2 === 0) {
                        const leadFreqs = [440, 494, 523, 587]; // A4, B4, C5, D5
                        const leadFreq = leadFreqs[bar % 4];
                        const osc = ctx.createOscillator();
                        const gain = ctx.createGain();
                        osc.type = 'triangle';
                        osc.frequency.value = leadFreq;
                        gain.gain.setValueAtTime(0.0001, barTime);
                        gain.gain.linearRampToValueAtTime(0.12, barTime + 0.05);
                        gain.gain.linearRampToValueAtTime(0.08, barTime + beatDur * 0.8);
                        gain.gain.linearRampToValueAtTime(0.0001, barTime + beatDur);
                        osc.connect(gain).connect(ctx.destination);
                        osc.start(barTime);
                        osc.stop(barTime + beatDur);
                    }
                }

                // Clean up after ~22 seconds
                setTimeout(() => {
                    try { ctx.close(); } catch(e) {}
                    fallbackAudioCtx = null;
                }, 22500);
            } catch (e) {
                console.warn('Afrobeat fallback failed', e);
            }
        }

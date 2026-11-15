/* =========================================================
   AKSHUU ROYAL DIGITAL WORLD — INTERACTIVE ENGINE
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.getElementById('preloader');
    const pages = document.querySelectorAll('.page');
    const navDots = document.querySelectorAll('.nav-dot');
    const enterBtn = document.getElementById('enter-btn');
    const replayBtn = document.getElementById('replay-btn');
    const nextBtns = document.querySelectorAll('.next-page-btn');
    const bgMusic = document.getElementById('bg-music');

    let currentPageId = 'page-1';
    let isFinaleMode = false;
    let typewriterStarted = false;
    let typewriterTimeouts = [];

    /* =====================================================
       1. GOLDEN PARTICLE ENGINE (HTML5 CANVAS)
       ===================================================== */
    const canvas = document.getElementById('gold-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = window.innerWidth < 768 ? 55 : 95;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class GoldParticle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2.4 + 0.6;
            this.speedX = (Math.random() - 0.5) * 0.45;
            this.speedY = -(Math.random() * 0.55 + 0.15); // Gentle upward royal drift
            this.alpha = Math.random() * 0.75 + 0.15;
            this.pulseSpeed = Math.random() * 0.02 + 0.005;
            this.pulseAngle = Math.random() * Math.PI * 2;
            const tones = ['#fff3b8', '#f3d06b', '#d4af37', '#c59b27'];
            this.color = tones[Math.floor(Math.random() * tones.length)];
        }

        update() {
            if (isFinaleMode) {
                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;
                const dx = centerX - this.x;
                const dy = centerY - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const targetRadius = Math.min(canvas.width, canvas.height) * 0.34;

                if (dist > targetRadius) {
                    this.x += dx * 0.012;
                    this.y += dy * 0.012;
                } else {
                    const angle = Math.atan2(dy, dx) + 0.012;
                    this.x += Math.cos(angle) * 0.6;
                    this.y += Math.sin(angle) * 0.6;
                }
            } else {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.y < -10) {
                    this.y = canvas.height + 10;
                    this.x = Math.random() * canvas.width;
                }
                if (this.x < -10) this.x = canvas.width + 10;
                if (this.x > canvas.width + 10) this.x = -10;
            }

            this.pulseAngle += this.pulseSpeed;
            this.currentAlpha = this.alpha + Math.sin(this.pulseAngle) * 0.2;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = Math.max(0.05, Math.min(1, this.currentAlpha));
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#d4af37';
            ctx.fill();
            ctx.restore();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new GoldParticle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let p of particles) {
            p.update();
            p.draw();
        }
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    /* =====================================================
       2. CINEMATIC PAGE TRANSITIONS & REVEAL SEQUENCER
       ===================================================== */
    function triggerPageReveals(pageElement) {
        const items = pageElement.querySelectorAll('.reveal-item');
        items.forEach(item => {
            item.classList.remove('revealed');
            const delay = parseInt(item.getAttribute('data-delay') || '0', 10);
            setTimeout(() => {
                if (pageElement.classList.contains('active')) {
                    item.classList.add('revealed');
                }
            }, delay);
        });
    }

    function navigateToPage(targetId) {
        if (targetId === currentPageId && document.getElementById(targetId).classList.contains('active')) {
            return;
        }

        isFinaleMode = (targetId === 'page-5');

        pages.forEach(page => {
            page.classList.remove('active');
            page.scrollTop = 0;
        });

        navDots.forEach(dot => {
            dot.classList.toggle('active', dot.getAttribute('data-target') === targetId);
        });

        const targetPage = document.getElementById(targetId);
        if (targetPage) {
            targetPage.classList.add('active');
            currentPageId = targetId;
            triggerPageReveals(targetPage);

            if (targetId === 'page-3') {
                startTypewriterSequence();
            }
        }
    }

    /* =====================================================
       3. PAGE 3 — TYPEWRITER MESSAGE ENGINE
       ===================================================== */
    const specialMessages = [
        "Life mein sab log special nahi hote, kuch log naturally alag hote hain.",
        "Your smile is your biggest beauty, so never stop smiling.",
        "Khud ko kabhi kisi se compare mat karna, because you are one of a kind.",
        "Always stay happy, stay confident and keep shining."
    ];

    function clearTypewriter() {
        typewriterTimeouts.forEach(id => clearTimeout(id));
        typewriterTimeouts = [];
        typewriterStarted = false;
    }

    function startTypewriterSequence() {
        if (typewriterStarted) return;
        typewriterStarted = true;

        const container = document.getElementById('typewriter-container');
        const cursor = document.getElementById('typing-cursor');
        const nextBtnWrap = document.getElementById('page-3-next');

        container.innerHTML = '';
        cursor.style.display = 'inline-block';
        nextBtnWrap.style.opacity = '0';
        nextBtnWrap.style.pointerEvents = 'none';

        let lineIndex = 0;
        let charIndex = 0;
        let currentP = null;

        function typeNextChar() {
            if (currentPageId !== 'page-3') return;

            if (lineIndex >= specialMessages.length) {
                cursor.style.display = 'none';
                nextBtnWrap.style.opacity = '1';
                nextBtnWrap.style.pointerEvents = 'auto';
                return;
            }

            if (charIndex === 0) {
                currentP = document.createElement('p');
                container.appendChild(currentP);
            }

            const currentLine = specialMessages[lineIndex];
            currentP.textContent += currentLine.charAt(charIndex);
            charIndex++;

            if (charIndex < currentLine.length) {
                const t = setTimeout(typeNextChar, 34);
                typewriterTimeouts.push(t);
            } else {
                lineIndex++;
                charIndex = 0;
                const pause = setTimeout(typeNextChar, 650);
                typewriterTimeouts.push(pause);
            }
        }

        const initialDelay = setTimeout(typeNextChar, 950);
        typewriterTimeouts.push(initialDelay);
    }

    /* =====================================================
       4. EVENT LISTENERS & INITIALIZATION
       ===================================================== */
    enterBtn.addEventListener('click', () => {
        // Play background music (akshu.mp3) smoothly on click
        if (bgMusic) {
            bgMusic.volume = 0.8;
            bgMusic.play().catch(err => {
                console.log("Audio autoplay prevented by browser:", err);
            });
        }
        navigateToPage('page-2');
    });

    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const nextId = btn.getAttribute('data-next');
            if (nextId) navigateToPage(nextId);
        });
    });

    navDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const targetId = dot.getAttribute('data-target');
            if (targetId) navigateToPage(targetId);
        });
    });

    replayBtn.addEventListener('click', () => {
        clearTypewriter();
        isFinaleMode = false;
        initParticles();
        navigateToPage('page-1');
        triggerPageReveals(document.getElementById('page-1'));
    });

    // Dismiss Preloader and Begin Royal Intro
    setTimeout(() => {
        preloader.classList.add('fade-out');
        triggerPageReveals(document.getElementById('page-1'));
    }, 1500);
});

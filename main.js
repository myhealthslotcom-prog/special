import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initParticles } from './particles.js';

gsap.registerPlugin(ScrollTrigger);
initParticles();

const introTl = gsap.timeline();
introTl.from('.title-main', { y: 50, opacity: 0, duration: 1.5, ease: 'power4.out', delay: 0.5 })
.from('.decorative-line', { scaleX: 0, duration: 1, ease: 'power2.out' }, "-=1")
.from('.subtitle-main', { y: 30, opacity: 0, duration: 1, ease: 'power3.out' }, "-=0.5")
.from('.luxury-corner', { opacity: 0, scale: 0.8, duration: 1, stagger: 0.2 }, "-=1")
.from('.scroll-indicator', { opacity: 0, duration: 1 }, "-=0.5");

// Mobile vs Desktop Scroll Animations
let mm = gsap.matchMedia();

// DESKTOP: Elegant, parallax-style scrub animations
mm.add("(min-width: 769px)", () => {
  // Magic Garden Blooming (Now targeting real-flower images instead of SVG petals)
  gsap.from('.real-flower', { scrollTrigger: { trigger: '.magic-garden', start: 'top 80%', end: 'center center', scrub: 1 }, y: 150, opacity: 0, scale: 0.5, stagger: 0.2 });
  gsap.from('.magic-garden .section-title', { scrollTrigger: { trigger: '.magic-garden', start: 'top center', end: 'center center', scrub: 1 }, y: 50, opacity: 0, scale: 0.9 });
  
  gsap.from('.cake-container', { scrollTrigger: { trigger: '.celebration-section', start: 'top 70%', end: 'center center', scrub: 1 }, y: 150, scale: 0.5, opacity: 0 });
  gsap.from('.balloon-wrapper', { scrollTrigger: { trigger: '.celebration-section', start: 'top 70%', end: 'center center', scrub: 1 }, y: 300, opacity: 0, stagger: 0.1, rotation: () => Math.random() * 20 - 10 });
  gsap.from('.spark-text', { scrollTrigger: { trigger: '.celebration-section', start: 'top 50%', end: 'center center', scrub: 1 }, opacity: 0, y: 50 });
  
  gsap.from('.gift-box', { 
    scrollTrigger: { 
      trigger: '.letter-section', 
      start: 'top 65%', 
      toggleActions: 'play none none reverse'
    }, 
    y: 150, 
    scale: 0.5, 
    opacity: 0, 
    rotation: -10,
    duration: 1.2,
    ease: "elastic.out(1, 0.5)"
  });

  gsap.from('.finale-title', { scrollTrigger: { trigger: '.finale-section', start: 'top 80%', end: 'center center', scrub: 1 }, scale: 0.8, opacity: 0, y: 100 });
  gsap.from('.gold-line', { scrollTrigger: { trigger: '.finale-section', start: 'top 75%', end: 'center center', scrub: 1 }, scaleX: 0, opacity: 0 });
  gsap.from('.finale-subtitle, .finale-sparkles', { scrollTrigger: { trigger: '.finale-section', start: 'top 70%', end: 'center center', scrub: 1 }, opacity: 0, y: 50, stagger: 0.2 });
});


// Balloons Popping Interaction with Confetti
const balloons = document.querySelectorAll('.balloon');
const confettiContainer = document.getElementById('confetti-container');

balloons.forEach(balloon => {
  balloon.addEventListener('click', function(e) {
    gsap.to(this, { scale: 1.5, opacity: 0, duration: 0.1, onComplete: () => { this.style.display = 'none'; } });

    const rect = this.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const colors = ['#e5b76b', '#fbf5b7', '#ffffff', '#8a2444', '#f0e6d2'];

    for (let i = 0; i < 40; i++) {
      const conf = document.createElement('div');
      conf.classList.add('confetti-piece');
      conf.style.left = `${x}px`;
      conf.style.top = `${y}px`;
      conf.style.background = colors[Math.floor(Math.random() * colors.length)];
      confettiContainer.appendChild(conf);

      const angle = Math.random() * Math.PI * 2;
      const velocity = 50 + Math.random() * 150;
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity - (100 + Math.random() * 100);

      gsap.to(conf, { x: tx, y: ty + 400, rotation: Math.random() * 720, opacity: 0, duration: 1 + Math.random(), ease: "power1.inOut", onComplete: () => conf.remove() });
    }
  });
});

// Interactive Unwrapping & Book Reveal
const giftBox = document.querySelector('.gift-box');
const letterContainer = document.querySelector('.letter-container');

if (giftBox) {
  giftBox.addEventListener('click', () => {
    giftBox.style.pointerEvents = 'none'; // Prevent double clicks
    
    // 1. Shake animation and intense glow
    gsap.to('.gift-box', {
      rotation: 5,
      boxShadow: '0 0 100px 30px rgba(229,183,107,0.8)',
      yoyo: true,
      repeat: 3,
      duration: 0.15,
      onComplete: () => {
        // 2. Explode lid with aggressive physics
        gsap.to('.gift-lid', { y: -400, x: 120, rotation: 80, opacity: 0, duration: 1.2, ease: "power4.out" });
        gsap.to('.gift-bow', { y: -500, x: -100, rotation: -90, opacity: 0, duration: 1.2, ease: "power4.out" });
        
        // 3. Fade box out
        gsap.to('.gift-box', { scale: 0.8, opacity: 0, duration: 1, delay: 0.2, onComplete: () => { giftBox.style.display = 'none'; } });
        
        // 4. Book pops out powerfully
        gsap.fromTo(letterContainer, 
          { y: 150, opacity: 0, scale: 0.3, rotationX: 45 },
          { y: 0, opacity: 1, scale: 1, rotationX: 0, duration: 1.8, delay: 0.4, ease: "elastic.out(1, 0.6)", onComplete: () => { letterContainer.classList.add('revealed'); } }
        );

        // 5. Fire massive confetti!
        const rect = giftBox.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        const colors = ['#e5b76b', '#fbf5b7', '#ffffff', '#8a2444', '#f0e6d2'];

        for (let i = 0; i < 100; i++) {
          const conf = document.createElement('div');
          conf.classList.add('confetti-piece');
          conf.style.left = `${x}px`;
          conf.style.top = `${y}px`;
          conf.style.background = colors[Math.floor(Math.random() * colors.length)];
          confettiContainer.appendChild(conf);

          const angle = Math.random() * Math.PI * 2;
          const velocity = 200 + Math.random() * 400;
          const tx = Math.cos(angle) * velocity;
          const ty = Math.sin(angle) * velocity - (300 + Math.random() * 300);

          gsap.to(conf, { x: tx, y: ty + 1000, rotation: Math.random() * 720, opacity: 0, duration: 2 + Math.random() * 1.5, ease: "power1.inOut", onComplete: () => conf.remove() });
        }
      }
    });
  });
}

// 3D Book Page Turning Logic
const pages = document.querySelectorAll('.page');
const book = document.querySelector('.book');

pages.forEach((page, index) => {
  page.addEventListener('click', () => {
    // If clicking the cover
    if (index === 0) {
      if (!page.classList.contains('flipped')) {
        book.classList.add('open');
      } else {
        book.classList.remove('open');
      }
    }
    
    page.classList.toggle('flipped');
    
    // Manage z-indexes dynamically so pages stack over each other cleanly during flip
    if (page.classList.contains('flipped')) {
      setTimeout(() => { page.style.zIndex = index + 1; }, 500); 
    } else {
      setTimeout(() => { page.style.zIndex = pages.length - index + 2; }, 500);
    }
  });
});

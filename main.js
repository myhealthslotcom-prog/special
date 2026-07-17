import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initParticles } from './particles.js';

// Register GSAP Plugin
gsap.registerPlugin(ScrollTrigger);

// Initialize 3D Particles
initParticles();

// --- GSAP Animations ---

// 1. Intro Animation
const introTl = gsap.timeline();
introTl.from('.title-main', {
  y: 50,
  opacity: 0,
  duration: 1.5,
  ease: 'power4.out',
  delay: 0.5
})
.from('.subtitle-main', {
  y: 30,
  opacity: 0,
  duration: 1,
  ease: 'power3.out'
}, "-=1")
.from('.scroll-indicator', {
  opacity: 0,
  duration: 1
}, "-=0.5");

// 2. Scroll Animations
// Magic Garden
gsap.from('.magic-garden .section-title', {
  scrollTrigger: {
    trigger: '.magic-garden',
    start: 'top center',
    end: 'center center',
    scrub: 1
  },
  y: 100,
  opacity: 0,
  scale: 0.9
});

// Celebration (Cake)
gsap.from('.cake-visual', {
  scrollTrigger: {
    trigger: '.celebration-section',
    start: 'top 70%',
    end: 'center center',
    scrub: 1
  },
  y: 150,
  scale: 0.5,
  rotation: -10,
  opacity: 0
});

gsap.from('.spark-text', {
  scrollTrigger: {
    trigger: '.celebration-section',
    start: 'top 50%',
    end: 'center center',
    scrub: 1
  },
  opacity: 0,
  y: 50,
});

// Balloons floating up on scroll
gsap.from('.balloon', {
  scrollTrigger: {
    trigger: '.celebration-section',
    start: 'top 70%',
    end: 'center center',
    scrub: 1
  },
  y: 300,
  stagger: 0.1,
  opacity: 0,
  rotation: () => Math.random() * 20 - 10
});

// Balloons Popping Interaction
const balloons = document.querySelectorAll('.balloon');
balloons.forEach(balloon => {
  balloon.addEventListener('click', function() {
    gsap.to(this, {
      scale: 1.5,
      opacity: 0,
      duration: 0.2,
      onComplete: () => {
        this.style.display = 'none';
        
        // Add a small pop particle effect at mouse position
        const pop = document.createElement('div');
        pop.textContent = '💥';
        pop.style.position = 'absolute';
        const rect = this.getBoundingClientRect();
        pop.style.left = (rect.left + window.scrollX) + 'px';
        pop.style.top = (rect.top + window.scrollY) + 'px';
        pop.style.fontSize = '3rem';
        pop.style.pointerEvents = 'none';
        document.body.appendChild(pop);
        
        gsap.to(pop, {
          y: -50,
          opacity: 0,
          duration: 1,
          onComplete: () => pop.remove()
        });
      }
    });
  });
});

// Gift box scroll animation
gsap.from('.gift-box', {
  scrollTrigger: {
    trigger: '.letter-section',
    start: 'top 70%',
    end: 'center center',
    scrub: 1
  },
  y: 100,
  scale: 0.5,
  opacity: 0,
  rotation: 10
});

// Interactive Unwrapping
const giftBox = document.querySelector('.gift-box');
const letterContainer = document.querySelector('.letter-container');

if (giftBox) {
  giftBox.addEventListener('click', () => {
    // 1. Pop the lid off
    gsap.to('.gift-lid', {
      y: -200,
      x: 100,
      rotation: 45,
      opacity: 0,
      duration: 1.2,
      ease: "power2.out"
    });
    
    // 2. Fade/shrink the box itself
    gsap.to('.gift-box', {
      opacity: 0,
      scale: 0.6,
      duration: 1,
      delay: 0.3,
      onComplete: () => {
        giftBox.style.pointerEvents = 'none';
      }
    });
    
    // 3. Bring the letter up and reveal it
    gsap.to(letterContainer, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 1.5,
      delay: 0.6,
      ease: "back.out(1.5)",
      onComplete: () => {
        letterContainer.classList.add('revealed');
      }
    });
  });
}

// Finale
gsap.from('.finale-title', {
  scrollTrigger: {
    trigger: '.finale-section',
    start: 'top 80%',
    end: 'center center',
    scrub: 1
  },
  scale: 0.8,
  opacity: 0,
  y: 100
});
gsap.from('.finale-subtitle', {
  scrollTrigger: {
    trigger: '.finale-section',
    start: 'top 70%',
    end: 'center center',
    scrub: 1
  },
  opacity: 0,
  y: 50
});

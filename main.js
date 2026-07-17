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
.from('.decorative-line', {
  scaleX: 0,
  duration: 1,
  ease: 'power2.out'
}, "-=1")
.from('.subtitle-main', {
  y: 30,
  opacity: 0,
  duration: 1,
  ease: 'power3.out'
}, "-=0.5")
.from('.luxury-corner', {
  opacity: 0,
  scale: 0.8,
  duration: 1,
  stagger: 0.2
}, "-=1")
.from('.scroll-indicator', {
  opacity: 0,
  duration: 1
}, "-=0.5");

// 2. Scroll Animations
// Magic Garden
gsap.from('.floating-flower', {
  scrollTrigger: {
    trigger: '.magic-garden',
    start: 'top 80%',
    end: 'center center',
    scrub: 1
  },
  y: 100,
  opacity: 0,
  scale: 0.5,
  stagger: 0.1
});

gsap.from('.magic-garden .section-title', {
  scrollTrigger: {
    trigger: '.magic-garden',
    start: 'top center',
    end: 'center center',
    scrub: 1
  },
  y: 50,
  opacity: 0,
  scale: 0.9
});

// Celebration (Cake & Balloons)
gsap.from('.cake-container', {
  scrollTrigger: {
    trigger: '.celebration-section',
    start: 'top 70%',
    end: 'center center',
    scrub: 1
  },
  y: 150,
  scale: 0.5,
  opacity: 0
});

gsap.from('.balloon-wrapper', {
  scrollTrigger: {
    trigger: '.celebration-section',
    start: 'top 70%',
    end: 'center center',
    scrub: 1
  },
  y: 300,
  opacity: 0,
  stagger: 0.1,
  rotation: () => Math.random() * 20 - 10
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

// Balloons Popping Interaction with Confetti
const balloons = document.querySelectorAll('.balloon');
const confettiContainer = document.getElementById('confetti-container');

balloons.forEach(balloon => {
  balloon.addEventListener('click', function(e) {
    // Pop animation
    gsap.to(this, {
      scale: 1.5,
      opacity: 0,
      duration: 0.1,
      onComplete: () => {
        this.style.display = 'none';
      }
    });

    // Spawn Confetti Burst
    const rect = this.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const colors = ['#d4af37', '#d88fa7', '#ffffff', '#ffb6c1', '#f3e5ab'];

    for (let i = 0; i < 40; i++) {
      const conf = document.createElement('div');
      conf.classList.add('confetti-piece');
      conf.style.left = `${x}px`;
      conf.style.top = `${y}px`;
      conf.style.background = colors[Math.floor(Math.random() * colors.length)];
      confettiContainer.appendChild(conf);

      // Random burst physics
      const angle = Math.random() * Math.PI * 2;
      const velocity = 50 + Math.random() * 150;
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity - (100 + Math.random() * 100);

      gsap.to(conf, {
        x: tx,
        y: ty + 400, // fall down after burst
        rotation: Math.random() * 720,
        opacity: 0,
        duration: 1 + Math.random(),
        ease: "power1.inOut",
        onComplete: () => conf.remove()
      });
    }
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
      y: -150,
      x: 80,
      rotation: 35,
      opacity: 0,
      duration: 1.2,
      ease: "power2.out"
    });
    
    // Animate the bow flying off
    gsap.to('.gift-bow', {
      y: -200,
      rotation: -45,
      opacity: 0,
      duration: 1,
      ease: "power2.out"
    });
    
    // 2. Fade/shrink the box itself
    gsap.to('.gift-box', {
      opacity: 0,
      scale: 0.7,
      duration: 1,
      delay: 0.4,
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
      delay: 0.7,
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
gsap.from('.gold-line', {
  scrollTrigger: {
    trigger: '.finale-section',
    start: 'top 75%',
    end: 'center center',
    scrub: 1
  },
  scaleX: 0,
  opacity: 0
});
gsap.from('.finale-subtitle, .finale-sparkles', {
  scrollTrigger: {
    trigger: '.finale-section',
    start: 'top 70%',
    end: 'center center',
    scrub: 1
  },
  opacity: 0,
  y: 50,
  stagger: 0.2
});

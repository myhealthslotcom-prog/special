import * as THREE from 'three';

export function initParticles() {
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  // Soft ambient fog
  scene.fog = new THREE.FogExp2(0xfdfaf6, 0.002);

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;

  const isMobile = window.innerWidth < 768;
  
  // Disable antialias for performance, clamp pixel ratio
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 2));

  // Circular bokeh texture
  const circleCanvas = document.createElement('canvas');
  circleCanvas.width = 32;
  circleCanvas.height = 32;
  const ctx = circleCanvas.getContext('2d');
  const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.2, 'rgba(255,255,255,0.8)');
  gradient.addColorStop(0.6, 'rgba(255,255,255,0.2)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0,0,32,32);
  const particleTexture = new THREE.CanvasTexture(circleCanvas);

  const particlesMaterial = new THREE.PointsMaterial({
    size: isMobile ? 0.9 : 0.6, // slightly larger on mobile since we have fewer
    map: particleTexture,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending, // Makes overlapping particles glow
    depthWrite: false
  });

  // Helper to create a swarm mesh
  function createSwarm(count) {
    const geometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(count * 3);
    const colorsArray = new Float32Array(count * 3);
    
    const color1 = new THREE.Color(0xd4af37); // Rich gold
    const color2 = new THREE.Color(0xf3e5ab); // Champagne
    const color3 = new THREE.Color(0xffffff); // White sparkle

    for(let i = 0; i < count * 3; i+=3) {
      posArray[i] = (Math.random() - 0.5) * 120; // x spread
      posArray[i+1] = (Math.random() - 0.5) * 120; // y spread
      posArray[i+2] = (Math.random() - 0.5) * 60; // z spread

      const rColors = [color1, color2, color3];
      const pickedColor = rColors[Math.floor(Math.random() * rColors.length)];
      colorsArray[i] = pickedColor.r;
      colorsArray[i+1] = pickedColor.g;
      colorsArray[i+2] = pickedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));
    
    return new THREE.Points(geometry, particlesMaterial);
  }

  // Create two distinct swarms for complex motion without CPU looping
  // drastically reduce count on mobile for max frame rate
  const swarm1 = createSwarm(isMobile ? 300 : 1000);
  const swarm2 = createSwarm(isMobile ? 300 : 1000);
  
  scene.add(swarm1);
  scene.add(swarm2);

  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  document.addEventListener('mousemove', (event) => {
    if (isMobile) return; // Skip mouse parallax calculation on mobile touch for perf
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
  });

  let scrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
  });

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    if (!isMobile) {
      targetX = mouseX * 0.001;
      targetY = mouseY * 0.001;
    }

    // Swarm 1: Rotates one way, drifts
    swarm1.rotation.y += 0.002;
    swarm1.rotation.x += 0.001;
    swarm1.rotation.z = Math.sin(elapsedTime * 0.3) * 0.1;
    swarm1.position.y = scrollY * 0.005 + Math.sin(elapsedTime * 0.4) * 2;

    // Swarm 2: Rotates opposite way, different drift
    swarm2.rotation.y -= 0.0015;
    swarm2.rotation.x -= 0.001;
    swarm2.rotation.z = Math.cos(elapsedTime * 0.2) * 0.1;
    swarm2.position.y = scrollY * 0.007 + Math.cos(elapsedTime * 0.3) * 3;

    // Snappier Parallax reacting to mouse (Desktop only)
    if (!isMobile) {
      swarm1.rotation.y += 0.05 * (targetX - swarm1.rotation.y);
      swarm1.rotation.x += 0.05 * (targetY - swarm1.rotation.x);
      swarm2.rotation.y += 0.05 * (targetX - swarm2.rotation.y);
      swarm2.rotation.x += 0.05 * (targetY - swarm2.rotation.x);
    }

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    const isMobileNow = window.innerWidth < 768;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(isMobileNow ? 1 : Math.min(window.devicePixelRatio, 2));
  });
}

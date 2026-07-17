import * as THREE from 'three';

export function initParticles() {
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  // Soft ambient fog
  scene.fog = new THREE.FogExp2(0xfdfaf6, 0.002);

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Romantic petals / bokeh particles
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 1000;
  const posArray = new Float32Array(particlesCount * 3);
  const colorsArray = new Float32Array(particlesCount * 3);
  const scaleArray = new Float32Array(particlesCount); // For varying sizes

  const color1 = new THREE.Color(0xffe3ec); // Soft blush
  const color2 = new THREE.Color(0xd88fa7); // Rose
  const color3 = new THREE.Color(0xffffff); // White

  for(let i = 0; i < particlesCount * 3; i+=3) {
    posArray[i] = (Math.random() - 0.5) * 100; // x
    posArray[i+1] = (Math.random() - 0.5) * 100; // y
    posArray[i+2] = (Math.random() - 0.5) * 50; // z

    const rColors = [color1, color2, color3];
    const pickedColor = rColors[Math.floor(Math.random() * rColors.length)];
    colorsArray[i] = pickedColor.r;
    colorsArray[i+1] = pickedColor.g;
    colorsArray[i+2] = pickedColor.b;
    
    scaleArray[i/3] = Math.random();
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));
  particlesGeometry.setAttribute('aScale', new THREE.BufferAttribute(scaleArray, 1));

  // Circular bokeh texture
  const circleCanvas = document.createElement('canvas');
  circleCanvas.width = 32;
  circleCanvas.height = 32;
  const ctx = circleCanvas.getContext('2d');
  const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.3, 'rgba(255,255,255,0.8)');
  gradient.addColorStop(0.8, 'rgba(255,255,255,0.1)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0,0,32,32);
  const particleTexture = new THREE.CanvasTexture(circleCanvas);

  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.8,
    map: particleTexture,
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    blending: THREE.NormalBlending,
    depthWrite: false
  });

  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);

  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  document.addEventListener('mousemove', (event) => {
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

    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;

    // Gentle floating
    particlesMesh.rotation.y += 0.0003;
    particlesMesh.rotation.x += 0.0001;

    // Soft Parallax
    particlesMesh.rotation.y += 0.02 * (targetX - particlesMesh.rotation.y);
    particlesMesh.rotation.x += 0.02 * (targetY - particlesMesh.rotation.x);

    // Floating up instead of down (romantic bokeh vibe)
    particlesMesh.position.y = scrollY * 0.005 + Math.sin(elapsedTime * 0.2) * 2;

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

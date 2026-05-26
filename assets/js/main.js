/* ═══════════════════════════════════════════
   Kenneth Galorio — Portfolio JS
   ═══════════════════════════════════════════ */

// ─── LOADER ───
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('loader').classList.add('hidden'), 800);
});

// ─── CUSTOM CURSOR ───
(() => {
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;
  let mx = 0, my = 0, rx = 0, ry = 0;
  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  const hovers = document.querySelectorAll('a, button, .project-card, .gallery-item, .skill-tag');
  hovers.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });
  (function loop() {
    rx += (mx - rx) * 0.15; ry += (my - ry) * 0.15;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(loop);
  })();
})();

// ─── NAV SCROLL ───
(() => {
  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });

  // Mobile toggle
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
  }

  // Active link
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 200;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const h = sec.offsetHeight;
      const id = sec.getAttribute('id');
      const link = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (link) link.classList.toggle('active', scrollY >= top && scrollY < top + h);
    });
  });
})();

// ─── TYPING EFFECT ───
(() => {
  const el = document.querySelector('.typing-text');
  if (!el) return;
  const words = ['Frontend Developer', 'UI/UX Designer', 'Multimedia Artist', 'Campus Journalist'];
  let wi = 0, ci = 0, deleting = false;
  function type() {
    const word = words[wi];
    el.textContent = deleting ? word.substring(0, ci--) : word.substring(0, ci++);
    if (!deleting && ci > word.length) { setTimeout(() => { deleting = true; type(); }, 2000); return; }
    if (deleting && ci < 0) { deleting = false; wi = (wi + 1) % words.length; }
    setTimeout(type, deleting ? 40 : 80);
  }
  type();
})();

// ─── REVEAL ON SCROLL ───
(() => {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();

// ─── THREE.JS HERO 3D SCENE ───
(() => {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Floating geometry
  const geometries = [];
  const materials = [
    new THREE.MeshPhysicalMaterial({ color: 0x6c5ce7, transparent: true, opacity: 0.25, roughness: 0.1, metalness: 0.8, clearcoat: 1 }),
    new THREE.MeshPhysicalMaterial({ color: 0xa855f7, transparent: true, opacity: 0.2, roughness: 0.1, metalness: 0.8, clearcoat: 1 }),
    new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.2, roughness: 0.1, metalness: 0.8, clearcoat: 1 }),
  ];

  // Create floating objects
  for (let i = 0; i < 18; i++) {
    const geoTypes = [
      new THREE.IcosahedronGeometry(Math.random() * 1.5 + 0.5, 0),
      new THREE.OctahedronGeometry(Math.random() * 1.2 + 0.4, 0),
      new THREE.TorusGeometry(Math.random() * 1 + 0.3, 0.2, 8, 16),
      new THREE.BoxGeometry(Math.random() * 1.2 + 0.4, Math.random() * 1.2 + 0.4, Math.random() * 1.2 + 0.4),
    ];
    const mesh = new THREE.Mesh(
      geoTypes[Math.floor(Math.random() * geoTypes.length)],
      materials[Math.floor(Math.random() * materials.length)]
    );
    mesh.position.set(
      (Math.random() - 0.5) * 50,
      (Math.random() - 0.5) * 30,
      (Math.random() - 0.5) * 20
    );
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    mesh.userData = {
      speed: Math.random() * 0.005 + 0.002,
      rotSpeed: Math.random() * 0.01 + 0.003,
      floatAmp: Math.random() * 0.5 + 0.2,
      floatSpeed: Math.random() * 0.01 + 0.005,
      initialY: mesh.position.y,
    };
    scene.add(mesh);
    geometries.push(mesh);
  }

  // Particles
  const particleCount = 200;
  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i++) positions[i] = (Math.random() - 0.5) * 60;
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({ color: 0x6c5ce7, size: 0.08, transparent: true, opacity: 0.6 });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambientLight);
  const pointLight1 = new THREE.PointLight(0x6c5ce7, 2, 60);
  pointLight1.position.set(10, 10, 10);
  scene.add(pointLight1);
  const pointLight2 = new THREE.PointLight(0xa855f7, 1.5, 60);
  pointLight2.position.set(-10, -10, 5);
  scene.add(pointLight2);
  const pointLight3 = new THREE.PointLight(0x38bdf8, 1, 50);
  pointLight3.position.set(0, 15, -10);
  scene.add(pointLight3);

  // Mouse interaction
  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Animate
  let time = 0;
  function animate() {
    requestAnimationFrame(animate);
    time += 0.01;

    geometries.forEach(mesh => {
      mesh.rotation.x += mesh.userData.rotSpeed;
      mesh.rotation.y += mesh.userData.rotSpeed * 0.7;
      mesh.position.y = mesh.userData.initialY + Math.sin(time * mesh.userData.floatSpeed * 100) * mesh.userData.floatAmp;
    });

    particles.rotation.y += 0.0003;
    particles.rotation.x += 0.0001;

    camera.position.x += (mouseX * 3 - camera.position.x) * 0.02;
    camera.position.y += (-mouseY * 2 - camera.position.y) * 0.02;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();

// ─── SKILL BAR ANIMATION ───
(() => {
  const bars = document.querySelectorAll('.skill-bar-fill');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const pct = el.dataset.pct;
        el.style.width = pct + '%';
        el.classList.add('animated');
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.1 });
  bars.forEach(b => obs.observe(b));
})();

// ─── COUNTER ANIMATION ───
(() => {
  const counters = document.querySelectorAll('[data-count]');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        let current = 0;
        const inc = target / 60;
        const timer = setInterval(() => {
          current += inc;
          if (current >= target) { el.textContent = target + '+'; clearInterval(timer); }
          else el.textContent = Math.floor(current) + '+';
        }, 20);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => obs.observe(c));
})();

// ─── CONTACT FORM ───
(() => {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('.btn-submit');
    
    btn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';
    
    try {
      const response = await fetch(form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/'), {
        method: 'POST',
        body: new FormData(form),
        headers: {
            'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        btn.innerHTML = '<span>Message Sent! ✓</span> <i class="fas fa-check"></i>';
        btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
        form.reset();
      } else {
        throw new Error('Failed');
      }
    } catch (error) {
      btn.innerHTML = '<span>Error Sending</span> <i class="fas fa-exclamation-triangle"></i>';
      btn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
    }
    
    setTimeout(() => {
      btn.innerHTML = '<span>Send Message</span> <i class="fas fa-paper-plane"></i>';
      btn.style.background = '';
    }, 4000);
  });
})();

// ─── CIRCULAR GAUGE ANIMATION ───
(() => {
  const circumference = 2 * Math.PI * 40; // r=40 => 251.2
  const gaugeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const pct = parseFloat(fill.dataset.pct) || 0;
        const offset = circumference - (circumference * pct / 100);
        fill.style.strokeDashoffset = offset;
        gaugeObserver.unobserve(fill);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.skill-gauge-fill').forEach(el => {
    el.style.strokeDasharray = circumference;
    el.style.strokeDashoffset = circumference;
    gaugeObserver.observe(el);
  });
})();

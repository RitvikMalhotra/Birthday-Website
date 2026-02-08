// ==========================================
// BIRTHDAY WEBSITE - Taylor Swift / Sabrina Carpenter Vibe
// With 3D Parallax, Balloons, Hearts & Curtain Close
// ==========================================

const scenes = {
  cake: document.getElementById("scene-cake"),
  letter: document.getElementById("scene-letter"),
  collage: document.getElementById("scene-collage")
};

let currentScene = "cake";
let letterStarted = false;
let balloonsInterval = null;
let heartsInterval = null;

// ==========================================
// ESPRESSO MUSIC CONTROLLER
// ==========================================
const bgMusic = document.getElementById('bg-music');
const musicToggle = document.getElementById('music-toggle');
const nowPlaying = document.getElementById('now-playing');

function updateMusicUI() {
  if (!bgMusic || !musicToggle) return;
  const playing = !bgMusic.paused;
  musicToggle.querySelector('.music-icon').textContent = playing ? '⏸' : '▶';
  musicToggle.classList.toggle('playing', playing);
  musicToggle.setAttribute('aria-label', playing ? 'Pause music' : 'Play music');
  
  if (nowPlaying) {
    nowPlaying.classList.toggle('hidden', !playing);
    nowPlaying.classList.toggle('visible', playing);
  }
}

if (bgMusic) {
  bgMusic.loop = true;
  bgMusic.volume = 0.65;
}

// Show music button immediately
if (musicToggle) musicToggle.classList.add('visible');

// ==========================================
// SPLASH SCREEN — starts music on tap
// ==========================================
const splashScreen = document.getElementById('splash-screen');
let musicStarted = false;

function dismissSplash() {
  if (!splashScreen || splashScreen.classList.contains('hidden')) return;
  
  // Start music immediately on this user gesture
  if (bgMusic && !musicStarted) {
    bgMusic.currentTime = 0;
    bgMusic.play().then(() => {
      musicStarted = true;
      updateMusicUI();
    }).catch(() => {});
  }
  
  // Hide splash, show cake scene
  splashScreen.classList.add('hidden');
  setTimeout(() => {
    scenes.cake.classList.add('active');
  }, 100);
}

if (splashScreen) {
  splashScreen.addEventListener('click', (e) => {
    e.stopPropagation();
    dismissSplash();
  });
  splashScreen.addEventListener('touchstart', (e) => {
    e.stopPropagation();
    dismissSplash();
  });
}

function fadeOutMusic(duration = 1200) {
  if (!bgMusic || bgMusic.paused) return;
  const startVol = bgMusic.volume;
  const steps = 25;
  const stepTime = duration / steps;
  let i = 0;
  const fade = setInterval(() => {
    i++;
    bgMusic.volume = Math.max(0, startVol * (1 - i / steps));
    if (i >= steps) {
      clearInterval(fade);
      bgMusic.pause();
      bgMusic.volume = startVol;
      updateMusicUI();
    }
  }, stepTime);
}

// Music toggle button click
if (musicToggle) {
  musicToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!bgMusic) return;
    if (bgMusic.paused) {
      bgMusic.play().catch(() => {});
    } else {
      bgMusic.pause();
    }
    updateMusicUI();
  });
}

// ==========================================
// SPARKLE CURSOR
// ==========================================
const cursor = document.getElementById('sparkle-cursor');
let cursorTrails = [];

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
  
  // Create sparkle trail
  if (Math.random() > 0.7) {
    createSparkleTrail(e.clientX, e.clientY);
  }
});

function createSparkleTrail(x, y) {
  const sparkle = document.createElement('div');
  sparkle.innerHTML = '✦';
  sparkle.style.cssText = `
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    font-size: ${8 + Math.random() * 8}px;
    color: ${['#ffd700', '#f8c8dc', '#e6d5f2', '#f7e7ce'][Math.floor(Math.random() * 4)]};
    pointer-events: none;
    z-index: 10001;
    animation: sparkleTrail 1s ease-out forwards;
  `;
  document.body.appendChild(sparkle);
  
  setTimeout(() => sparkle.remove(), 1000);
}

// Add sparkle trail animation
const sparkleStyle = document.createElement('style');
sparkleStyle.textContent = `
  @keyframes sparkleTrail {
    0% { opacity: 1; transform: scale(1) translateY(0); }
    100% { opacity: 0; transform: scale(0) translateY(-30px) rotate(180deg); }
  }
`;
document.head.appendChild(sparkleStyle);

// ==========================================
// 3D PARALLAX EFFECT
// ==========================================
document.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 2;
  const y = (e.clientY / window.innerHeight - 0.5) * 2;
  
  document.querySelectorAll('.parallax-layer').forEach(layer => {
    const speed = parseFloat(layer.dataset.speed) || 0.1;
    const moveX = x * 50 * speed;
    const moveY = y * 50 * speed;
    layer.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
  });
  
  // 3D tilt effect on scene content
  const sceneContent = document.querySelector('.scene.active .scene-content');
  if (sceneContent) {
    sceneContent.style.transform = `
      rotateX(${-y * 3}deg) 
      rotateY(${x * 3}deg)
      translateZ(0)
    `;
  }
});

// ==========================================
// CAKE ANIMATION
// ==========================================
const layerColors = [
  'linear-gradient(135deg, #f8c8dc, #e8a4c9)',
  'linear-gradient(135deg, #e6d5f2, #d4bde8)',
  'linear-gradient(135deg, #f7e7ce, #f0d9b5)',
  'linear-gradient(135deg, #ffd1dc, #ffb6c1)'
];

const layerWidths = [180, 150, 120, 90];
const cakeStack = document.getElementById("cake-stack");

layerColors.forEach((gradient, i) => {
  setTimeout(() => {
    const layer = document.createElement("div");
    layer.className = "cake-layer";
    layer.style.background = gradient;
    layer.style.width = layerWidths[i] + 'px';
    layer.style.animationDelay = `${i * 0.15}s`;
    cakeStack.appendChild(layer);
    
    if (i === layerColors.length - 1) {
      setTimeout(addCandles, 500);
    }
  }, i * 500);
});

function addCandles() {
  const candlesContainer = document.getElementById("candles");
  
  // Create 4 candles
  for (let i = 0; i < 4; i++) {
    setTimeout(() => {
      const candle = document.createElement("div");
      candle.className = "candle";
      candle.style.animation = `candleAppear 0.5s ease forwards`;
      candlesContainer.appendChild(candle);
    }, i * 150);
  }
}

// Add candle appear animation
const candleStyle = document.createElement('style');
candleStyle.textContent = `
  @keyframes candleAppear {
    from { transform: scaleY(0); opacity: 0; }
    to { transform: scaleY(1); opacity: 1; }
  }
`;
document.head.appendChild(candleStyle);

// ==========================================
// BIRTHDAY TEXT ANIMATION
// ==========================================
const birthdayText = document.getElementById("birthday-text");
const message = "Happy Birthday, Jaanu 🎉";

message.split("").forEach((char, i) => {
  setTimeout(() => {
    const span = document.createElement("span");
    span.textContent = char;
    span.style.animationDelay = `${i * 0.05}s`;
    const colors = ['#f8c8dc', '#e6d5f2', '#f7e7ce', '#ffd700', '#ffffff'];
    span.style.setProperty('--char-color', colors[i % colors.length]);
    birthdayText.appendChild(span);
  }, 2500 + i * 80);
});

// ==========================================
// LETTER TYPING EFFECT - Smooth Line Reveal
// ==========================================
const letterLines = [
  "My beautiful Jaanu,",
  "",
  "Happy 19th birthday, my love! 🎂",
  "",
  "Like a Taylor Swift song that plays on repeat,",
  "you're the melody I never want to end.",
  "",
  "Like Sabrina Carpenter's sweetest lyrics,",
  "you make every moment feel magical.",
  "",
  "With you, even the simplest moments",
  "feel like the most beautiful love story.",
  "",
  "Thank you for being my favorite person.",
  "I love you, always and forever. 💖"
];

function typeLetter() {
  const box = document.getElementById("letter-content");
  
  // Create all lines first
  letterLines.forEach((line, index) => {
    const lineDiv = document.createElement("div");
    lineDiv.className = "letter-line";
    lineDiv.textContent = line;
    lineDiv.style.animationDelay = `${index * 0.15}s`;
    box.appendChild(lineDiv);
  });
  
  // Reveal lines one by one with smooth animation
  const allLines = box.querySelectorAll('.letter-line');
  allLines.forEach((line, index) => {
    setTimeout(() => {
      line.classList.add('visible');
    }, index * 250); // Staggered reveal
  });
}

// ==========================================
// BALLOONS ANIMATION
// ==========================================
const balloonColors = [
  'linear-gradient(135deg, #f8c8dc 0%, #e8a4c9 100%)',
  'linear-gradient(135deg, #e6d5f2 0%, #d4bde8 100%)',
  'linear-gradient(135deg, #f7e7ce 0%, #ffd700 100%)',
  'linear-gradient(135deg, #ffd1dc 0%, #ff69b4 100%)',
  'linear-gradient(135deg, #ffe4e1 0%, #ffb6c1 100%)'
];

function createBalloon() {
  const container = document.getElementById('balloons-container');
  if (!container) return;
  
  const balloon = document.createElement('div');
  balloon.className = 'balloon';
  
  const color = balloonColors[Math.floor(Math.random() * balloonColors.length)];
  balloon.style.background = color;
  balloon.style.left = Math.random() * 100 + '%';
  balloon.style.animationDuration = (6 + Math.random() * 4) + 's';
  balloon.style.animationDelay = Math.random() * 2 + 's';
  
  // Random size variation
  const scale = 0.7 + Math.random() * 0.6;
  balloon.style.transform = `scale(${scale})`;
  
  container.appendChild(balloon);
  
  // Remove balloon after animation
  setTimeout(() => balloon.remove(), 12000);
}

function startBalloons() {
  // Create initial balloons
  for (let i = 0; i < 5; i++) {
    setTimeout(createBalloon, i * 300);
  }
  
  // Continue creating balloons
  balloonsInterval = setInterval(createBalloon, 1500);
}

function stopBalloons() {
  if (balloonsInterval) {
    clearInterval(balloonsInterval);
    balloonsInterval = null;
  }
}

// ==========================================
// HEARTS POPPING ANIMATION
// ==========================================
const heartEmojis = ['💖', '💕', '💗', '💝', '💘', '❤️', '🩷', '✨', '💫'];

function createHeart() {
  const container = document.getElementById('hearts-container');
  if (!container) return;
  
  const heart = document.createElement('div');
  heart.className = 'heart';
  heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
  
  // Random position around the collage items
  heart.style.left = (10 + Math.random() * 80) + '%';
  heart.style.top = (20 + Math.random() * 60) + '%';
  heart.style.fontSize = (16 + Math.random() * 20) + 'px';
  heart.style.animationDuration = (3 + Math.random() * 2) + 's';
  heart.style.animationDelay = Math.random() * 0.5 + 's';
  
  container.appendChild(heart);
  
  // Remove heart after animation
  setTimeout(() => heart.remove(), 6000);
}

function startHearts() {
  // Create initial hearts burst
  for (let i = 0; i < 8; i++) {
    setTimeout(createHeart, i * 200);
  }
  
  // Continue creating hearts
  heartsInterval = setInterval(() => {
    for (let i = 0; i < 3; i++) {
      setTimeout(createHeart, i * 100);
    }
  }, 1000);
}

function stopHearts() {
  if (heartsInterval) {
    clearInterval(heartsInterval);
    heartsInterval = null;
  }
}

// ==========================================
// CURTAIN CLOSE ANIMATION
// ==========================================
function closeCurtains() {
  const curtainOverlay = document.getElementById('curtain-overlay');
  curtainOverlay.classList.add('active');
  
  // Small delay then start closing
  setTimeout(() => {
    curtainOverlay.classList.add('closing');
  }, 100);
  
  // After curtains close, show final message
  setTimeout(() => {
    // Optional: try to close window (won't work in most browsers)
    // window.close();
  }, 4000);
}

// ==========================================
// 3D TILT EFFECT ON COLLAGE ITEMS
// ==========================================
function initCollage3D() {
  const items = document.querySelectorAll('.collage-item');
  
  items.forEach(item => {
    item.addEventListener('mousemove', (e) => {
      if (item.classList.contains('settled')) {
        const rect = item.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 12;
        const rotateY = (centerX - x) / 12;
        item.style.transform = `
          rotate(0deg) scale(1.05)
          perspective(1000px)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
        `;
      }
    });
    
    item.addEventListener('mouseleave', () => {
      if (item.classList.contains('settled')) {
        item.style.transform = '';
      }
    });
  });
}

// ==========================================
// COLLAGE CARD THROW + SETTLE ANIMATION
// ==========================================
function initCollageCards() {
  const items = document.querySelectorAll('.collage-item');
  
  // After card-deal animation finishes (8 cards × 0.1s stagger + 0.5s anim ≈ 1.3s),
  // smoothly distribute into 4×2 grid one by one
  setTimeout(() => {
    items.forEach((item, i) => {
      setTimeout(() => {
        item.classList.add('settled');
      }, i * 150); // Staggered distribute — one card slides out every 150ms
    });
  }, 1500); // Wait for all cards to land in center
  
  // Init 3D tilt after all cards have settled
  setTimeout(initCollage3D, 3200);
}

// ==========================================
// PICTURE DETAIL OVERLAY — DATA
// ==========================================
const picData = {
  "1": {
    title: "Things I Love about You:",
    lines: [
      "You're smile",
      "Your beautiful and gorgeous body",
      "Your Personality",
      "Your taste in every single thing I can imagine"
    ],
    type: "list"
  },
  "2": {
    title: "Our Love Language:",
    lines: [
      "Talks",
      "Late night calls",
      "Cuddles",
      "Naughtiness hehe"
    ],
    type: "list"
  },
  "3": {
    title: "The Little things you do that matter to me a lot:",
    lines: [
      "Texting me all the time",
      "Spamming me with reels on anything",
      "Telling me your day with so much interest and happiness",
      "The way you always try your best to include me in ur time even when you're busy",
      "and so much more..."
    ],
    type: "list"
  },
  "4": {
    title: "We can share a dream together:",
    lines: [
      "Us marrying in a lovely beach or mountain",
      "Having 2 (mayyybeee 3) beautiful and handsome babies",
      "Raising puppies and cats",
      "Having the best family in the whole world Jaanu",
      "And growing old together and counting each other's wrinkles as a competition"
    ],
    type: "list"
  },
  "5": {
    title: "",
    lines: [
      "Your faith and belief in me and the fact that you have confidence in me and my motives makes me genuinely feel valued and heard Jaanu"
    ],
    type: "paragraph"
  },
  "6": {
    title: "",
    lines: [
      "I promise you My Gorgeous Wife, no matter what I will always be there for you.. I will always love you..always cherish you..do my very best as your loyal and loving husband to make your life a proper paradise"
    ],
    type: "paragraph"
  },
  "7": {
    title: "",
    lines: [
      "We may fight but its always worth it when we come back to each other in the end My Jaanu"
    ],
    type: "paragraph"
  },
  "8": {
    title: "",
    lines: [
      "And Always remember this Darling, I am only yours and yours forever and You are only and Only Mine Forever"
    ],
    type: "paragraph"
  }
};

let overlayOpen = false;

function openPicOverlay(picNum, imgSrc) {
  const overlay = document.getElementById('pic-overlay');
  const overlayImg = document.getElementById('overlay-img');
  const overlayText = document.getElementById('overlay-text');
  
  overlayImg.src = imgSrc;
  overlayText.innerHTML = '';
  
  const data = picData[picNum];
  if (data) {
    let html = '';
    if (data.title) {
      html += `<h3>${data.title}</h3>`;
    }
    if (data.type === 'list') {
      html += '<ol>';
      data.lines.forEach(line => {
        html += `<li>${line}</li>`;
      });
      html += '</ol>';
    } else {
      data.lines.forEach(line => {
        html += `<p>${line}</p>`;
      });
    }
    overlayText.innerHTML = html;
  }
  
  overlay.classList.add('active');
  overlayOpen = true;
}

function closePicOverlay() {
  const overlay = document.getElementById('pic-overlay');
  overlay.classList.remove('active');
  overlayOpen = false;
}

// Attach click listeners to collage items
function initCollageClicks() {
  const items = document.querySelectorAll('.collage-item');
  items.forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!item.classList.contains('settled')) return;
      const picNum = item.getAttribute('data-pic');
      const imgSrc = item.querySelector('img').src;
      openPicOverlay(picNum, imgSrc);
    });
  });
  
  // Close overlay on tap
  const overlay = document.getElementById('pic-overlay');
  overlay.addEventListener('click', (e) => {
    e.stopPropagation();
    closePicOverlay();
  });
}

// ==========================================
// SCENE TRANSITIONS
// ==========================================
function transitionToScene(from, to) {
  const fromScene = scenes[from];
  const toScene = scenes[to];
  
  if (fromScene) {
    fromScene.style.animation = 'sceneExit 0.6s ease forwards';
    setTimeout(() => {
      fromScene.classList.remove('active');
      fromScene.style.animation = '';
    }, 600);
  }
  
  setTimeout(() => {
    toScene.classList.add('active');
  }, 400);
}

// Add scene exit animation
const sceneExitStyle = document.createElement('style');
sceneExitStyle.textContent = `
  @keyframes sceneExit {
    from { 
      opacity: 1; 
      transform: translateZ(0) rotateX(0);
    }
    to { 
      opacity: 0; 
      transform: translateZ(100px) rotateX(-10deg);
    }
  }
`;
document.head.appendChild(sceneExitStyle);

// ==========================================
// MAIN CLICK HANDLER
// ==========================================
document.body.addEventListener("click", (e) => {
  // Ignore clicks while splash screen is visible
  if (splashScreen && !splashScreen.classList.contains('hidden')) return;
  
  // Create click burst effect
  createClickBurst(e.clientX, e.clientY);
  
  if (currentScene === "cake") {
    transitionToScene("cake", "letter");
    currentScene = "letter";
    
    if (!letterStarted) {
      letterStarted = true;
      setTimeout(typeLetter, 600);
    }
  }
  else if (currentScene === "letter") {
    transitionToScene("letter", "collage");
    currentScene = "collage";
    
    // Start balloons, hearts, cards
    setTimeout(() => {
      startBalloons();
      startHearts();
      initCollageCards();
      initCollageClicks();
    }, 800);
  }
  else if (currentScene === "collage") {
    // If overlay is open, don't close the show
    if (overlayOpen) return;
    // Stop animations, close curtains — music keeps playing
    stopBalloons();
    stopHearts();
    currentScene = "closing";
    closeCurtains();
  }
});

// Click burst effect
function createClickBurst(x, y) {
  const burst = document.createElement('div');
  burst.style.cssText = `
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    width: 10px;
    height: 10px;
    pointer-events: none;
    z-index: 10002;
  `;
  
  for (let i = 0; i < 8; i++) {
    const particle = document.createElement('div');
    const angle = (i / 8) * Math.PI * 2;
    const distance = 50 + Math.random() * 30;
    
    particle.innerHTML = ['✦', '✧', '★', '♡'][Math.floor(Math.random() * 4)];
    particle.style.cssText = `
      position: absolute;
      font-size: ${10 + Math.random() * 8}px;
      color: ${['#ffd700', '#f8c8dc', '#e6d5f2', '#ff69b4'][Math.floor(Math.random() * 4)]};
      animation: burstParticle 0.8s ease-out forwards;
      --tx: ${Math.cos(angle) * distance}px;
      --ty: ${Math.sin(angle) * distance}px;
    `;
    burst.appendChild(particle);
  }
  
  document.body.appendChild(burst);
  setTimeout(() => burst.remove(), 1000);
}

// Burst particle animation
const burstStyle = document.createElement('style');
burstStyle.textContent = `
  @keyframes burstParticle {
    0% { 
      opacity: 1; 
      transform: translate(0, 0) scale(1); 
    }
    100% { 
      opacity: 0; 
      transform: translate(var(--tx), var(--ty)) scale(0); 
    }
  }
`;
document.head.appendChild(burstStyle);

// ==========================================
// BACKGROUND FLOATING SPARKLES
// ==========================================
function createFloatingSparkle() {
  const sparkle = document.createElement('div');
  sparkle.innerHTML = ['✦', '✧', '★', '·'][Math.floor(Math.random() * 4)];
  sparkle.style.cssText = `
    position: fixed;
    left: ${Math.random() * 100}%;
    top: 100%;
    font-size: ${6 + Math.random() * 12}px;
    color: ${['#ffd700', '#f8c8dc', '#e6d5f2', '#ffffff'][Math.floor(Math.random() * 4)]};
    opacity: ${0.3 + Math.random() * 0.4};
    pointer-events: none;
    z-index: 0;
    animation: floatUp ${8 + Math.random() * 8}s linear forwards;
  `;
  document.body.appendChild(sparkle);
  setTimeout(() => sparkle.remove(), 16000);
}

// Float up animation
const floatStyle = document.createElement('style');
floatStyle.textContent = `
  @keyframes floatUp {
    0% { transform: translateY(0) rotate(0deg); }
    100% { transform: translateY(-120vh) rotate(360deg); }
  }
`;
document.head.appendChild(floatStyle);

// Start floating sparkles
setInterval(createFloatingSparkle, 800);

// Create initial sparkles
for (let i = 0; i < 10; i++) {
  setTimeout(createFloatingSparkle, i * 200);
}

// ==========================================
// SCROLL-BASED PARALLAX (for touch devices)
// ==========================================
let lastScrollY = 0;
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const delta = scrollY - lastScrollY;
  
  document.querySelectorAll('.parallax-layer').forEach(layer => {
    const speed = parseFloat(layer.dataset.speed) || 0.1;
    const currentTransform = layer.style.transform || '';
    const moveY = scrollY * speed;
    layer.style.transform = `translateY(${moveY}px)`;
  });
  
  lastScrollY = scrollY;
});

console.log('✨ Birthday Website Loaded - Taylor Swift / Sabrina Carpenter Vibe ✨');

/* PARALLAX */
document.addEventListener("mousemove",(e)=>{
  const x=(window.innerWidth/2-e.clientX)/40;
  const y=(window.innerHeight/2-e.clientY)/40;

  if(currentScene==="cake"){
    document.querySelector(".cake-container").style.transform=
      `rotateX(${y}deg) rotateY(${-x}deg)`;
  }

  if(currentScene==="collage"){
    document.querySelectorAll(".collage img").forEach((img,i)=>{
      img.style.transform=`translateZ(${i*30}px) rotateX(${y/2}deg) rotateY(${-x/2}deg)`;
    });
  }
});

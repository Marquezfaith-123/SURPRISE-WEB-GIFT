
"use strict";


const loveCircle = document.getElementById("loveCircle");

if (loveCircle) {
  loveCircle.innerHTML = "";

  const phraseCount = 100;

  const colors = [
    "#ff1744",
    "#e60039",
    "#ff3156",
    "#ff526e",
    "#c90032"
  ];

  // Parametric heart outline.
  // The curve forms the border, leaving the center empty.
  for (let i = 0; i < phraseCount; i++) {
    const t = (i / phraseCount) * Math.PI * 2;

    const x = 16 * Math.pow(Math.sin(t), 3);

    const y =
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t);

    const word = document.createElement("span");
    word.className = "love-word";
    word.textContent = "I LOVE YOU";

    // Position the words along the heart's outline.
    word.style.left = `${50 + (x / 18) * 44}%`;
    word.style.top = `${48 - (y / 18) * 44}%`;

    // Rotate each phrase to follow the heart's curve.
    const nextT = t + 0.01;

    const nextX = 16 * Math.pow(Math.sin(nextT), 3);
    const nextY =
      13 * Math.cos(nextT) -
      5 * Math.cos(2 * nextT) -
      2 * Math.cos(3 * nextT) -
      Math.cos(4 * nextT);

    const dx = nextX - x;
    const dy = nextY - y;

    const angle = Math.atan2(-dy, dx) * (180 / Math.PI);

    word.style.transform =
      `translate(-50%, -50%) rotate(${angle}deg)`;

    word.style.color =
      colors[Math.floor(Math.random() * colors.length)];

    word.style.animationDelay = `${Math.random() * 2}s`;

    loveCircle.appendChild(word);
  }
}

// ========================================
// 2. CURSOR / TOUCH LOVE TRAIL
// ========================================

let lastTrailTime = 0;

document.addEventListener("pointermove", (event) => {
  const now = Date.now();

  if (now - lastTrailTime < 75) return;
  lastTrailTime = now;

  const word = document.createElement("span");
  word.className = "cursor-love";
  word.textContent =
    Math.random() > 0.25 ? "i love you ♥" : "forever ♡";

  word.style.left = `${event.clientX}px`;
  word.style.top = `${event.clientY}px`;

  document.body.appendChild(word);

  word.addEventListener("animationend", () => {
    word.remove();
  }, { once: true });
});

// ========================================
// 3. CLICKABLE ORIGAMI HEART
// ========================================

const heartButton = document.getElementById("heartButton");
const letterCard = document.getElementById("letterCard");

if (heartButton && letterCard) {
  heartButton.addEventListener("click", () => {
    const isOpening = letterCard.hidden;

    // Show or hide the letter.
    letterCard.hidden = !isOpening;

    // Update the button's accessibility state.
    heartButton.setAttribute(
      "aria-expanded",
      String(isOpening)
    );

    // Scroll to the letter when it opens.
    if (isOpening) {
      window.setTimeout(() => {
        letterCard.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }, 150);
    }
  });
}

// ========================================
// 4. FLOATING RED AND BLUE PARTICLES
// ========================================

const canvas = document.getElementById("particles");
const ctx = canvas ? canvas.getContext("2d") : null;

let particles = [];
let animationFrame = null;

function resizeCanvas() {
  if (!canvas || !ctx) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;

  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  particles = Array.from({ length: 45 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    size: Math.random() * 2 + 0.5,
    speed: Math.random() * 0.35 + 0.1,
    alpha: Math.random() * 0.55 + 0.15,
    blue: Math.random() > 0.5
  }));
}

function drawParticles() {
  if (!canvas || !ctx) return;

  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  for (const p of particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

    ctx.fillStyle = p.blue
      ? `rgba(85, 145, 255, ${p.alpha})`
      : `rgba(255, 55, 100, ${p.alpha})`;

    ctx.shadowBlur = 12;
    ctx.shadowColor = p.blue ? "#347aff" : "#ff284f";
    ctx.fill();
    ctx.shadowBlur = 0;

    p.y -= p.speed;

    if (p.y < -5) {
      p.y = window.innerHeight + 5;
      p.x = Math.random() * window.innerWidth;
    }
  }

  animationFrame = requestAnimationFrame(drawParticles);
}

if (canvas && ctx) {
  resizeCanvas();

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    drawParticles();
  }

  window.addEventListener("resize", resizeCanvas);
}
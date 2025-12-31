const gameArea = document.getElementById('gameArea');
const timeSpan = document.getElementById('time');
const scoreSpan = document.getElementById('score');
const timerFill = document.getElementById('timerFill');
const timerBar = document.getElementById('timerBar');

let score = 0;
const TOTAL_TIME = 30;           // remis à 30s (20 points en 30s)
const STAR_LIFETIME_MS = 900;    // étoiles disparaissent vite (garde le rythme)
let timeLeft = TOTAL_TIME;
let timerInterval = null;
let starTimeout = null;
const TARGET_SCORE = 55;         // objectif ajusté

// ======================
// Gestion des codes promo
// ======================
function genPromoCode(len = 8) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // éviter I/O/1/0
  let out = '';
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

function getPromoList() {
  try { return JSON.parse(localStorage.getItem('promoCodes') || '[]'); } catch { return []; }
}

function setPromoList(list) {
  localStorage.setItem('promoCodes', JSON.stringify(list || []));
}

function createUniquePromo() {
  const list = getPromoList();
  const existing = new Set(list.map(p => p.code));
  let code;
  do { code = genPromoCode(); } while (existing.has(code));
  list.push({ code, used: false, generatedAt: new Date().toISOString(), usedAt: null });
  setPromoList(list);
  return code;
}

function resetGame() {
  score = 0;
  timeLeft = TOTAL_TIME;
  scoreSpan.textContent = score;
  timeSpan.textContent = timeLeft;
  clearInterval(timerInterval);
  clearTimeout(starTimeout);
  removeStar();
  if (timerFill) timerFill.style.width = '100%';
  if (timerBar) timerBar.setAttribute('aria-valuenow', String(TOTAL_TIME));
}

function startGame() {
  resetGame();
  timerInterval = setInterval(() => {
    timeLeft--;
    timeSpan.textContent = timeLeft;
    if (timerFill) {
      const pct = Math.max(0, (timeLeft / TOTAL_TIME) * 100);
      timerFill.style.width = pct + '%';
    }
    if (timerBar) timerBar.setAttribute('aria-valuenow', String(Math.max(0, timeLeft)));
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);

  spawnStar();
}
const overlayHome = document.getElementById('overlayHome');
const overlayReady = document.getElementById('overlayReady');
const overlayEnd = document.getElementById('overlayEnd');

const btnStart = document.getElementById('btnStart');
const btnYes = document.getElementById('btnYes');
const btnNo = document.getElementById('btnNo');
const btnReplay = document.getElementById('btnReplay');

const endTitle = document.getElementById('endTitle');
const endResult = document.getElementById('endResult');

function setState(state){
  gameArea.classList.remove('state-home', 'state-ready', 'state-play');
  gameArea.classList.add(`state-${state}`);

  overlayHome.hidden = state !== 'home';
  overlayReady.hidden = state !== 'ready';
  overlayEnd.hidden = true; 
}

function showEnd(){
  overlayHome.hidden = true;
  overlayReady.hidden = true;
  overlayEnd.hidden = false;

  gameArea.classList.remove('state-ready', 'state-play');
  gameArea.classList.add('state-home');
}
setState('home');

btnStart.addEventListener('click', () => setState('ready'));
btnNo.addEventListener('click', () => setState('home'));
btnYes.addEventListener('click', () => {
  setState('play');
  startGame();
});
btnReplay.addEventListener('click', () => {
  setState('ready');
});
function endGame() {
  clearInterval(timerInterval);
  clearTimeout(starTimeout);
  removeStar();

  if (score >= TARGET_SCORE) {
    endTitle.textContent = "BRAVO !";
    const code = createUniquePromo();
    endResult.innerHTML = `
      <p class="win">Score : ${score}. Tu gagnes <strong>10 %</strong> sur ton projet.</p>
      <p>Ton code promo : <strong>${code}</strong></p>
      <p style="font-size: .9rem; color: var(--text-secondary);">Utilise ce code dans le formulaire de contact.</p>
    `;
  } else {
    endTitle.textContent = "GAME OVER";
    endResult.innerHTML = `
      <p class="lose">Score : ${score}. Objectif : ${TARGET_SCORE}.</p>
      <p>Réessaie pour gagner la réduction.</p>
    `;
  }

  showEnd();
}

function spawnStar() {
  clearTimeout(starTimeout);
  removeStar();

  const star = document.createElement('div');
  star.classList.add('star');

  const areaRect = gameArea.getBoundingClientRect();
  const size = 44; // réduire la taille pour rendre le clic moins facile (CSS synchronisé)
  const maxX = Math.max(0, areaRect.width - size);
  const maxY = Math.max(0, areaRect.height - size);

  const x = Math.random() * maxX;
  const y = Math.random() * maxY;

  star.style.left = `${x}px`;
  star.style.top = `${y}px`;

  const onHit = (e) => {
    try { e.preventDefault(); e.stopPropagation(); } catch (_) {}
    if (star.dataset.hit === '1') return;
    star.dataset.hit = '1';
    score++;
    scoreSpan.textContent = score;
    clearTimeout(starTimeout);
    spawnStar();
  };
  // Incrémenter au survol (hover)
  star.addEventListener('pointerenter', onHit);

  // Fallback pour appareils sans hover (mobile/tablette)
  try {
    if (window.matchMedia && window.matchMedia('(hover: none)').matches) {
      star.addEventListener('pointerdown', onHit, { passive: false });
      star.addEventListener('touchstart', onHit, { passive: false });
    }
  } catch (_) {
    // en cas d'environnement sans matchMedia, aucun fallback
  }

  gameArea.appendChild(star);

  starTimeout = setTimeout(() => {
    spawnStar();
  }, STAR_LIFETIME_MS);
}

function removeStar() {
  const existing = document.querySelector('.star');
  if (existing) existing.remove();
}

// Gestion du formulaire de remarques (feedback)
try {
  const feedbackForm = document.getElementById('feedbackForm');
  const feedbackTextarea = document.getElementById('feedback');
  const feedbackSuccess = document.getElementById('feedbackSuccess');
  if (feedbackForm && feedbackTextarea && feedbackSuccess) {
    // En cas de saisie, retirer un message de validité custom éventuel
    feedbackTextarea.addEventListener('input', () => {
      feedbackTextarea.setCustomValidity('');
    });

    feedbackForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = (feedbackTextarea.value || '').trim();
      if (!msg) {
        // Validation native + petite indication visuelle si vide
        feedbackTextarea.setCustomValidity('Veuillez saisir un message.');
        feedbackTextarea.reportValidity();
        feedbackTextarea.focus();
        feedbackTextarea.style.boxShadow = '0 0 0 3px var(--focus-ring)';
        setTimeout(() => { feedbackTextarea.style.boxShadow = ''; }, 300);
        return;
      }
      feedbackTextarea.setCustomValidity('');
      // Simuler l'envoi et afficher un message de succes
      feedbackTextarea.value = '';
      feedbackSuccess.hidden = false;
      feedbackSuccess.classList.add('pop');
      setTimeout(() => {
        feedbackSuccess.hidden = true;
        feedbackSuccess.classList.remove('pop');
      }, 2500);
    });
  }
} catch (_) {}

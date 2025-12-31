document.addEventListener('DOMContentLoaded', function () {
  const helloNormal = document.getElementById('hello-type');
  const nameNormal  = document.getElementById('name-type');
  const helloInv    = document.querySelector('.hero-hello-inverted');
  const nameInv     = document.querySelector('.hero-name-inverted');

  if (!helloNormal || !nameNormal || !helloInv || !nameInv) return;

  const helloText = 'hello,';
  const nameText  = "I'm Abdi Farah";
  const speed     = 100; // ms par lettre

  // état initial
  helloNormal.textContent = '';
  nameNormal.textContent  = '';
  helloInv.style.visibility = 'hidden';
  nameInv.style.visibility  = 'hidden';

  function typeLine(el, text, withCaret, done) {
    let i = 0;
    el.textContent = '';

    if (withCaret) el.classList.add('hero-type-caret');

    function step() {
      if (i < text.length) {
        el.textContent += text.charAt(i++);
        setTimeout(step, speed);
      } else {
        if (withCaret) el.classList.remove('hero-type-caret');
        if (typeof done === 'function') done();
      }
    }

    step();
  }

  // 1) taper "hello," à sa position actuelle
  typeLine(helloNormal, helloText, true, function () {
    // 2) puis taper "I'm Abdi Farah" à sa position actuelle
    typeLine(nameNormal, nameText, true, function () {
      // 3) à la fin, afficher les versions inversées, aux mêmes positions CSS
      helloInv.style.visibility = 'visible';
      nameInv.style.visibility  = 'visible';
      helloInv.textContent = helloText;
      nameInv.textContent  = nameText;
    });
  });
});


function applyPixelPerfectInversion() {
  const heroImage = document.querySelector('.hero-image');
  const helloInverted = document.querySelector('.hero-hello-inverted');
  const nameInverted = document.querySelector('.hero-name-inverted');
  const heroContent = document.querySelector('.hero-content');

  if (!heroImage || !helloInverted || !nameInverted || !heroContent) return;

  // Obtenir les rectangles de bounding
  const imageRect = heroImage.getBoundingClientRect();
  const helloRect = helloInverted.getBoundingClientRect();
  const nameRect = nameInverted.getBoundingClientRect();

  // Calculer les positions relatives par rapport à chaque élément de texte
  function createClipPath(textRect, imgRect) {
    // Calculer les coordonnées de l'image par rapport au texte
    const left = imgRect.left - textRect.left;
    const top = imgRect.top - textRect.top;
    const right = left + imgRect.width;
    const bottom = top + imgRect.height;

    // Créer un polygon qui couvre uniquement la zone de l'image
    return `polygon(${left}px ${top}px, ${right}px ${top}px, ${right}px ${bottom}px, ${left}px ${bottom}px)`;
  }

  // Appliquer le clip-path pour chaque élément
  helloInverted.style.clipPath = createClipPath(helloRect, imageRect);
  nameInverted.style.clipPath = createClipPath(nameRect, imageRect);
}

document.addEventListener('DOMContentLoaded', () => {
  // Appel initial
  applyPixelPerfectInversion();

  // Appel après un délai pour s'assurer que tout est chargé
  setTimeout(applyPixelPerfectInversion, 100);
});

// Recalculer lors des changements
window.addEventListener('resize', applyPixelPerfectInversion);
window.addEventListener('scroll', applyPixelPerfectInversion);

// Vérifier régulièrement (pour les animations)
setInterval(applyPixelPerfectInversion, 30);

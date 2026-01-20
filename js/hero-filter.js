document.addEventListener('DOMContentLoaded', function () {
  const helloNormal = document.getElementById('hello-type');
  const nameNormal  = document.getElementById('name-type');
  const helloInv    = document.querySelector('.hero-hello-inverted');
  const nameInv     = document.querySelector('.hero-name-inverted');

  if (!helloNormal || !nameNormal || !helloInv || !nameInv) return;

  const helloText = 'hello,';
  const nameText  = "I'm Abdi Farah";
  const speed     = 100; 

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

  typeLine(helloNormal, helloText, true, function () {
    typeLine(nameNormal, nameText, true, function () {
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

  const imageRect = heroImage.getBoundingClientRect();
  const helloRect = helloInverted.getBoundingClientRect();
  const nameRect = nameInverted.getBoundingClientRect();

  function createClipPath(textRect, imgRect) {
    const left = imgRect.left - textRect.left;
    const top = imgRect.top - textRect.top;
    const right = left + imgRect.width;
    const bottom = top + imgRect.height;

    return `polygon(${left}px ${top}px, ${right}px ${top}px, ${right}px ${bottom}px, ${left}px ${bottom}px)`;
  }

  helloInverted.style.clipPath = createClipPath(helloRect, imageRect);
  nameInverted.style.clipPath = createClipPath(nameRect, imageRect);
}

document.addEventListener('DOMContentLoaded', () => {
  applyPixelPerfectInversion();
  setTimeout(applyPixelPerfectInversion, 100);
});

window.addEventListener('resize', applyPixelPerfectInversion);
window.addEventListener('scroll', applyPixelPerfectInversion);

setInterval(applyPixelPerfectInversion, 30);

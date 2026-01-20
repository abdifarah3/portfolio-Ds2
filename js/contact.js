(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const promoInput = form.querySelector('#promoCode');
    const notification = document.getElementById('formNotification');
    const promoHelp = promoInput?.parentElement?.querySelector('.form-help') || null;

    const storage = {
      getPromoList() {
        try { return JSON.parse(localStorage.getItem('promoCodes') || '[]'); } catch { return []; }
      },
      setPromoList(list) {
        localStorage.setItem('promoCodes', JSON.stringify(list || []));
      }
    };

    function showNotification(type, message) {
      if (!notification) return;
      notification.className = 'notification ' + (type === 'error' ? 'error' : 'success');
      notification.textContent = message;
      notification.style.display = 'block';
      try { notification.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch {}
    }

    function setPromoHelp(text) {
      if (promoHelp) promoHelp.textContent = text;
    }

    promoInput?.addEventListener('input', () => {
      const caret = promoInput.selectionStart;
      promoInput.value = (promoInput.value || '').toUpperCase().replace(/\s+/g, '');
      try { promoInput.setSelectionRange(caret, caret); } catch {}
    });

    (function updateHelpFromStorage() {
      const list = storage.getPromoList();
      const last = list[list.length - 1];
      if (last && !last.used) {
        setPromoHelp('Vous avez un code disponible : ' + last.code);
      } else if (promoHelp) {
      }
    })();

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const code = (promoInput?.value || '').trim().toUpperCase();
      const list = storage.getPromoList();
      const idx = list.findIndex(p => p.code === code);

      if (!code) {
        if (promoInput) promoInput.style.borderColor = '';
        showNotification('success', 'Formulaire envoyé.');
        return;
      }

      if (idx === -1) {
        if (promoInput) promoInput.style.borderColor = '#e74c3c';
        showNotification('error', 'Code promo invalide.');
        return;
      }

      if (list[idx].used) {
        if (promoInput) promoInput.style.borderColor = '#e74c3c';
        showNotification('error', 'Code promo déjà utilisé.');
        return;
      }

      list[idx].used = true;
      list[idx].usedAt = new Date().toISOString();
      storage.setPromoList(list);

      if (promoInput) promoInput.style.borderColor = '#27ae60';
      showNotification('success', 'Formulaire envoyé. Code promo appliqué.');

    });
  });
})();

document.addEventListener('DOMContentLoaded', function() {
    console.log('Site chargé avec succès !');
    
    // Animation au chargement
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        setTimeout(() => {
            section.style.transition = 'all 0.5s ease';
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, index * 100);
    });
});
// matieres
document.addEventListener("DOMContentLoaded", () => {
  const toggles = document.querySelectorAll(".accordion-toggle");

  toggles.forEach((btn) => {
    btn.addEventListener("click", () => {
      const panelId = btn.getAttribute("aria-controls");
      const panel = document.getElementById(panelId);
      const expanded = btn.getAttribute("aria-expanded") === "true";
      const newState = !expanded;

      btn.setAttribute("aria-expanded", String(newState));

      if (!panel) return;

      panel.hidden = !newState;

      if (!newState) {
        const childPanels = panel.querySelectorAll(".accordion-panel");
        const childToggles = panel.querySelectorAll(".accordion-toggle");

        childPanels.forEach((p) => {
          p.hidden = true;
        });

        childToggles.forEach((t) => {
          t.setAttribute("aria-expanded", "false");
        });
      }
    });
  });
});

// Fonction pour valider les formulaires
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;

    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (input.value.trim() === '') {
            input.style.borderColor = '#e74c3c';
            isValid = false;
        } else {
            input.style.borderColor = '#bdc3c7';
        }
    });

    return isValid;
}

// Fonction pour valider un email
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Fonction pour afficher une notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem;
        background-color: ${type === 'success' ? '#d4edda' : '#f8d7da'};
        color: ${type === 'success' ? '#155724' : '#721c24'};
        border: 1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'};
        border-radius: 4px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Animation CSS pour les notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Fonction pour scroller vers une section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Fonction pour formater une date
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('fr-FR', options);
}

// Fonction pour compter les mots dans un texte
function countWords(text) {
    return text.trim().split(/\s+/).length;
}

// Fonction pour générer un ID unique
function generateId() {
    return 'id_' + Math.random().toString(36).substr(2, 9);
}

// Fonction pour stocker des données en localStorage
function saveToLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (e) {
        console.error('Erreur lors de la sauvegarde:', e);
        return false;
    }
}

// Fonction pour récupérer des données du localStorage
function getFromLocalStorage(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (e) {
        console.error('Erreur lors de la récupération:', e);
        return null;
    }
}

// Fonction pour supprimer des données du localStorage
function removeFromLocalStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (e) {
        console.error('Erreur lors de la suppression:', e);
        return false;
    }
}

// Fonction pour afficher/masquer un élément
function toggleElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = element.style.display === 'none' ? 'block' : 'none';
    }
}

// Fonction pour ajouter une classe à un élément
function addClass(elementId, className) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.add(className);
    }
}

// Fonction pour supprimer une classe d'un élément
function removeClass(elementId, className) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.remove(className);
    }
}

// Fonction pour basculer une classe
function toggleClass(elementId, className) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.toggle(className);
    }
}

console.log('Scripts généraux chargés avec succès !');

// ================================
// Chargement de partials (header/footer)
// ================================
(function () {
  async function fetchFirstWorking(urlCandidates) {
    for (const u of urlCandidates) {
      try {
        const res = await fetch(u, { cache: 'no-cache' });
        if (res.ok) return await res.text();
      } catch (e) {
        // essayer la suivante
      }
    }
    throw new Error('Aucune URL valide parmi: ' + urlCandidates.join(', '));
  }

  async function loadIncludes() {
    const els = Array.from(document.querySelectorAll('[data-include]'));
    if (!els.length) return;

    await Promise.all(
      els.map(async (el) => {
        const src = el.getAttribute('data-include');
        const rel = src.replace(/^\//, '');
        const candidates = [];
        // Priorité: chemin tel quel, puis variantes communes
        candidates.push(src);
        if (!src.startsWith('/')) candidates.push('/' + src);
        candidates.push(rel);
        candidates.push('../' + rel);

        const html = await fetchFirstWorking(candidates);
        el.innerHTML = html;
      })
    );

    // Ré-initialiser les comportements dépendants du header inséré
    try {
      if (typeof initializeTheme === 'function') initializeTheme();
      if (typeof initializeHamburger === 'function') initializeHamburger();
    } catch (e) {
      console.warn('Ré-init des modules après include a échoué:', e);
    }

    document.dispatchEvent(new CustomEvent('partials:loaded'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadIncludes);
  } else {
    loadIncludes();
  }
})();

// ================================
// Normalisation des liens du header/footer selon la page courante
// ================================
(function(){
  function prefix() {
    try { return /\/pages\//.test(location.pathname) ? '../' : ''; } catch { return ''; }
  }
  function fixHeaderLinks() {
    const pref = prefix();
    const root = document.querySelector('header');
    if (!root) return;

    // Liens
    root.querySelectorAll('a[data-href]').forEach(a => {
      const raw = a.getAttribute('data-href') || '';
      if (/^(https?:|mailto:|#)/i.test(raw)) {
        a.setAttribute('href', raw);
      } else {
        a.setAttribute('href', pref + raw);
      }
    });

    // Images
    root.querySelectorAll('img[data-src]').forEach(img => {
      const raw = img.getAttribute('data-src') || '';
      if (!raw) return;
      img.setAttribute('src', pref + raw);
    });
  }

  document.addEventListener('partials:loaded', fixHeaderLinks);
  if (document.readyState !== 'loading') {
    // Au cas où le header est déjà inséré (cache ou vitesse)
    setTimeout(fixHeaderLinks, 0);
  } else {
    document.addEventListener('DOMContentLoaded', () => setTimeout(fixHeaderLinks, 0));
  }
})();


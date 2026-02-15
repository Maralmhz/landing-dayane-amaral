(() => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const navToggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('.nav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    });

    nav.addEventListener('click', (e) => {
      const target = e.target;
      if (target instanceof HTMLAnchorElement) {
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Abrir menu');
      }
    });
  }

  const form = document.getElementById('leadForm');
  const success = document.querySelector('.form-success');

  const rules = {
    associacao: (v) => v.trim().length >= 2 || 'Informe o nome da associação.',
    responsavel: (v) => v.trim().length >= 2 || 'Informe o nome do responsável.',
    cargo: (v) => v.trim().length >= 2 || 'Informe o cargo.',
    telefone: (v) => {
      const digits = v.replace(/\D/g, '');
      return digits.length >= 10 || 'Informe um telefone válido.';
    },
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Informe um email válido.',
    qtd: (v) => Number(v) > 0 || 'Informe a quantidade aproximada de associados.',
    cidade: (v) => v.trim().length >= 3 || 'Informe a cidade e estado.',
    indicacao: (v) => v.trim().length >= 2 || 'Informe quem indicou o serviço.'
  };

  function setError(name, message) {
    const el = document.querySelector(`[data-error-for="${name}"]`);
    if (el) el.textContent = message || '';
  }

  function validateField(input) {
    const name = input.name;
    const rule = rules[name];
    if (!rule) return true;

    const result = rule(input.value);
    const ok = result === true;
    setError(name, ok ? '' : String(result));
    input.toggleAttribute('aria-invalid', !ok);
    return ok;
  }

  if (form) {
    const inputs = Array.from(form.querySelectorAll('input'));
    inputs.forEach((input) => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.hasAttribute('aria-invalid')) validateField(input);
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let ok = true;
      inputs.forEach((input) => { ok = validateField(input) && ok; });

      if (!ok) {
        const firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const data = Object.fromEntries(new FormData(form).entries());
      try {
        localStorage.setItem('dayane_amaral_lead', JSON.stringify({
          ...data,
          createdAt: new Date().toISOString()
        }));
      } catch (_) {}

      if (success) {
        success.hidden = false;
        success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      form.reset();
      inputs.forEach((input) => {
        input.removeAttribute('aria-invalid');
        setError(input.name, '');
      });
    });
  }
})();

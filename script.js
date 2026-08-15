// NAV: scrolled state
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// NAV: mobile toggle
const navToggle = document.getElementById('nav-toggle');
const navLinks  = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// FADE-IN on scroll
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

document.querySelectorAll(
  '.letter-block, .col-text, .col-image, .image-placeholder, ' +
  '.space-item, .mat-item, .build-step, ' +
  '.info-block, .volunteer-note, .volunteer-form, ' +
  'h2, .section-intro, .architects-inner'
).forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// VOLUNTEER FORM
const form      = document.getElementById('volunteer-form');
const successEl = document.getElementById('form-success');
const submitBtn = document.getElementById('submit-btn');

function setError(fieldId, msg) {
  const errEl = document.getElementById(fieldId + '-error');
  const input = document.getElementById(fieldId);
  if (errEl) errEl.textContent = msg;
  if (input) input.classList.toggle('error', !!msg);
}

function clearErrors() {
  ['name', 'email', 'message'].forEach(id => setError(id, ''));
}

function validate(data) {
  let ok = true;

  if (!data.name.trim()) {
    setError('name', 'Please tell us your name.');
    ok = false;
  }

  if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    setError('email', 'Please enter a valid email address.');
    ok = false;
  }

  if (!data.message.trim()) {
    setError('message', 'Please say a few words — we\'d love to hear from you.');
    ok = false;
  }

  return ok;
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  clearErrors();

  const interests = [...form.querySelectorAll('input[name="interest"]:checked')].map(cb => cb.value);

  const data = {
    name:         form.name.value,
    email:        form.email.value,
    phone:        form.phone.value,
    connection:   form.connection.value,
    location:     form.location.value,
    interests,
    availability: form.availability.value,
    message:      form.message.value,
  };

  if (!validate(data)) return;

  submitBtn.textContent = 'Sending…';
  submitBtn.disabled = true;

  // Replace YOUR_FORM_ID with your Formspree form ID (free at formspree.io)
  const ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

  try {
    if (ENDPOINT.includes('YOUR_FORM_ID')) {
      // Dev mode — simulate success
      await new Promise(r => setTimeout(r, 900));
      showSuccess();
    } else {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) showSuccess();
      else throw new Error();
    }
  } catch {
    submitBtn.textContent = 'Send us a note';
    submitBtn.disabled = false;
    alert('Something went wrong. Please email us directly at shreekantbohra@gmail.com');
  }

  function showSuccess() {
    form.reset();
    submitBtn.style.display = 'none';
    successEl.hidden = false;
    successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
});

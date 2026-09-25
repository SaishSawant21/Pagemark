(function () {
  'use strict';

  /* ── refs ── */
  const launcher = document.getElementById('pmai-launcher');
  const panel = document.getElementById('pmai-panel');
  const closeBtn = document.getElementById('pmai-close');
  const messages = document.getElementById('pmai-messages');
  const welcome = document.getElementById('pmai-welcome');
  const form = document.getElementById('pmai-form');
  const input = document.getElementById('pmai-input');
  const sendBtn = document.getElementById('pmai-send');
  const chips = document.querySelectorAll('.pmai-chip');

  /* ── state ── */
  let isOpen = false;
  let isLoading = false;
  let welcomed = true; // welcome state showing

  /* ── open / close ── */
  function open() {
    isOpen = true;
    panel.classList.add('pmai-open');
    panel.setAttribute('aria-hidden', 'false');
    input.focus();
  }
  function close() {
    isOpen = false;
    panel.classList.remove('pmai-open');
    panel.setAttribute('aria-hidden', 'true');
  }

  launcher.addEventListener('click', () => isOpen ? close() : open());
  closeBtn.addEventListener('click', close);

  /* ── textarea auto-grow ── */
  input.addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 120) + 'px';
  });

  /* ── enter to send ── */
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      form.requestSubmit();
    }
  });

  /* ── chips ── */
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      input.value = chip.dataset.prompt;
      input.dispatchEvent(new Event('input'));
      form.requestSubmit();
    });
  });

  /* ── helpers ── */
  function scrollBottom() {
    messages.scrollTop = messages.scrollHeight;
  }

  function dismissWelcome() {
    if (welcomed) {
      welcome.remove();
      welcomed = false;
    }
  }

  function aiIcon() {
    return `<div class="pmai-ai-icon">
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="14" height="14">
      <path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0z" />
    </svg>
  </div>`;
  }

  /* ── add user message (XSS-safe) ── */
  function addUser(text) {
    dismissWelcome();
    const row = document.createElement('div');
    row.className = 'pmai-msg-user';
    const bubble = document.createElement('div');
    bubble.className = 'pmai-bubble';
    bubble.textContent = text; // textContent = safe
    row.appendChild(bubble);
    messages.appendChild(row);
    scrollBottom();
  }

  /* ── add AI message ── */
  function addAI(html) {
    const row = document.createElement('div');
    row.className = 'pmai-msg-ai';
    row.innerHTML = aiIcon() + `<div class="pmai-bubble">${html}</div>`;
    messages.appendChild(row);
    scrollBottom();
  }

  /* ── loader ── */
  function showLoader() {
    const el = document.createElement('div');
    el.id = 'pmai-loader';
    el.className = 'pmai-msg-ai';
    el.innerHTML = aiIcon() + `
  <div class="pmai-dots">
    <div class="pmai-dot"></div>
    <div class="pmai-dot"></div>
    <div class="pmai-dot"></div>
  </div>`;
    messages.appendChild(el);
    scrollBottom();
  }
  function hideLoader() {
    document.getElementById('pmai-loader')?.remove();
  }

  /* ── format AI response ── */
  function format(text) {
    return marked.parse(text, {
      breaks: true,
      gfm: true
    });
  }

  /* ── loading state ── */
  function setLoading(val) {
    isLoading = val;
    sendBtn.disabled = val;
    input.disabled = val;
    if (val) input.blur();
    else input.focus();
  }

  /* ── submit ── */
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const text = input.value.trim();
    if (!text || isLoading) return;

    addUser(text);
    input.value = '';
    input.style.height = 'auto';
    setLoading(true);
    showLoader();

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      const data = await res.json();
      hideLoader();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      addAI(format(data.response));
    } catch (err) {
      hideLoader();
      addAI('<p>Sorry, I couldn\'t reach PageMark AI right now. Please try again.</p>');
      console.error('[PageMark AI]', err);
    } finally {
      setLoading(false);
    }
  });

})();

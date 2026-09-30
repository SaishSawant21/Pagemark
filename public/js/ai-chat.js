(function () {
  'use strict';

  /* ─────────────────────────────────────────
     Refs
  ───────────────────────────────────────── */

  const launcher = document.getElementById('pmai-launcher');
  const panel = document.getElementById('pmai-panel');
  const closeBtn = document.getElementById('pmai-close');
  const messages = document.getElementById('pmai-messages');
  const welcome = document.getElementById('pmai-welcome');
  const form = document.getElementById('pmai-form');
  const input = document.getElementById('pmai-input');
  const sendBtn = document.getElementById('pmai-send');
  const chips = document.querySelectorAll('.pmai-chip');
  const askBookAI = document.getElementById('ask-book-ai');


  /* ─────────────────────────────────────────
     State
  ───────────────────────────────────────── */

  let isOpen = false;
  let isLoading = false;
  let welcomed = true;
  let bookContext = null;


  /* ─────────────────────────────────────────
     Safety check
     Launcher is optional because the
     book-detail page does not have one.
  ───────────────────────────────────────── */

  if (
    !panel ||
    !closeBtn ||
    !messages ||
    !welcome ||
    !form ||
    !input ||
    !sendBtn
  ) {
    console.warn(
      '[PageMark AI] AI widget elements are missing from this page.'
    );

    return;
  }


  /* ─────────────────────────────────────────
     Open / Close
  ───────────────────────────────────────── */

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


  /* ─────────────────────────────────────────
     Floating launcher
     Only exists on the shelf page.
  ───────────────────────────────────────── */

  if (launcher) {
    launcher.addEventListener('click', () => {
      isOpen ? close() : open();
    });
  }


  /* ─────────────────────────────────────────
     Close button
  ───────────────────────────────────────── */

  closeBtn.addEventListener('click', close);


  /* ─────────────────────────────────────────
     Book Context
  ───────────────────────────────────────── */

  function getBookContext() {
    if (!askBookAI) {
      return null;
    }

    return {
      id: askBookAI.dataset.bookId || '',
      title: askBookAI.dataset.bookTitle || '',
      author: askBookAI.dataset.bookAuthor || '',
      rating: Number(askBookAI.dataset.bookRating) || 0,
      genre: askBookAI.dataset.bookGenre || '',
      notes: askBookAI.dataset.bookNotes || ''
    };
  }


  function setBookContext(book) {
    bookContext = book;

    const title = document.getElementById(
      'pmai-welcome-title'
    );

    const subtitle = document.getElementById(
      'pmai-welcome-sub'
    );

    if (title && book?.title) {
      title.textContent = `Ask about ${book.title}`;
    }

    if (subtitle && book?.title) {
      subtitle.textContent =
        `Explore the ideas, themes, and notes about ${book.title}.`;
    }
  }


  /* ─────────────────────────────────────────
     Initialize Book Context
  ───────────────────────────────────────── */

  if (askBookAI) {
    bookContext = getBookContext();

    if (bookContext) {
      setBookContext(bookContext);
    }


    /* ───────────────────────────────────────
       "Ask AI about this book" button
       opens the popup directly.
    ─────────────────────────────────────── */

    askBookAI.addEventListener('click', () => {
      bookContext = getBookContext();

      if (bookContext) {
        setBookContext(bookContext);
      }

      open();
    });
  }


  /* ─────────────────────────────────────────
     Textarea Auto Grow
  ───────────────────────────────────────── */

  input.addEventListener('input', function () {
    this.style.height = 'auto';

    this.style.height =
      Math.min(this.scrollHeight, 120) + 'px';
  });


  /* ─────────────────────────────────────────
     Enter to Send
  ───────────────────────────────────────── */

  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();

      form.requestSubmit();
    }
  });


  /* ─────────────────────────────────────────
     Prompt Chips
  ───────────────────────────────────────── */

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      input.value = chip.dataset.prompt || '';

      input.dispatchEvent(
        new Event('input')
      );

      form.requestSubmit();
    });
  });


  /* ─────────────────────────────────────────
     Helpers
  ───────────────────────────────────────── */

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
    return `
      <div class="pmai-ai-icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
          width="14"
          height="14"
        >
          <path d="M17.593 3.322c1.1 0.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0z" />
        </svg>
      </div>
    `;
  }


  /* ─────────────────────────────────────────
     Add User Message
  ───────────────────────────────────────── */

  function addUser(text) {
    dismissWelcome();

    const row = document.createElement('div');

    row.className = 'pmai-msg-user';

    const bubble = document.createElement('div');

    bubble.className = 'pmai-bubble';
    bubble.textContent = text;

    row.appendChild(bubble);

    messages.appendChild(row);

    scrollBottom();
  }


  /* ─────────────────────────────────────────
     Add AI Message
  ───────────────────────────────────────── */

  function addAI(html) {
    const row = document.createElement('div');

    row.className = 'pmai-msg-ai';

    row.innerHTML =
      aiIcon() +
      `<div class="pmai-bubble">${html}</div>`;

    messages.appendChild(row);

    scrollBottom();
  }


  /* ─────────────────────────────────────────
     Loader
  ───────────────────────────────────────── */

  function showLoader() {
    const el = document.createElement('div');

    el.id = 'pmai-loader';
    el.className = 'pmai-msg-ai';

    el.innerHTML = `
      ${aiIcon()}

      <div class="pmai-dots">
        <div class="pmai-dot"></div>
        <div class="pmai-dot"></div>
        <div class="pmai-dot"></div>
      </div>
    `;

    messages.appendChild(el);

    scrollBottom();
  }


  function hideLoader() {
    document
      .getElementById('pmai-loader')
      ?.remove();
  }


  /* ─────────────────────────────────────────
     Format AI Response
  ───────────────────────────────────────── */

  function format(text) {
    return marked.parse(text, {
      breaks: true,
      gfm: true
    });
  }


  /* ─────────────────────────────────────────
     Loading State
  ───────────────────────────────────────── */

  function setLoading(val) {
    isLoading = val;

    sendBtn.disabled = val;
    input.disabled = val;

    if (val) {
      input.blur();
    } else {
      input.focus();
    }
  }


  /* ─────────────────────────────────────────
     Submit
  ───────────────────────────────────────── */

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const text = input.value.trim();

    if (!text || isLoading) {
      return;
    }

    addUser(text);

    input.value = '';
    input.style.height = 'auto';

    setLoading(true);
    showLoader();

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          message: text,
          book: bookContext
        })
      });

      const data = await res.json();

      hideLoader();

      if (!res.ok) {
        throw new Error(
          data.error || 'Request failed'
        );
      }

      addAI(format(data.response));

    } catch (err) {
      hideLoader();

      addAI(`
        <p>
          Sorry, I couldn't reach PageMark AI right now.
          Please try again.
        </p>
      `);

      console.error(
        '[PageMark AI]',
        err
      );

    } finally {
      setLoading(false);
    }
  });

})();
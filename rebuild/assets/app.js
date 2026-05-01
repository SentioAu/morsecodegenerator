(() => {
  const MORSE = {
    A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....', I: '..', J: '.---',
    K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-',
    U: '..-', V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..', 0: '-----', 1: '.----', 2: '..---',
    3: '...--', 4: '....-', 5: '.....', 6: '-....', 7: '--...', 8: '---..', 9: '----.'
  };

  const REV = Object.fromEntries(Object.entries(MORSE).map(([k, v]) => [v, k]));

  const root = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('mcg-rebuild-theme');
  if (savedTheme) root.dataset.theme = savedTheme;

  toggle?.addEventListener('click', () => {
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    root.dataset.theme = next;
    localStorage.setItem('mcg-rebuild-theme', next);
  });

  const toastEl = document.getElementById('toast');
  let toastTimer = null;
  const showToast = (text) => {
    if (!toastEl) return;
    toastEl.textContent = text;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 1400);
  };

  const input = document.getElementById('input');
  const output = document.getElementById('output');
  if (!input || !output) return;

  const toMorse = (text) => text
    .toUpperCase()
    .split(' ')
    .map((w) => [...w].map((c) => MORSE[c] || '').filter(Boolean).join(' '))
    .join(' / ');

  const toText = (morse) => morse
    .split('/')
    .map((w) => w.trim().split(/\s+/).map((t) => REV[t] || '').join(''))
    .join(' ')
    .trim();

  const run = (mode) => {
    const value = input.value.trim();
    output.value = mode === 'text'
      ? toMorse(value)
      : mode === 'morse'
        ? toText(value)
        : (/[.-]/.test(value) ? toText(value) : toMorse(value));
  };

  const historyKey = 'mcg-rebuild-history';
  const saveHistory = () => {
    const value = output.value.trim();
    if (!value) return;
    const list = JSON.parse(localStorage.getItem(historyKey) || '[]');
    list.unshift(value);
    localStorage.setItem(historyKey, JSON.stringify(list.slice(0, 20)));
  };

  document.getElementById('toMorse')?.addEventListener('click', () => { run('text'); saveHistory(); });
  document.getElementById('toText')?.addEventListener('click', () => { run('morse'); saveHistory(); });
  document.getElementById('auto')?.addEventListener('click', () => { run('auto'); saveHistory(); });

  document.getElementById('swap')?.addEventListener('click', () => {
    const temp = input.value;
    input.value = output.value;
    output.value = temp;
    showToast('Swapped input/output');
  });

  document.getElementById('copy')?.addEventListener('click', async () => {
    if (!output.value.trim()) return;
    await navigator.clipboard.writeText(output.value);
    showToast('Copied output');
  });

  document.getElementById('share')?.addEventListener('click', async () => {
    const url = new URL(window.location.href);
    if (input.value.trim()) url.searchParams.set('q', input.value.trim());
    else url.searchParams.delete('q');
    await navigator.clipboard.writeText(url.toString());
    showToast('Copied share link');
  });

  document.getElementById('download')?.addEventListener('click', () => {
    const value = output.value.trim();
    if (!value) return;
    const blob = new Blob([value], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'morse-output.txt';
    a.click();
    URL.revokeObjectURL(a.href);
  });

  let currentCtx = null;
  document.getElementById('play')?.addEventListener('click', () => {
    const code = (output.value || '').replace(/[^.\-/\s]/g, '').trim();
    if (!code) return;

    if (currentCtx) currentCtx.close();
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    currentCtx = ctx;
    const wpm = Number(document.getElementById('wpm')?.value || 14);
    const unit = 1.2 / Math.max(6, wpm);

    let t = ctx.currentTime;
    for (const token of code.split(/\s+/)) {
      if (token === '/') {
        t += unit * 7;
        continue;
      }
      for (const c of token) {
        const dur = c === '-' ? unit * 3 : unit;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = 620;
        gain.gain.value = 0.16;
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + dur);
        t += dur + unit;
      }
      t += unit * 2;
    }
  });

  document.getElementById('stop')?.addEventListener('click', () => {
    if (currentCtx) {
      currentCtx.close();
      currentCtx = null;
      showToast('Playback stopped');
    }
  });

  document.getElementById('loadHistory')?.addEventListener('click', () => {
    const list = JSON.parse(localStorage.getItem(historyKey) || '[]');
    if (!list.length) return showToast('No history yet');
    output.value = list[0];
    showToast('Loaded latest history');
  });

  const initial = new URL(window.location.href).searchParams.get('q');
  if (initial) {
    input.value = initial;
    run('auto');
  }
})();

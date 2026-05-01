(() => {
  const root = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  const saved = localStorage.getItem('mcg-theme-v2');
  if (saved) root.dataset.theme = saved;
  toggle?.addEventListener('click', () => {
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    root.dataset.theme = next;
    localStorage.setItem('mcg-theme-v2', next);
  });

  const input = document.getElementById('input');
  const output = document.getElementById('output');
  const run = async (mode) => {
    if (!input || !output) return;
    const res = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: input.value, mode }),
    });
    const data = await res.json();
    output.value = data.result || '';
  };

  document.getElementById('textToMorse')?.addEventListener('click', () => run('text_to_morse'));
  document.getElementById('morseToText')?.addEventListener('click', () => run('morse_to_text'));
  document.getElementById('auto')?.addEventListener('click', () => run('auto'));

  document.getElementById('copy')?.addEventListener('click', async () => {
    if (!output?.value.trim()) return;
    await navigator.clipboard.writeText(output.value);
  });

  document.getElementById('share')?.addEventListener('click', async () => {
    if (!input) return;
    const url = new URL(window.location.href);
    if (input.value.trim()) url.searchParams.set('q', input.value.trim());
    else url.searchParams.delete('q');
    await navigator.clipboard.writeText(url.toString());
  });

  if (input?.value.trim() && output) run('auto');
})();

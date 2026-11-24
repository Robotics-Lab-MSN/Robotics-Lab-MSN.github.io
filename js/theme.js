/* Apply the saved preference before painting. Otherwise follow the device. */
(function () {
  const key = 'rsil-color-theme';
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  let saved;
  try { saved = localStorage.getItem(key); } catch (_) {}
  const valid = value => value === 'dark' || value === 'light';
  function apply(theme) {
    document.documentElement.dataset.theme = theme;
    document.querySelectorAll('.theme-toggle').forEach(button => {
      button.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
      button.setAttribute('aria-label', 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' mode');
      button.setAttribute('aria-pressed', String(theme === 'dark'));
    });
  }
  apply(valid(saved) ? saved : system.matches ? 'dark' : 'light');
  document.addEventListener('DOMContentLoaded', () => {
    apply(document.documentElement.dataset.theme);
    document.querySelectorAll('.theme-toggle').forEach(button => button.addEventListener('click', () => {
      saved = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(key, saved); } catch (_) {}
      apply(saved);
    }));
  });
  system.addEventListener('change', event => { if (!valid(saved)) apply(event.matches ? 'dark' : 'light'); });
})();

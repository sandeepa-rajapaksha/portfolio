/* Runs before first paint: applies the saved theme (default: dark). */
(function () {
  var root = document.documentElement;
  var theme = 'dark';

  try {
    var saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') theme = saved;
  } catch (e) { /* storage blocked: stay on the default */ }

  root.setAttribute('data-theme', theme);
  root.classList.add('js');

  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'light' ? '#eef1ff' : '#060a2c');
})();

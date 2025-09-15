// --- Build TOC from sections ---
const toc = document.getElementById('toc');
const sections = Array.from(document.querySelectorAll('main section.main-section'));

sections.forEach(sec => {
  const id = sec.id || sec.querySelector('header')?.textContent?.toLowerCase().replace(/\s+/g, '-');
  sec.id = id;
  const title = sec.querySelector('header')?.textContent || id;
  const li = document.createElement('li');
  const a = document.createElement('a');
  a.className = 'nav-link';
  a.href = `#${id}`;
  a.textContent = title;
  li.appendChild(a);
  toc.appendChild(li);
});

// --- Active section highlighting ---
const navLinks = Array.from(document.querySelectorAll('#toc .nav-link'));
const byId = id => navLinks.find(a => a.getAttribute('href') === `#${id}`);

const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(a => a.classList.remove('active'));
      const link = byId(e.target.id);
      link?.classList.add('active');
    }
  });
}, { rootMargin: '0px 0px -70% 0px', threshold: .1 });

sections.forEach(s => observer.observe(s));

// --- TOC filter ---
const filter = document.getElementById('tocFilter');
filter?.addEventListener('input', e => {
  const q = e.target.value.toLowerCase();
  navLinks.forEach(a => {
    const match = a.textContent.toLowerCase().includes(q);
    a.parentElement.style.display = match ? '' : 'none';
  });
});

// --- Theme toggle ---
const themeBtn = document.getElementById('themeToggle');
const key = 'docs-theme';
const applyTheme = mode => document.documentElement.dataset.theme = mode;
const stored = localStorage.getItem(key);
if (stored) applyTheme(stored);

themeBtn?.addEventListener('click', () => {
  const current = document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const next = current === 'dark' ? 'light' : 'dark';
  localStorage.setItem(key, next);
  applyTheme(next);
});

// --- Footer year ---
document.getElementById('year').textContent = new Date().getFullYear();

// --- Keyboard quick find (press "/") ---
document.addEventListener('keydown', e => {
  if (e.key === '/' && !e.target.matches('input,textarea')) {
    e.preventDefault();
    document.getElementById('tocFilter')?.focus();
  }
});

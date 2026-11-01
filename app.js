// Cuenta atrás del evento: solo si hay JS; sin él no se muestra ningún número (nada caduca en el HTML)
for (const el of document.querySelectorAll('[data-until]')) {
  const d = Math.ceil((Date.parse(el.dataset.until + 'T10:00:00+01:00') - Date.now()) / 864e5);
  if (d > 0) { el.textContent = el.dataset.t.replace('{n}', d); el.hidden = false; }
}

// Buscador de /sources/: filtra la lista por lo que se escriba (nombre, título, año); sin JS no aparece
const q = document.getElementById('src-q');
if (q) {
  q.closest('label').hidden = false;
  const filas = [...document.querySelectorAll('.src-list li')];
  q.addEventListener('input', () => {
    const t = q.value.trim().toLowerCase();
    for (const li of filas) li.hidden = !!t && !li.textContent.toLowerCase().includes(t);
    for (const g of document.querySelectorAll('.src-group')) g.hidden = !g.querySelector('li:not([hidden])');
  });
}

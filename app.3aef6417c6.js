// Días de calendario hasta la fecha anunciada; no se atribuye una hora al evento.
const hoy = new Date();
const dia = Date.UTC(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
for (const el of document.querySelectorAll('[data-until]')) {
  const d = Math.round((Date.parse(el.dataset.until + 'T00:00:00Z') - dia) / 864e5);
  if (d > 0) { el.textContent = el.dataset.t.replace('{n}', d); el.hidden = false; }
}

// Se guarda el texto de cada fuente una vez; escribir no vuelve a recorrer todo su contenido.
const q = document.getElementById('src-q');
if (q) {
  q.closest('label').hidden = false;
  const aviso = document.getElementById('src-results');
  const grupos = [...document.querySelectorAll('.src-group')].map(el => ({
    el,
    filas: [...el.querySelectorAll('li')].map(li => ({li, texto: li.textContent.toLowerCase()})),
  }));
  let espera;
  const filtrar = () => {
    const texto = q.value.trim().toLowerCase();
    let total = 0;
    for (const grupo of grupos) {
      let visibles = 0;
      for (const {li, texto: contenido} of grupo.filas) {
        const coincide = !texto || contenido.includes(texto);
        if (li.hidden === coincide) li.hidden = !coincide;
        if (coincide) visibles++;
      }
      grupo.el.hidden = !visibles;
      total += visibles;
    }
    aviso.textContent = total ? aviso.dataset.t.replace('{n}', total) : aviso.dataset.empty;
    aviso.hidden = false;
  };
  filtrar();
  q.addEventListener('input', () => {
    clearTimeout(espera);
    espera = setTimeout(filtrar, 80);
  });
}

// Cerrar el menú con Escape devuelve el foco a su botón.
for (const menu of document.querySelectorAll('.menu, .lang')) {
  menu.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.open) {
      menu.open = false;
      menu.querySelector('summary').focus();
    }
  });
  document.addEventListener('click', event => {
    if (menu.open && (!menu.contains(event.target) || event.target.closest('a'))) menu.open = false;
  });
}

// El aviso de vuelta de la newsletter también se anuncia a quien usa lector de pantalla.
const mensaje = document.getElementById(location.hash.slice(1));
if (mensaje && mensaje.classList.contains('nl-msg')) mensaje.focus();

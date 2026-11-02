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

// Sin salir de la página: conservar los campos ante un error y evitar envíos simultáneos.
// Sin estas APIs se mantiene el envío HTML del formulario.
const alta = document.querySelector('.newsletter form');
if (alta && window.fetch && window.AbortController) {
  const panel = alta.closest('.newsletter');
  const avisos = [...panel.querySelectorAll('.nl-msg')];
  const boton = alta.querySelector('button[type="submit"]');
  const etiqueta = boton.querySelector('.nl-submit-label');
  const normal = etiqueta.textContent;
  const progreso = panel.querySelector('.nl-progress');
  alta.addEventListener('submit', async event => {
    event.preventDefault();
    if (alta.getAttribute('aria-busy') === 'true') return;
    avisos.forEach(el => el.classList.remove('is-visible'));
    if (avisos.some(el => '#' + el.id === location.hash)) {
      history.replaceState(null, '', location.pathname + location.search);
    }
    const datos = new FormData(alta);
    const control = new AbortController();
    const limite = setTimeout(() => control.abort(), 20000);
    alta.setAttribute('aria-busy', 'true');
    boton.disabled = true;
    etiqueta.textContent = progreso.textContent = boton.dataset.sending;
    let resultado = 'subscribe-unavailable';
    try {
      const respuesta = await fetch(alta.action, {
        method: 'POST', body: new URLSearchParams(datos),
        headers: { Accept: 'application/json' },
        credentials: 'omit', redirect: 'error', signal: control.signal,
      });
      const contenido = await respuesta.json();
      if (respuesta.ok && contenido.status === 'subscribed') {
        resultado = 'subscribed';
        alta.reset();
      } else if (respuesta.status === 422 && contenido.status === 'subscribe-error') {
        resultado = 'subscribe-error';
      }
    } catch {
      // La respuesta puede perderse después del alta; no reenviar automáticamente.
    } finally {
      clearTimeout(limite);
      alta.removeAttribute('aria-busy');
      boton.disabled = false;
      etiqueta.textContent = normal;
      progreso.textContent = '';
    }
    const aviso = panel.querySelector('#' + resultado);
    aviso.classList.add('is-visible');
    aviso.focus();
  });
}

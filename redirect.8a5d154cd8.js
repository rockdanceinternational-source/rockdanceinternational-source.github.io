(function () {
  var p = location.pathname, l = p.toLowerCase(), fin = location.search + location.hash;
  function ir(ruta) {
    var destino = new URL(ruta + fin, location.origin);
    if (destino.origin === location.origin && destino.href !== location.href) location.replace(destino.href);
  }
  if (!/\.[a-z0-9]+$/.test(l) && l.slice(-1) !== "/") l += "/";
  var r = {"/people/king-uprock/": "/people/", "/crews/dynasty-rockers/": "/crews/"};
  if (r[l]) return ir(r[l]);
  var m = l.match(/^\/(es|pt-br|fr|it|de|pl|cs|ru|ja|ko|zh-hans)(\/.*)$/);
  if (m) return ir(r[m[2]] || m[2]);
  if (l !== p) ir(l);
})();
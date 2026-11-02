
(function () {
  var p = location.pathname, l = p.toLowerCase(), fin = location.search + location.hash;
  if (!/\.[a-z0-9]+$/.test(l) && l.slice(-1) !== "/") l += "/";
  var r = {"/people/king-uprock/": "/people/", "/crews/dynasty-rockers/": "/crews/"};
  var m = l.match(/^\/(es|pt-br|fr|it|de|pl|cs|ru|ja|ko|zh-hans)(\/.*)$/);
  if (m) l = m[2];
  var destino = r[l] || l;
  if (destino !== p) location.replace(location.origin + destino + fin);
})();

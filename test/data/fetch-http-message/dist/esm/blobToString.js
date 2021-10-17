// https://stackoverflow.com/a/23024613/3150390

/* c8 ignore start */
export default function blobToString(b) {
  const u = URL.createObjectURL(b);
  const x = new XMLHttpRequest();
  x.open("GET", u, false);
  x.send();
  URL.revokeObjectURL(u);
  return x.responseText;
}
/* c8 ignore stop */
//# sourceMappingURL=blobToString.js.map
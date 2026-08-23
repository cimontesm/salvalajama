export function formatPrice(value) {
  const n = Number(value ?? 0);
  return `$${n.toFixed(2)}`;
}

export function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  return date.toLocaleDateString('es-EC', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatTime(value) {
  if (!value) return '';
  const date = new Date(value);
  return date.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' });
}

export function discountPercent(originalPrice, discountedPrice) {
  const original = Number(originalPrice ?? 0);
  const discounted = Number(discountedPrice ?? 0);
  if (!original) return 0;
  return Math.round(((original - discounted) / original) * 100);
}

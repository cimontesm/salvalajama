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

// Capitaliza solo la primera letra para mostrar valores guardados en
// minusculas (status, category, etc.) de forma legible en pantalla, sin
// tocar el valor real que se guarda/envia al backend.
export function capitalize(value) {
  if (!value) return '';
  const text = String(value);
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Convierte la respuesta de error de la API en un mensaje legible para un
// Alert: prioriza los errores de validacion por campo que manda Laravel en
// `errors` (uno o mas mensajes por campo) en vez del "message" generico, y
// cae a un texto por defecto si no hay nada util que mostrar.
export function formatApiError(error, fallback = 'Ocurrio un error. Intenta de nuevo.') {
  const data = error?.response?.data;
  if (data?.errors && typeof data.errors === 'object') {
    const messages = Object.values(data.errors).flat().filter(Boolean);
    if (messages.length) return messages.join('\n');
  }
  if (typeof data?.message === 'string' && data.message) return data.message;
  if (typeof error?.message === 'string' && error.message) return error.message;
  return fallback;
}

export function discountPercent(originalPrice, discountedPrice) {
  const original = Number(originalPrice ?? 0);
  const discounted = Number(discountedPrice ?? 0);
  if (!original) return 0;
  return Math.round(((original - discounted) / original) * 100);
}

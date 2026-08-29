// Catálogos compartidos de la app: fuente única de verdad para
// categorías de establecimientos/publicaciones y ciudades, así se evita que
// un mismo valor quede guardado con mayúsculas/minúsculas distintas según
// quién lo escriba, y los filtros del catálogo de ofertas siempre calzan
// con lo que un establecimiento eligió al crear su publicación.
export const CATEGORIES = ['panadería', 'supermercado', 'restaurante', 'cafetería'];

// Principales ciudades de Ecuador (cabeceras cantonales más pobladas),
// en orden alfabético. Si la ciudad de alguien no está en la lista, el
// selector permite escribirla y la normaliza a "Formato Título".
export const CITIES = [
  'Ambato',
  'Babahoyo',
  'Cuenca',
  'Durán',
  'Esmeraldas',
  'Guayaquil',
  'Ibarra',
  'Latacunga',
  'Loja',
  'Machala',
  'Manta',
  'Milagro',
  'Portoviejo',
  'Quevedo',
  'Quito',
  'Riobamba',
  'Salinas',
  'Santa Elena',
  'Santo Domingo',
  'Tulcán',
];

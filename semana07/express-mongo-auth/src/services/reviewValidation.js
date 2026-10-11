const MAX_IMAGE_BYTES = 1024 * 1024;
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const fail = (message) => Object.assign(new Error(message), { status: 400 });

const text = (value, field, { max, required = false }) => {
  if (value === undefined) return undefined;
  const clean = typeof value === 'string' ? value.trim() : '';
  if (required && !clean) throw fail(`${field} es obligatorio`);
  if (clean.length > max) throw fail(`${field} no puede superar ${max} caracteres`);
  return clean;
};

const whole = (value, field, { min, max }) => {
  if (value === undefined) return undefined;
  const number = Number(value);
  if (!Number.isInteger(number) || number < min || number > max) {
    throw fail(`${field} debe ser un entero entre ${min} y ${max}`);
  }
  return number;
};

// Convierte un data URL en { type, data }; null elimina la imagen.
export const parseImage = (value) => {
  if (value === undefined) return undefined;
  if (value === null) return null;
  const match = /^data:([\w/+.-]+);base64,([A-Za-z0-9+/=]+)$/.exec(typeof value === 'string' ? value : '');
  if (!match || !IMAGE_TYPES.includes(match[1])) {
    throw fail('La imagen debe ser JPEG, PNG o WebP');
  }
  const data = Buffer.from(match[2], 'base64');
  if (data.length === 0 || data.length > MAX_IMAGE_BYTES) {
    throw fail('La imagen no puede superar 1 MB');
  }
  return { type: match[1], data };
};

// partial = true (PUT): solo se validan los campos presentes.
export const parseReview = (body = {}, { partial = false } = {}) => {
  const review = {
    title: text(body.title, 'El título', { max: 120, required: !partial || body.title !== undefined }),
    year: whole(body.year, 'El año', { min: 1888, max: 2100 }),
    minutes: whole(body.minutes, 'La duración', { min: 1, max: 999 }),
    format: text(body.format, 'El formato', { max: 40 }),
    tags: text(body.tags, 'Las etiquetas', { max: 100 }),
    score: whole(body.score, 'La nota', { min: 0, max: 10 }),
    text: text(body.text, 'La reseña', { max: 2000 })
  };
  if (!partial && (review.title === undefined || review.year === undefined || review.text === undefined)) {
    throw fail('Título, año y reseña son obligatorios');
  }
  const image = parseImage(body.image);
  const clean = Object.fromEntries(Object.entries(review).filter(([, value]) => value !== undefined));
  return { fields: clean, image };
};

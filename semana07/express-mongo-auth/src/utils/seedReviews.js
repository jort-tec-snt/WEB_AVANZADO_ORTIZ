import reviewRepository from '../repositories/ReviewRepository.js';

const FILMS = [
  { title: 'Tetsuo: The Iron Man', year: 1989, minutes: 67, format: '16 mm · B/N', tags: 'Cyberpunk // Body horror', score: 9,
    text: 'Un asalariado se convierte en chatarra: metal que brota de la carne a ritmo de percusión industrial. Es ruido, stop motion y furia en una hora; agota y fascina por igual.' },
  { title: 'Begotten', year: 1989, minutes: 72, format: '16 mm · B/N', tags: 'Experimental // Ritual', score: 8,
    text: 'Sin diálogos y con un grano tan sucio que parece grabado en un sótano. Más pesadilla que película: no se disfruta, se sobrevive.' },
  { title: 'Videodrome', year: 1983, minutes: 87, format: '35 mm · Color', tags: 'Body horror // Medios', score: 9,
    text: 'La televisión como carne y la carne como pantalla. Cronenberg predijo la obsesión con lo que consumimos, y sigue perturbando.' },
  { title: 'Possession', year: 1981, minutes: 124, format: '35 mm · Color', tags: 'Horror // Ruptura', score: 9,
    text: 'Una separación que se descompone en algo monstruoso. La actuación de Isabelle Adjani en el metro es de lo más desquiciado que ha dado el cine.' },
  { title: 'Society', year: 1989, minutes: 99, format: '35 mm · Color', tags: 'Sátira // Body horror', score: 8,
    text: 'Comedia incómoda sobre la élite hasta que el último acto se desborda en efectos prácticos grotescos. Subestimada y muy inventiva.' },
  { title: 'Eraserhead', year: 1977, minutes: 89, format: '35 mm · B/N', tags: 'Surrealismo // Industrial', score: 8,
    text: 'Paranoia doméstica filmada como sueño febril. El sonido ambiente hace el trabajo pesado: entra por el oído y se queda.' },
  { title: 'Basket Case', year: 1982, minutes: 91, format: '16 mm · Color', tags: 'Bajo presupuesto // Culto', score: 7,
    text: 'Cine de grindhouse neoyorquino con un monstruo en una canasta y muchísimo corazón trash. Imperfecta, pero con carácter de sobra.' },
  { title: 'Carnival of Souls', year: 1962, minutes: 78, format: '35 mm · B/N', tags: 'Gótico // Culto', score: 7,
    text: 'Hecha con casi nada, pero su atmósfera de órgano y feria abandonada pesa más que muchos presupuestos grandes.' }
];

// Carga el catálogo inicial solo si la colección está vacía.
const seedReviews = async () => {
  if ((await reviewRepository.count()) === 0) {
    await reviewRepository.insertMany(FILMS);
    console.log(`Seeded reviews: ${FILMS.length}`);
  }
};

export default seedReviews;

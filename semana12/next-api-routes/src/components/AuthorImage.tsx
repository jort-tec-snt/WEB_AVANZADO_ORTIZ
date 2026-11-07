import Image from "next/image";

export const GENERIC_AUTHOR_IMAGE = "/img/autor-generico.webp";

type Props = { name: string; src?: string | null; sizes: string; priority?: boolean };

// Imagen del autor con respaldo generico. Las URL externas no pasan por el optimizador.
export default function AuthorImage({ name, src, sizes, priority }: Props) {
  const url = src || GENERIC_AUTHOR_IMAGE;
  return (
    <Image
      src={url}
      alt={`Ilustración de ${name}`}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={/^https?:\/\//.test(url)}
      className="plate__img"
    />
  );
}

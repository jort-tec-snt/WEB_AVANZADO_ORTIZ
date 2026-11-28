export default function Footer() {
  return (
    <footer className="mt-auto border-t-2 border-ink">
      <div className="shell eyebrow py-8 text-center">
        © {new Date().getFullYear()} ProductStore. Todos los derechos reservados.
      </div>
    </footer>
  );
}

import Link from "next/link";
import Image from "next/image";
import type { Session } from "next-auth";
import LogoutButton from "@/components/LogoutButton";

export default function Navbar({ session }: { session: Session | null }) {
  return (
    <nav className="nav glass" aria-label="Principal">
      <Link href="/" className="nav__brand">
        <span className="orb orb--logo" aria-hidden />
        <span className="nav__word">Aero<b>Gate</b></span>
      </Link>
      <ul className="nav__links">
        <li>
          <Link href="/dashboard" className="nav__link">
            Dashboard
          </Link>
        </li>
        {session?.user ? (
          <>
            <li>
              <Link href="/profile" className="nav__link">
                Profile
              </Link>
            </li>
            <li>
              <LogoutButton />
            </li>
            {session.user.image && (
              <li>
                <Image height={40} width={40} src={session.user.image} alt="Profile" className="nav__avatar" />
              </li>
            )}
          </>
        ) : (
          <li>
            <Link href="/signIn" className="nav__link">
              Iniciar sesión
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

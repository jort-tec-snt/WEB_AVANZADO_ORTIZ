import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { authOptions } from "@/lib/auth";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/signIn");

  return (
    <div className="page">
      <section className="profile glass">
        {session.user.image ? (
          <Image height={112} width={112} src={session.user.image} alt="Profile" className="profile__avatar" />
        ) : (
          <span className="orb orb--user welcome__orb" aria-hidden />
        )}
        <div className="profile__data">
          <h1 className="welcome__title">Profile</h1>
          <div>
            <span className="tile__label">Name</span>
            <div className="tile__value">{session.user.name}</div>
          </div>
          <div>
            <span className="tile__label">Email</span>
            <div className="tile__value">{session.user.email ?? "—"}</div>
          </div>
        </div>
      </section>
    </div>
  );
}

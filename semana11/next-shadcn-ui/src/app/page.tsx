import { redirect } from "next/navigation";

// La portada del proyecto es el dashboard.
export default function Home() {
  redirect("/dashboard");
}

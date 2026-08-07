import { redirect } from "next/navigation";
import { obterUsuarioAutenticado } from "@/lib/auth/session";

export default async function RootPage() {
  const usuario = await obterUsuarioAutenticado();

  if (usuario) {
    redirect("/dashboard");
  }

  redirect("/login");
}
import Link from "next/link";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/db/prisma";
import { obterUsuarioAutenticado } from "@/lib/auth/session";

export default async function AdministracaoPage() {
  const usuario = await obterUsuarioAutenticado();

  if (
    !usuario ||
    (usuario.papelGlobal !== "ADMIN" &&
      usuario.papelGlobal !== "SECRETARIO")
  ) {
    redirect("/dashboard");
  }

  const usuarios = await prisma.usuario.findMany({
    orderBy: {
      nome: "asc",
    },
  });

  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Administração
        </h1>

        <div className="flex gap-3">
          <Link
            href="/administracao/usuarios/novo"
            className="rounded-lg bg-primary px-4 py-2 text-white"
          >
            Novo Usuário
          </Link>

          <Link
            href="/administracao/cultos-regulares"
            className="rounded-lg border px-4 py-2 hover:bg-accent"
          >
            Cultos Regulares
          </Link>

          <Link
            href="/administracao/gerar-proximo-mes"
            className="rounded-lg bg-primary px-4 py-2 text-white"
          >
            Gerar Próximo Mês
          </Link>
        </div>
      </div>

      <div className="rounded-xl border bg-card">
        {usuarios.length === 0 ? (
          <p className="p-6 text-muted-foreground">
            Nenhum usuário cadastrado.
          </p>
        ) : (
          <div className="divide-y">
            {usuarios.map((usuario) => (
              <div
                key={usuario.id}
                className="flex items-center justify-between p-5"
              >
                <div>
                  <h2 className="font-semibold">
                    {usuario.nome}
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    {usuario.email}
                  </p>
                </div>

                <span className="rounded bg-secondary px-3 py-1 text-sm">
                  {usuario.papelGlobal ?? "MEMBRO"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
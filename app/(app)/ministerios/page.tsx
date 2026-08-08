import Link from "next/link";

import { prisma } from "@/lib/db/prisma";
import { obterUsuarioAutenticado } from "@/lib/auth/session";

export default async function MinisteriosPage() {
  const usuario = await obterUsuarioAutenticado();

  if (!usuario) {
    return null;
  }

  const administrador =
    usuario.papelGlobal === "ADMIN" ||
    usuario.papelGlobal === "SECRETARIO";

  const titulo = administrador
    ? "Ministérios"
    : "Meus Ministérios";

  const ministerios = await prisma.ministerio.findMany({
    where: administrador
      ? undefined
      : {
          vinculosUsuarios: {
            some: {
              usuarioId: usuario.id,
            },
          },
        },
    orderBy: {
      nome: "asc",
    },
    include: {
      vinculosUsuarios: {
        include: {
          usuario: true,
        },
      },
    },
  });

  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {titulo}
        </h1>

        {administrador && (
          <Link
            href="/ministerios/novo"
            className="rounded-lg bg-primary px-4 py-2 text-white"
          >
            Novo Ministério
          </Link>
        )}
      </div>

      <div className="rounded-xl border bg-card">
        {ministerios.length === 0 ? (
          <p className="p-6 text-muted-foreground">
            Nenhum ministério encontrado.
          </p>
        ) : (
          <div className="grid gap-4 p-4">
            {ministerios.map((ministerio) => {
              const lideres = ministerio.vinculosUsuarios.filter(
                (v) => v.papel === "LIDER"
              );

              return (
                <Link
                  key={ministerio.id}
                  href={`/ministerios/${ministerio.id}`}
                  className="rounded-xl border bg-background p-5 transition hover:border-primary hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold">
                        {ministerio.nome}
                      </h2>

                      <p className="mt-2 text-sm text-muted-foreground">
                        {lideres.length > 0
                          ? `Líder: ${lideres
                              .map((l) => l.usuario.nome)
                              .join(", ")}`
                          : "Nenhum líder definido"}
                      </p>

                      <p className="text-sm text-muted-foreground">
                        {ministerio.vinculosUsuarios.length}{" "}
                        {ministerio.vinculosUsuarios.length === 1
                          ? "membro"
                          : "membros"}
                      </p>
                    </div>

                    <span className="font-medium text-primary">
                      Abrir →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
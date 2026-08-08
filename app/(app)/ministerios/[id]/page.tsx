import { notFound } from "next/navigation";
import Link from "next/link";

import { prisma } from "@/lib/db/prisma";
import {
  removerMembro,
  alterarPapel,
} from "@/lib/ministerios/actions";
import {
  podeAdministrarMinisterio,
} from "@/lib/auth/permissoes";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function MinisterioPage({ params }: Props) {
  const { id } = await params;

  const ministerio = await prisma.ministerio.findUnique({
    where: {
      id,
    },
    include: {
      vinculosUsuarios: {
        include: {
          usuario: true,
        },
        orderBy: {
          usuario: {
            nome: "asc",
          },
        },
      },
    },
  });

  if (!ministerio) {
    notFound();
  }

  const podeEditar = await podeAdministrarMinisterio(ministerio.id);

  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          {ministerio.nome}
        </h1>

        <p className="text-muted-foreground">
          Gerenciamento do ministério.
        </p>
      </div>

      <div className="rounded-xl border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Membros
          </h2>

          {podeEditar && (
            <Link
              href={`/ministerios/${ministerio.id}/membros/novo`}
              className="rounded-lg bg-primary px-4 py-2 text-white"
            >
              + Adicionar membro
            </Link>
          )}
        </div>

        {ministerio.vinculosUsuarios.length === 0 ? (
          <p className="text-muted-foreground">
            Nenhum membro cadastrado.
          </p>
        ) : (
          <div className="divide-y">
            {ministerio.vinculosUsuarios.map((vinculo) => (
              <div
                key={vinculo.id}
                className="flex items-center justify-between py-4"
              >
                <div>
                  <p className="font-medium">
                    {vinculo.usuario.nome}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {vinculo.usuario.email}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded bg-secondary px-3 py-1 text-sm">
                    {vinculo.papel}
                  </span>

                  {podeEditar && (
                    <>
                      <form
                        action={alterarPapel.bind(
                          null,
                          ministerio.id,
                          vinculo.id
                        )}
                      >
                        <button
                          type="submit"
                          className="rounded-lg border px-3 py-1 text-sm hover:bg-accent"
                        >
                          Alterar
                        </button>
                      </form>

                      <form
                        action={removerMembro.bind(
                          null,
                          ministerio.id,
                          vinculo.id
                        )}
                      >
                        <button
                          type="submit"
                          className="rounded-lg border border-red-300 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
                        >
                          Remover
                        </button>
                      </form>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
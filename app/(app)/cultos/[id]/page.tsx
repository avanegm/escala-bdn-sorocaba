import { notFound } from "next/navigation";
import Link from "next/link";

import { prisma } from "@/lib/db/prisma";
import { podeAdministracaoGlobal } from "@/lib/auth/permissoes";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CultoPage({ params }: Props) {
  await podeAdministracaoGlobal();

  const { id } = await params;

  const culto = await prisma.culto.findUnique({
    where: {
      id,
    },
    include: {
      escalas: {
        include: {
          ministerio: true,
          participantes: {
            include: {
              usuario: true,
            },
          },
        },
        orderBy: {
          ministerio: {
            nome: "asc",
          },
        },
      },
    },
  });

  if (!culto) {
    notFound();
  }

  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          {culto.nome ?? "Culto"}
        </h1>

        <p className="text-muted-foreground">
          {culto.dataHoraCulto.toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}{" "}
          às{" "}
          {culto.dataHoraCulto.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      <div className="rounded-xl border bg-card p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">
            Ministérios
          </h2>

          <p className="text-sm text-muted-foreground">
            Ministérios participantes deste culto.
          </p>
        </div>

        {culto.escalas.length === 0 ? (
          <div className="rounded-lg border border-dashed p-6 text-center">
            <p className="text-muted-foreground">
              Nenhum ministério foi gerado para este culto.
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              Após implementarmos a geração automática dos cultos,
              todas as escalas serão criadas automaticamente.
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {culto.escalas.map((escala) => (
              <Link
                key={escala.id}
                href={`/cultos/${culto.id}/escalas/${escala.id}`}
                className="flex items-center justify-between py-4 transition hover:bg-accent/20"
              >
                <div>
                  <p className="font-medium">
                    {escala.ministerio.nome}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {escala.participantes.length} participante(s)
                  </p>
                </div>

                <span className="font-medium text-primary">
                  Abrir →
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
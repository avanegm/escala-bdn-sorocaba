import { notFound } from "next/navigation";

import { prisma } from "@/lib/db/prisma";
import { criarEscala } from "@/lib/cultos/actions";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function NovaEscalaPage({
  params,
}: Props) {
  const { id } = await params;

  const culto = await prisma.culto.findUnique({
    where: {
      id,
    },
  });

  if (!culto) {
    notFound();
  }

  const ministerios = await prisma.ministerio.findMany({
    where: {
      ativo: true,

      escalas: {
        none: {
          cultoId: id,
        },
      },
    },

    orderBy: {
      nome: "asc",
    },
  });

  return (
    <main className="max-w-xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Adicionar Ministério
        </h1>

        <p className="text-muted-foreground">
          {culto.nome ?? "Culto"}
        </p>
      </div>

      <form
        action={criarEscala.bind(null, culto.id)}
        className="space-y-5 rounded-xl border bg-card p-6"
      >
        <div>
          <label className="mb-2 block font-medium">
            Ministério
          </label>

          <select
            name="ministerioId"
            className="w-full rounded-lg border p-3"
          >
            {ministerios.map((ministerio) => (
              <option
                key={ministerio.id}
                value={ministerio.id}
              >
                {ministerio.nome}
              </option>
            ))}
          </select>
        </div>

        <button
          className="rounded-lg bg-primary px-5 py-2 text-white"
        >
          Adicionar
        </button>
      </form>
    </main>
  );
}
import Link from "next/link";

import { CalendarioMensal } from "@/components/calendario";
import { prisma } from "@/lib/db/prisma";
import { obterUsuarioAutenticado } from "@/lib/auth/session";

export default async function CultosPage() {
  const usuario = await obterUsuarioAutenticado();

  if (!usuario) {
    return null;
  }

  const administrador =
    usuario.papelGlobal === "ADMIN" ||
    usuario.papelGlobal === "SECRETARIO";

  const hoje = new Date();

  const ano = hoje.getFullYear();
  const mes = hoje.getMonth() + 1;

  const cultos = await prisma.culto.findMany({
    orderBy: {
      dataHoraCulto: "asc",
    },
  });

  const eventos = cultos.map((culto) => ({
    id: culto.id,
    titulo: culto.nome ?? "Culto",
    horario: culto.dataHoraCulto.toLocaleTimeString(
      "pt-BR",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    ),
    data: culto.dataHoraCulto,
    status: culto.status,
  }));

  return (
    <main className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">
            {administrador
              ? "Calendário de Cultos"
              : "Próximos Cultos"}
          </h1>

          <p className="text-muted-foreground">
            {administrador
              ? "Visualize todos os cultos da igreja."
              : "Escolha em quais cultos deseja servir."}
          </p>
        </div>

        {administrador && (
          <Link
            href="/cultos/novo"
            className="rounded-lg bg-primary px-4 py-2 text-white"
          >
            Novo Culto Extraordinário
          </Link>
        )}
      </div>

      <div className="rounded-xl border bg-card p-6">
        <CalendarioMensal
          ano={ano}
          mes={mes}
          eventos={eventos}
        />
      </div>
    </main>
  );
}
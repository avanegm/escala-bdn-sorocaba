"use client";

import Link from "next/link";
import { useActionState } from "react";

import { gerarCultosAction } from "@/lib/cultos/geracao-actions";

const meses = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const anoAtual = new Date().getFullYear();

const anos = [
  anoAtual - 1,
  anoAtual,
  anoAtual + 1,
  anoAtual + 2,
];

const initialState = {
  criados: 0,
  ignorados: 0,
  sucesso: false,
};

export default function GerarProximoMesPage() {
  const [state, formAction, pending] = useActionState(
    async (_: typeof initialState, formData: FormData) => {
      const resultado = await gerarCultosAction(formData);

      return {
        ...resultado,
        sucesso: true,
      };
    },
    initialState
  );

  return (
    <main className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Gerar Cultos
        </h1>

        <p className="text-muted-foreground">
          Gere automaticamente todos os cultos regulares de um mês.
        </p>
      </div>

      <form
        action={formAction}
        className="space-y-6 rounded-xl border bg-card p-8"
      >
        <div>
          <label className="mb-2 block font-medium">
            Ano
          </label>

          <select
            name="ano"
            className="w-full rounded-lg border px-4 py-2"
            defaultValue={anoAtual}
          >
            {anos.map((ano) => (
              <option
                key={ano}
                value={ano}
              >
                {ano}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Mês
          </label>

          <select
            name="mes"
            className="w-full rounded-lg border px-4 py-2"
            defaultValue={new Date().getMonth() + 1}
          >
            {meses.map((mes, index) => (
              <option
                key={mes}
                value={index + 1}
              >
                {mes}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-primary px-6 py-3 text-white disabled:opacity-60"
        >
          {pending
            ? "Gerando..."
            : "Gerar Cultos"}
        </button>
      </form>

      {state.sucesso && (
        <div className="rounded-xl border border-green-300 bg-green-50 p-6">
          <h2 className="text-lg font-semibold text-green-700">
            ✅ Geração concluída!
          </h2>

          <div className="mt-4 space-y-2">
            <p>
              <strong>Criados:</strong>{" "}
              {state.criados}
            </p>

            <p>
              <strong>Ignorados:</strong>{" "}
              {state.ignorados}
            </p>
          </div>

          <Link
            href="/cultos"
            className="mt-6 inline-block rounded-lg bg-primary px-5 py-2 text-white"
          >
            Ver Cultos
          </Link>
        </div>
      )}
    </main>
  );
}
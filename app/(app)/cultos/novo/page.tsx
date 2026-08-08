import { criarCulto } from "@/lib/cultos/actions";

export default function NovoCultoPage() {
  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Gerar Evento
        </h1>

        <p className="text-muted-foreground">
          Cadastre um culto fora da programação regular da igreja.
        </p>
      </div>

      <form
        action={criarCulto}
        className="space-y-5 rounded-xl border bg-card p-6"
      >
        <div>
          <label className="mb-2 block font-medium">
            Nome
          </label>

          <input
            name="nome"
            type="text"
            placeholder="Ex.: Culto de Natal"
            className="w-full rounded-lg border px-4 py-2"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Data e hora do culto
          </label>

          <input
            name="dataHoraCulto"
            type="datetime-local"
            required
            className="w-full rounded-lg border px-4 py-2"
          />
        </div>

        <input
          type="hidden"
          name="tipo"
          value="EXTRAORDINARIO"
        />

        <button
          type="submit"
          className="rounded-lg bg-primary px-5 py-2 text-white"
        >
          Salvar
        </button>
      </form>
    </main>
  );
}
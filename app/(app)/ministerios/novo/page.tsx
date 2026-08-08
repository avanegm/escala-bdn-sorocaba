import { criarMinisterio } from "@/lib/ministerios/actions";

export default function NovoMinisterioPage() {
  return (
    <main className="max-w-xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Novo Ministério
        </h1>

        <p className="text-muted-foreground">
          Cadastre um novo ministério da igreja.
        </p>
      </div>

      <form action={criarMinisterio} className="space-y-4">

        <div>
          <label
            htmlFor="nome"
            className="mb-2 block text-sm font-medium"
          >
            Nome
          </label>

          <input
            id="nome"
            name="nome"
            type="text"
            required
            placeholder="Ex.: Louvor"
            className="w-full rounded-lg border px-4 py-2"
          />
        </div>

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
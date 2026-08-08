import { criarCultoRegular } from "@/lib/cultos-regulares/actions";

export default function NovoCultoRegularPage() {
  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Novo Culto Regular
        </h1>

        <p className="text-muted-foreground">
          Cadastre um culto que acontece semanalmente.
        </p>
      </div>

      <form
        action={criarCultoRegular}
        className="space-y-5 rounded-xl border bg-card p-6"
      >
        <div>
          <label className="mb-2 block font-medium">
            Nome
          </label>

          <input
            name="nome"
            type="text"
            placeholder="Ex.: Domingo Manhã"
            required
            className="w-full rounded-lg border px-4 py-2"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Dia da Semana
          </label>

          <select
            name="diaSemana"
            className="w-full rounded-lg border px-4 py-2"
            required
          >
            <option value="DOMINGO">Domingo</option>
            <option value="SEGUNDA">Segunda-feira</option>
            <option value="TERCA">Terça-feira</option>
            <option value="QUARTA">Quarta-feira</option>
            <option value="QUINTA">Quinta-feira</option>
            <option value="SEXTA">Sexta-feira</option>
            <option value="SABADO">Sábado</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Horário
          </label>

          <input
            name="horario"
            type="time"
            required
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
type Props = {
  ano: number;
  mes: number;
};

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

export function CalendarioCabecalho({
  ano,
  mes,
}: Props) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <button
        className="rounded-lg border px-3 py-2"
        disabled
      >
        ←
      </button>

      <h2 className="text-2xl font-bold">
        {meses[mes - 1]} {ano}
      </h2>

      <button
        className="rounded-lg border px-3 py-2"
        disabled
      >
        →
      </button>
    </div>
  );
}
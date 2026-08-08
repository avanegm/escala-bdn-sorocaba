import { CalendarioEventoCard } from "./calendario-evento";
import {
  CalendarioDia,
  CalendarioEvento,
} from "./types";

type Props = {
  dia: CalendarioDia;
  eventos?: CalendarioEvento[];
};

export function CalendarioDiaCard({
  dia,
  eventos = [],
}: Props) {
  return (
    <div
      className={[
        "min-h-36 rounded-xl border p-2 transition",
        dia.pertenceAoMes
          ? "bg-card"
          : "bg-muted/30 opacity-40",
      ].join(" ")}
    >
      <div className="mb-2 text-sm font-semibold">
        {dia.data.getDate()}
      </div>

      {eventos.map((evento) => (
        <CalendarioEventoCard
          key={evento.id}
          evento={evento}
        />
      ))}
    </div>
  );
}
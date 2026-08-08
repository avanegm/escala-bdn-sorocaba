import { CalendarioEvento } from "./types";

type Props = {
  evento: CalendarioEvento;
};

export function CalendarioEventoCard({
  evento,
}: Props) {
  return (
    <div className="mb-1 rounded-md bg-primary/10 px-2 py-1 text-xs">
      <div className="font-semibold">
        {evento.horario}
      </div>

      <div className="truncate">
        {evento.titulo}
      </div>
    </div>
  );
}
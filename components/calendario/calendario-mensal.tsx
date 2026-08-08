import { CalendarioCabecalho } from "./calendario-cabecalho";
import { CalendarioDiaCard } from "./calendario-dia";
import { chaveData } from "./utils";
import {
    CalendarioDia,
    CalendarioEvento,
} from "./types";

type Props = {
    ano: number;
    mes: number;
    eventos?: CalendarioEvento[];
};

const diasSemana = [
    "Seg",
    "Ter",
    "Qua",
    "Qui",
    "Sex",
    "Sáb",
    "Dom",
];

function gerarDias(
    ano: number,
    mes: number
): CalendarioDia[] {
    const primeiroDia = new Date(
        ano,
        mes - 1,
        1
    );

    const ultimoDia = new Date(
        ano,
        mes,
        0
    );

    const dias: CalendarioDia[] = [];

    const inicio =
        (primeiroDia.getDay() + 6) % 7;

    // Dias do mês anterior
    for (let i = 0; i < inicio; i++) {
        dias.push({
            data: new Date(
                ano,
                mes - 1,
                -(inicio - i - 1)
            ),
            pertenceAoMes: false,
        });
    }

    // Dias do mês atual
    for (
        let dia = 1;
        dia <= ultimoDia.getDate();
        dia++
    ) {
        dias.push({
            data: new Date(
                ano,
                mes - 1,
                dia
            ),
            pertenceAoMes: true,
        });
    }

    // Dias do próximo mês
    while (dias.length % 7 !== 0) {
        dias.push({
            data: new Date(
                ano,
                mes,
                dias.length
            ),
            pertenceAoMes: false,
        });
    }

    return dias;
}

export function CalendarioMensal({
    ano,
    mes,
    eventos = [],
}: Props) {
    const dias = gerarDias(
        ano,
        mes
    );

    const eventosPorDia = new Map<
        string,
        CalendarioEvento[]
    >();

    for (const evento of eventos) {
        const chave = chaveData(evento.data);

        if (!eventosPorDia.has(chave)) {
            eventosPorDia.set(chave, []);
        }

        eventosPorDia.get(chave)!.push(evento);
    }

    for (const evento of eventos) {
        const chave = chaveData(
            evento.data
        );

        const lista =
            eventosPorDia.get(chave) ?? [];

        lista.push(evento);

        eventosPorDia.set(
            chave,
            lista
        );
    }

    return (
        <>
            <CalendarioCabecalho
                ano={ano}
                mes={mes}
            />

            <div className="mb-4 grid grid-cols-7 gap-3">
                {diasSemana.map((dia) => (
                    <div
                        key={dia}
                        className="text-center text-sm font-semibold text-muted-foreground"
                    >
                        {dia}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-3">
                {dias.map((dia) => (
                    <CalendarioDiaCard
                        key={dia.data.toISOString()}
                        dia={dia}
                        eventos={
                            eventosPorDia.get(
                                chaveData(dia.data)
                            ) ?? []
                        }
                    />
                ))}
            </div>
        </>
    );
}
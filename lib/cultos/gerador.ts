import { TipoCulto } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";
import { obterDatasDoMes } from "./datas";

export type ResultadoGeracaoCultos = {
  criados: number;
  ignorados: number;
};

export async function gerarCultosDoMes(
  ano: number,
  mes: number
): Promise<ResultadoGeracaoCultos> {
  validarParametros(ano, mes);

  const cultosRegulares = await prisma.cultoRegular.findMany({
    where: {
      ativo: true,
    },
    orderBy: [
      {
        diaSemana: "asc",
      },
      {
        horario: "asc",
      },
    ],
  });

  let criados = 0;
  let ignorados = 0;

  for (const cultoRegular of cultosRegulares) {
    const datas = obterDatasDoMes(
      ano,
      mes,
      cultoRegular.diaSemana
    );

    const { hora, minuto } = obterHoraEMinuto(
      cultoRegular.horario
    );

    for (const data of datas) {
      const dataHoraCulto = new Date(data);

      dataHoraCulto.setHours(hora, minuto, 0, 0);

      const existente = await prisma.culto.findUnique({
        where: {
          dataHoraCulto,
        },
      });

      if (existente) {
        ignorados++;
        continue;
      }

      await prisma.culto.create({
        data: {
          nome: cultoRegular.nome,
          tipo: TipoCulto.REGULAR,
          dataHoraCulto,
        },
      });

      criados++;
    }
  }

  return {
    criados,
    ignorados,
  };
}

function validarParametros(
  ano: number,
  mes: number
) {
  if (!Number.isInteger(ano) || ano < 2024) {
    throw new Error("Ano inválido.");
  }

  if (!Number.isInteger(mes) || mes < 1 || mes > 12) {
    throw new Error("Mês inválido.");
  }
}

function obterHoraEMinuto(
  horario: string
): {
  hora: number;
  minuto: number;
} {
  const partes = horario.split(":");

  if (partes.length !== 2) {
    throw new Error(`Horário inválido: ${horario}`);
  }

  const hora = Number(partes[0]);
  const minuto = Number(partes[1]);

  if (
    Number.isNaN(hora) ||
    Number.isNaN(minuto)
  ) {
    throw new Error(`Horário inválido: ${horario}`);
  }

  if (hora < 0 || hora > 23) {
    throw new Error(`Hora inválida: ${horario}`);
  }

  if (minuto < 0 || minuto > 59) {
    throw new Error(`Minuto inválido: ${horario}`);
  }

  return {
    hora,
    minuto,
  };
} 
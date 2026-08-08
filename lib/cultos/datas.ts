import { DiaSemana } from "@prisma/client";

const mapaDiasSemana: Record<DiaSemana, number> = {
  DOMINGO: 0,
  SEGUNDA: 1,
  TERCA: 2,
  QUARTA: 3,
  QUINTA: 4,
  SEXTA: 5,
  SABADO: 6,
};

export function obterDatasDoMes(
  ano: number,
  mes: number,
  diaSemana: DiaSemana
): Date[] {
  const datas: Date[] = [];

  const primeiroDia = new Date(ano, mes - 1, 1);
  const ultimoDia = new Date(ano, mes, 0);

  const diaDesejado = mapaDiasSemana[diaSemana];

  for (
    const data = new Date(primeiroDia);
    data <= ultimoDia;
    data.setDate(data.getDate() + 1)
  ) {
    if (data.getDay() === diaDesejado) {
      datas.push(new Date(data));
    }
  }

  return datas;
}
export type CalendarioDia = {
  data: Date;
  pertenceAoMes: boolean;
};

export type CalendarioEvento = {
  id: string;
  titulo: string;
  horario: string;
  data: Date;
  status: string;
};
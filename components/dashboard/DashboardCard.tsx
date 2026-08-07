type DashboardCardProps = {
  titulo: string;
  valor: string;
  descricao: string;
};

export function DashboardCard({
  titulo,
  valor,
  descricao,
}: DashboardCardProps) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h3 className="text-sm font-medium text-muted-foreground">
        {titulo}
      </h3>

      <p className="mt-3 text-3xl font-bold">
        {valor}
      </p>

      <p className="mt-2 text-sm text-muted-foreground">
        {descricao}
      </p>
    </div>
  );
}
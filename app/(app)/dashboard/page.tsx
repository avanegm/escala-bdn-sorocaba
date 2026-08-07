import { obterPerfilProprio } from "@/lib/auth/actions";
import { PageContainer } from "@/components/layout/PageContainer";

export default async function DashboardPage() {
  const resultado = await obterPerfilProprio();

  if (!resultado.sucesso) {
    return (
      <PageContainer>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Erro</h1>

          <p className="text-muted-foreground">
            {resultado.mensagem}
          </p>
        </div>
      </PageContainer>
    );
  }

  const { usuario, ministerios } = resultado.dados;

  return (
    <PageContainer>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">
            Olá, {usuario.nome}! 👋
          </h1>

          <p className="text-muted-foreground">
            Bem-vindo ao Escala Bola de Neve Sorocaba.
          </p>
        </div>

        <section className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold">
            Próxima Escala
          </h2>

          <p className="mt-3 text-muted-foreground">
            Nenhuma escala cadastrada.
          </p>
        </section>

        <section className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold">
            Meus Ministérios
          </h2>

          {ministerios.length === 0 ? (
            <p className="mt-3 text-muted-foreground">
              Você ainda não participa de nenhum ministério.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {ministerios.map((ministerio) => (
                <li key={ministerio.id}>
                  {ministerio.nome}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </PageContainer>
  );
}
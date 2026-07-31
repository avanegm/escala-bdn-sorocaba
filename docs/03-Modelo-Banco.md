# Modelagem de Banco de Dados (Prisma Schema) — Escala Bola de Neve Sorocaba

**Baseado em:** PRD v2.0 + Arquitetura Técnica (aprovados)
**Status:** Proposta para validação — nenhum código de aplicação implementado

---

## Nota rápida sobre os ajustes da etapa anterior

Antes do schema, três observações sobre os 4 ajustes que você aprovou:

- **Ajuste 1 (Supabase Auth)** e **Ajuste 2 (remover backup extra)** impactam a arquitetura, não o modelo de dados em si — já refletidos aqui (item 1 abaixo trata exatamente de como o `Usuario` se relaciona com o Supabase Auth).
- **Ajustes 3 e 4 (navegação entre meses e contagem de voluntários)** são **features de interface, não mudanças de schema**. O modelo abaixo já suporta as duas sem qualquer campo adicional:
  - Navegação entre meses = uma query filtrando `Culto.dataHoraCulto` por intervalo de datas (mês selecionado). Não precisa de campo "mês" separado — calculado a partir da data.
  - Contagem de voluntários por culto = `COUNT` das linhas de `Escala` vinculadas àquele `Culto` + `Ministerio`. Não é um campo armazenado (evita dado duplicado/desatualizado) — é sempre calculado na consulta.

Achei importante deixar isso explícito para você validar que o raciocínio está certo antes de eu seguir — se por algum motivo você antecipa que a contagem precisa ser um valor "congelado" no histórico (ex: para relatórios que não mudam mesmo se alguém editar a escala depois), me avisa que isso muda a modelagem.

---

## Schema Completo

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─────────────────────────────────────────────
// ENUMS
// ─────────────────────────────────────────────

enum PapelGlobal {
  ADMIN
  SECRETARIO
}

enum PapelMinisterio {
  LIDER
  MEMBRO
}

enum TipoCulto {
  REGULAR
  EXTRAORDINARIO
}

enum StatusConfirmacao {
  PENDENTE
  CONFIRMADO
  AUSENTE
}

enum AcaoAuditoria {
  CRIACAO_USUARIO
  EDICAO_USUARIO
  EXCLUSAO_USUARIO
  INCLUSAO_MEMBRO_MINISTERIO
  REMOCAO_MEMBRO_MINISTERIO
  DEFINICAO_LIDER
  CRIACAO_MINISTERIO
  EDICAO_MINISTERIO
  EXCLUSAO_MINISTERIO
  ALTERACAO_CONFIGURACAO
}

// ─────────────────────────────────────────────
// USUÁRIO
// ─────────────────────────────────────────────

model Usuario {
  // Mesmo id do usuário em auth.users (Supabase Auth).
  // Não é gerado pelo Prisma — é atribuído no momento em que
  // o registro de perfil é criado, espelhando o id do Auth.
  id           String       @id @db.Uuid
  nome         String
  email        String       @unique
  fotoPerfil   String?      @map("foto_perfil")
  papelGlobal  PapelGlobal? @map("papel_global")
  ativo        Boolean      @default(true)
  criadoEm     DateTime     @default(now()) @map("criado_em")
  atualizadoEm DateTime     @updatedAt @map("atualizado_em")

  vinculosMinisterio UsuarioMinisterio[]
  escalas            Escala[]
  logsAuditoria      LogAuditoria[]

  @@index([papelGlobal])
  @@map("usuarios")
}

// ─────────────────────────────────────────────
// MINISTÉRIO
// ─────────────────────────────────────────────

model Ministerio {
  id           String   @id @default(uuid()) @db.Uuid
  nome         String   @unique
  logoUrl      String?  @map("logo_url")
  corTema      String?  @map("cor_tema")
  ativo        Boolean  @default(true)
  criadoEm     DateTime @default(now()) @map("criado_em")
  atualizadoEm DateTime @updatedAt @map("atualizado_em")

  vinculosUsuarios UsuarioMinisterio[]
  escalas          Escala[]

  @@index([ativo])
  @@map("ministerios")
}

// ─────────────────────────────────────────────
// VÍNCULO USUÁRIO × MINISTÉRIO (papel de Líder/Membro)
// ─────────────────────────────────────────────

model UsuarioMinisterio {
  id           String          @id @default(uuid()) @db.Uuid
  usuarioId    String          @map("usuario_id") @db.Uuid
  ministerioId String          @map("ministerio_id") @db.Uuid
  papel        PapelMinisterio
  criadoEm     DateTime        @default(now()) @map("criado_em")

  usuario    Usuario    @relation(fields: [usuarioId], references: [id], onDelete: Cascade)
  ministerio Ministerio @relation(fields: [ministerioId], references: [id], onDelete: Cascade)

  @@unique([usuarioId, ministerioId], name: "usuario_ministerio_unico")
  @@index([ministerioId])
  @@index([usuarioId])
  @@map("usuarios_ministerios")
}

// ─────────────────────────────────────────────
// CULTO (slot de serviço, gerado automaticamente ou extraordinário)
// ─────────────────────────────────────────────

model Culto {
  id              String    @id @default(uuid()) @db.Uuid
  dataHoraCulto   DateTime  @unique @map("data_hora_culto")
  dataHoraChegada DateTime  @map("data_hora_chegada")
  tipo            TipoCulto
  nome            String?
  observacoes     String?
  criadoEm        DateTime  @default(now()) @map("criado_em")

  escalas Escala[]

  @@index([tipo])
  @@map("cultos")
}

// ─────────────────────────────────────────────
// ESCALA (usuário disponível para servir em um ministério, em um culto)
// ─────────────────────────────────────────────

model Escala {
  id                String             @id @default(uuid()) @db.Uuid
  usuarioId         String             @map("usuario_id") @db.Uuid
  ministerioId      String             @map("ministerio_id") @db.Uuid
  cultoId           String             @map("culto_id") @db.Uuid
  statusConfirmacao StatusConfirmacao  @default(PENDENTE) @map("status_confirmacao")
  tokenConfirmacao  String?            @unique @map("token_confirmacao")
  tokenExpiraEm     DateTime?          @map("token_expira_em")
  criadoEm          DateTime           @default(now()) @map("criado_em")
  atualizadoEm      DateTime           @updatedAt @map("atualizado_em")

  usuario    Usuario    @relation(fields: [usuarioId], references: [id], onDelete: Cascade)
  ministerio Ministerio @relation(fields: [ministerioId], references: [id], onDelete: Cascade)
  culto      Culto      @relation(fields: [cultoId], references: [id], onDelete: Cascade)

  @@unique([usuarioId, cultoId], name: "conflito_agenda_usuario_culto")
  @@index([ministerioId, cultoId])
  @@index([cultoId])
  @@map("escalas")
}

// ─────────────────────────────────────────────
// CONFIGURAÇÃO DO SISTEMA (singleton)
// ─────────────────────────────────────────────

model ConfiguracaoSistema {
  id                                  Int      @id @default(1)
  nomeIgreja                          String   @map("nome_igreja")
  logoIgreja                          String?  @map("logo_igreja")
  diasAntecedenciaAberturaProximoMes  Int      @default(7) @map("dias_antecedencia_abertura_proximo_mes")
  atualizadoEm                        DateTime @updatedAt @map("atualizado_em")

  @@map("configuracoes_sistema")
}

// ─────────────────────────────────────────────
// LOG DE AUDITORIA
// ─────────────────────────────────────────────

model LogAuditoria {
  id              String        @id @default(uuid()) @db.Uuid
  usuarioId       String?       @map("usuario_id") @db.Uuid
  acao            AcaoAuditoria
  entidadeAfetada String        @map("entidade_afetada")
  entidadeId      String?       @map("entidade_id")
  detalhes        Json?
  criadoEm        DateTime      @default(now()) @map("criado_em")

  usuario Usuario? @relation(fields: [usuarioId], references: [id], onDelete: SetNull)

  @@index([usuarioId])
  @@index([entidadeAfetada, entidadeId])
  @@index([criadoEm])
  @@map("logs_auditoria")
}
```

---

## Explicação de Cada Entidade e Decisões de Modelagem

### Convenção de nomenclatura adotada

Campos em **camelCase** no lado do Prisma/TypeScript (padrão da comunidade JS), mapeados via `@map` para **snake_case** nas colunas reais do Postgres (padrão da comunidade SQL/Postgres, e o que o próprio Supabase usa em suas tabelas internas). Tabelas também em snake_case plural (`usuarios`, `logs_auditoria`) via `@@map`. Escolhi isso em vez de deixar tudo camelCase no banco porque mistura mal com o restante do schema do Supabase (que é snake_case) e evita ter que colocar aspas em toda query SQL manual que alguém precise rodar no futuro (Postgres é case-sensitive com identificadores entre aspas). Essa é uma convenção que vale fixar agora — todo campo novo daqui pra frente segue esse padrão.

### `Usuario`

Representa o perfil de aplicação de cada pessoa — **não** as credenciais de login (isso é responsabilidade do Supabase Auth, tabela `auth.users`, fora do controle do Prisma).

**Decisão-chave:** o campo `id` **não é gerado automaticamente pelo Prisma** (sem `@default(uuid())`) — ele recebe o mesmo UUID do usuário correspondente em `auth.users`. Isso evita ter dois IDs diferentes para a "mesma pessoa" em dois sistemas, o que geraria confusão e joins desnecessários. Na prática, quando alguém é criado (por Admin/Secretário ou por auto-cadastro, a definir), primeiro criamos o usuário no Supabase Auth, e o id retornado é usado para criar a linha correspondente em `usuarios`. Vou propor formalmente esse fluxo quando chegarmos na etapa de implementação — por ora, o ponto importante é que o schema já reflete essa decisão arquitetural do Ajuste 1 que você aprovou.

**`papelGlobal` é opcional (`PapelGlobal?`):** um usuário comum (Líder ou Membro "puro") não tem papel global nenhum — só Admin e Secretário preenchem esse campo. Isso modela fielmente a regra do PRD: papel global é exceção, não regra.

**`ativo` em vez de exclusão física (soft delete):** quando um Admin "exclui" um usuário, a linha não é apagada do banco — `ativo` vira `false`. Isso preserva a integridade do histórico de escalas (uma pessoa que serviu em cultos passados continua aparecendo corretamente no histórico, mesmo depois de sair da igreja) e evita erro de integridade referencial (não dá pra apagar um usuário que tem escalas vinculadas sem ou perder o histórico ou travar a exclusão). A aplicação simplesmente para de mostrar usuários inativos nas listas e impede login. Esse foi um risco que eu tinha sinalizado na revisão do PRD original — ficou resolvido aqui na modelagem.

**`email` duplicado do Auth:** sei que isso é uma pequena redundância com `auth.users.email`, mas é proposital — permite consultas e exibição de dados sem precisar cruzar com o schema do Auth toda hora, e é sincronizado no momento da criação/edição do usuário (não é uma fonte de verdade paralela, é uma cópia de leitura).

### `Ministerio`

Direto — nome, logo (caminho no Supabase Storage, não a imagem em si) e `ativo` (mesmo raciocínio de soft delete do `Usuario`: excluir um ministério não pode apagar o histórico de escalas associado a ele).

### `UsuarioMinisterio`

A tabela que implementa o modelo de permissão "por relação Usuário × Ministério" definido no PRD. A constraint `@@unique([usuarioId, ministerioId])` garante que um usuário tenha **no máximo um papel por ministério** — não faz sentido a mesma pessoa ser Líder e Membro do mesmo ministério simultaneamente. Se ela participa de dois ministérios diferentes, isso vira duas linhas nesta tabela (uma por ministério), podendo ter papéis diferentes em cada uma — exatamente o comportamento que você validou no PRD (seção 1 das decisões de negócio).

`onDelete: Cascade` nas duas relações: se um usuário ou ministério for **fisicamente** removido (cenário raro, dado o soft delete acima, mas o schema precisa se defender mesmo assim, ex: em ambiente de testes/dados de engano), os vínculos somem junto — não faz sentido um vínculo "órfão".

### `Culto`

Representa um **slot de serviço da igreja como um todo** — não é por ministério. Um culto de domingo às 10h existe uma vez só, e cada ministério pode (ou não) ter pessoas escaladas nele. Essa é a peça central que resolve a regra de conflito de agenda (ver `Escala` abaixo).

**Por que não usei `@@unique` em `dataHoraCulto`:** pensei nisso, mas decidi contra. Ela impediria, por exemplo, um culto extraordinário substituir/coexistir com o horário de um culto regular no mesmo dia e hora (cenário real: Natal caindo numa quinta-feira, onde a igreja decide fazer um culto extraordinário no mesmo horário do culto regular, no lugar dele). Prefiro tratar a **não duplicação dos cultos regulares gerados automaticamente** como uma responsabilidade do job de geração (seção 8 da arquitetura) — ele verifica antes de criar, em vez de depender de uma constraint de banco que acabaria sendo forte demais para os casos extraordinários. Deixei um índice (não único) em `dataHoraCulto` para manter as consultas rápidas.

`tipo` (REGULAR/EXTRAORDINARIO) e `nome` (opcional, usado só nos extraordinários — ex.: "Vigília de Ano Novo") cobrem a seção 7 do PRD.

### `Escala`

A entidade mais importante do ponto de vista de regras de negócio. Representa "este usuário se disponibilizou para servir neste ministério, neste culto".

**A constraint que resolve a regra de conflito de agenda (PRD seção 12) é `@@unique([usuarioId, cultoId])`** — repare que ela **não inclui `ministerioId`**. Isso é intencional: a regra de negócio diz que o conflito é por *usuário + culto* (mesma data/horário), independente de em qual ministério a pessoa tentaria se escalar duas vezes. Com essa constraint, o banco de dados **fisicamente impede** a existência de duas linhas de `Escala` para o mesmo usuário no mesmo culto — não importa a ordem das requisições, nem bugs futuros de validação no código da aplicação. É a rede de segurança que eu tinha mencionado na etapa de arquitetura.

`tokenConfirmacao` e `tokenExpiraEm`: suportam o link de confirmação de presença por e-mail (seção 6 do fluxo de navegação da arquitetura) — token único, de uso único, com expiração, para evitar que o link seja forjado ou reaproveitado depois do culto.

`statusConfirmacao` começa em `PENDENTE` e migra para `CONFIRMADO` ou `AUSENTE` conforme a resposta do e-mail (PRD seção 8). Não existe um quarto estado para "cancelamento posterior" porque isso foi explicitamente definido como fora de escopo — a mudança posterior continua manual, via WhatsApp (PRD seção 8 e 16).

### `ConfiguracaoSistema`

Modelada como **singleton** (sempre existe exatamente uma linha, com `id` fixo em `1`) em vez de uma tabela chave-valor genérica. Escolhi isso porque hoje só existe uma configuração real (`diasAntecedenciaAberturaProximoMes`), e o padrão singleton deixa isso explícito e simples de consultar (`findUnique({ where: { id: 1 } })` em vez de buscar por chave string). Se no futuro surgirem mais parâmetros configuráveis, é só adicionar novas colunas nesta mesma tabela — não precisa virar chave-valor só por precaução agora.

### `LogAuditoria`

Cobre a seção 11 do PRD. `usuarioId` é **opcional** (`String?`) com `onDelete: SetNull` — se um dia um usuário for fisicamente removido do banco (não o soft delete padrão, mas um caso extremo), os logs de auditoria que ele gerou continuam existindo (não é aceitável perder histórico de auditoria), só perdem a referência direta ao ator.

`detalhes` como `Json?` guarda o "diff" da alteração (ex: `{ "campo": "papelGlobal", "de": null, "para": "SECRETARIO" }`) de forma flexível, sem precisar de uma tabela rígida por tipo de ação — dado que as ações auditadas (seção 11 do PRD) são heterogêneas em formato.

`entidadeAfetada` (nome da tabela/conceito, ex: `"usuario"`) + `entidadeId` (o id do registro afetado) permitem localizar rapidamente "todo o histórico de mudanças deste usuário específico", sem precisar de uma tabela de log por entidade.

---

## Índices — Resumo do Raciocínio

Além dos índices que vêm "de graça" com toda `@unique` e chave primária, adicionei manualmente:

- `UsuarioMinisterio.ministerioId` e `.usuarioId` — para as duas consultas mais comuns: "quem são os membros deste ministério" e "de quais ministérios este usuário participa".
- `Escala.ministerioId + cultoId` (composto) — a consulta mais frequente da tela de ministério: "quem está escalado neste ministério, neste culto" (a mesma query, aliás, que alimenta a contagem de voluntários do Ajuste 4).
- `Escala.cultoId` isolado — para o job de envio de e-mail de confirmação, que percorre por culto (todas as escalas de um culto específico, de qualquer ministério).
- `Culto.dataHoraCulto` — para a navegação entre meses do Ajuste 3 (filtrar cultos por intervalo de datas) e para o job de geração automática verificar se um culto já existe.
- `LogAuditoria.criadoEm` e `.entidadeAfetada + entidadeId` — consultas típicas de tela de auditoria são "mais recentes primeiro" e "histórico deste registro específico".

Não adicionei índices em campos que só são filtrados ocasionalmente por telas administrativas de baixíssimo volume de acesso (ex: `Usuario.ativo` sozinho) — índice tem custo de escrita, e não faz sentido pagar esse custo para consultas que não são de "caminho crítico" do sistema.

---

## Pontos que Preciso da Sua Validação Antes de Seguir

1. **Confirmar o entendimento do fluxo de criação de usuário com Supabase Auth** (seção `Usuario` acima) — o id do perfil sempre nasce a partir do id do Auth, nunca o contrário. Faz sentido para você?
2. **`Culto` sem constraint única em data/hora** — a ideia de deixar a não-duplicação de cultos regulares como responsabilidade do job, não do banco, por causa do caso de cultos extraordinários substituindo um horário regular. Concorda com esse raciocínio ou prefere que eu trate isso de forma mais rígida?
3. Confirma que **não precisamos de um campo "mês/ano" separado** em `Escala` ou `Culto` — tudo deriva de `dataHoraCulto`?

Se estiver tudo certo, o próximo passo natural seria detalhar as rotas de API e o fluxo de autorização por rota (quem pode chamar o quê), ainda sem implementar — ou, se preferir, já podemos começar a implementação a partir deste schema. Como prefere seguir?
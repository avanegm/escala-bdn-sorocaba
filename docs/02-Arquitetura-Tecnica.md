# Arquitetura Técnica — Escala Bola de Neve Sorocaba

**Baseado em:** PRD v2.0 (aprovado)
**Status:** Proposta para revisão — nenhum código implementado ainda

---

## Como este documento está organizado

Para cada decisão técnica relevante eu apresento: o que escolhi, por que, quais alternativas considerei, vantagens/desvantagens, impacto em custo, facilidade de manutenção e escalabilidade. No final há uma recomendação única consolidada.

O fio condutor de todas as decisões é o que está escrito no PRD (seção 16): **este é um MVP para uma única igreja, com prioridade em simplicidade, baixo custo e baixa manutenção** — não em suportar escala massiva ou múltiplos tenants. Isso elimina, de saída, boa parte das opções "enterprise" que eu consideraria em outro contexto.

---

## 1. Stack Completa

### 1.1 Frontend + Backend: **Next.js (React, App Router) em um único projeto full-stack**

**Por quê:** Next.js permite escrever frontend (páginas/telas) e backend (API routes / server actions) no mesmo projeto, com o mesmo time, sem precisar manter dois repositórios, dois deploys e duas linguagens de "cola" entre eles. Para uma equipe pequena (provavelmente você e mais alguém, talvez voluntários) mantendo o sistema de uma igreja, isso é a diferença entre "dá pra manter" e "vira um projeto abandonado em 8 meses".

**Alternativas consideradas:**
- **Backend separado (Node/NestJS ou Django) + SPA React separada.** Mais "correto" do ponto de vista de separação de responsabilidades e escalaria melhor se este fosse um produto SaaS multi-cliente. Mas dobra a superfície de manutenção (dois deploys, duas configurações de ambiente, CORS, versionamento de contrato entre front e back) para um ganho que este projeto não precisa agora.
- **PHP/Laravel monolítico tradicional (server-rendered).** Extremamente comum em sistemas de igreja por comunidade e custo de hospedagem baixíssimo. Descartei porque foge do ecossistema JS único, dificultando achar colaboradores voluntários (comunidade técnica de igreja tende a ter mais gente com React/JS hoje do que PHP), e o modelo de deploy moderno (Vercel) é mais simples com Next.js.
- **Firebase (frontend puro + Firebase Functions).** Consideraria para MVP ainda mais enxuto, mas o modelo de dados relacional que este projeto precisa (usuários × ministérios × cultos × escalas, com integridade referencial e constraints como "não pode estar em dois cultos ao mesmo tempo") se encaixa muito melhor em banco relacional do que no Firestore (NoSQL), que exigiria modelar essas regras na aplicação em vez de no banco.

**Vantagens:** um único deploy, um único repositório, roteamento e SEO tratados nativamente, Server Components reduzem JS enviado ao navegador (importante porque parte do público vai acessar do celular, às vezes com internet ruim), API routes cobrem tudo que o backend precisa fazer.

**Desvantagens:** Next.js é "opinativo" — quem não conhece o framework tem uma curva de aprendizado inicial (App Router, Server vs Client Components). Também cria alguma dependência do ecossistema Vercel para a experiência de deploy mais tranquila (mitigável — Next.js roda em outros lugares também, só com mais fricção).

**Custo:** zero de licenciamento; hospedagem detalhada na seção 9.

**Manutenção:** alta facilidade — um projeto, um `package.json`, um pipeline de CI/CD.

**Escalabilidade:** suporta crescimento de tráfego bem além do necessário para uma igreja; se um dia vocês decidirem replicar para outras unidades da Bola de Neve, dá para evoluir para multi-tenant sem trocar de framework.

### 1.2 Banco de Dados: **PostgreSQL**

**Por quê:** o domínio do sistema é fundamentalmente relacional — usuários se relacionam com ministérios, ministérios têm cultos, cultos têm escalas, e existem regras de integridade fortes (ex: um usuário não pode estar em dois cultos no mesmo horário). Isso é o caso de uso clássico onde um banco relacional com constraints é muito mais seguro do que resolver essas regras "na mão" no código de aplicação.

**Alternativas consideradas:**
- **MySQL.** Equivalente em maturidade para este caso de uso. Prefiro Postgres pela superioridade em tipos de dados (enums nativos, JSON bem suportado para o campo de metadata da auditoria) e por ser o padrão de fato no ecossistema que vou recomendar no deploy (seção 9).
- **MongoDB / NoSQL.** Descartado pelo mesmo motivo da seção 1.1 — o domínio é relacional, e forçar isso em documentos joga a responsabilidade de integridade para o código da aplicação, aumentando risco de bug (ex: alguém escalado duas vezes no mesmo horário por uma falha de lógica, não de banco).

**Vantagens:** constraints de integridade (unique constraints, foreign keys) resolvem sozinhas a regra de conflito de agenda do item 12 do PRD, sem precisar de lógica de aplicação frágil. Maduro, gratuito, com ótimo suporte em qualquer provedor de hospedagem.

**Desvantagens:** exige alguma disciplina de migrations (mitigado pelo ORM, ver 1.3).

**Custo:** gratuito em nível de licença; hospedagem gerenciada tem tiers gratuitos generosos para este volume de dados (uma igreja tem, tipicamente, algumas centenas de usuários — isso é trivial para qualquer Postgres gerenciado moderno).

**Manutenção:** baixa, com provedor gerenciado (sem precisar administrar servidor de banco).

**Escalabilidade:** sobra escala para os próximos 10+ anos deste projeto específico.

### 1.3 ORM: **Prisma**

**Por quê:** dá tipagem forte end-to-end (o schema do banco vira tipos TypeScript automaticamente), tem sistema de migrations declarativo e legível, e é o ORM com melhor integração no ecossistema Next.js hoje. Isso reduz a chance de bug de "esqueci de validar um campo" e torna o schema do banco autoexplicativo — importante para você entender e revisar minhas decisões de modelagem sem precisar ler SQL cru.

**Alternativas consideradas:** Drizzle ORM (mais leve e mais "próximo do SQL", ganhando popularidade) — é uma alternativa legítima e mais performática em edge runtimes, mas Prisma tem uma DX mais amigável para quem está entrando no projeto (migrations mais visuais, Prisma Studio para inspecionar dados sem escrever SQL), o que pesa mais num projeto mantido por voluntários de igreja do que ganho marginal de performance que este volume de dados não vai sentir.

**Custo:** gratuito.

**Manutenção:** alta — migrations versionadas no próprio repositório.

**Escalabilidade:** suficiente; se um dia o projeto crescer a ponto de precisar de queries muito otimizadas manualmente, o Prisma permite "escapar" para SQL cru em pontos pontuais.

---

## 2. Estrutura de Pastas

Proposta (Next.js App Router, organizada por domínio dentro das camadas técnicas — vamos refinar nomes exatos quando formos implementar, isto é a estrutura conceitual):

```
/app
  /(auth)
    /login
    /esqueci-senha
    /redefinir-senha
  /(app)                      → área autenticada
    /page.tsx                 → tela inicial (cards de ministérios)
    /ministerios/[id]
      /page.tsx               → página do ministério (tabela + preencher escala)
      /preencher-escala
    /admin                    → só Admin/Secretário
      /usuarios
      /ministerios
      /configuracoes
      /auditoria
  /api
    /auth/...
    /cron/...                 → endpoints chamados pelo scheduler (seção 8)
    /webhooks/...             → respostas de e-mail (confirmar/recusar presença)
/components
  /ui                         → componentes visuais genéricos e reutilizáveis
  /ministerios
  /escalas
  /admin
/lib
  /auth                       → configuração de autenticação e helpers de sessão
  /permissions                → regras de autorização (quem pode o quê)
  /email                      → templates e envio de e-mail
  /scheduling                 → lógica de geração automática de cultos/escalas
  /db                         → client do Prisma
/prisma
  /schema.prisma
  /migrations
/emails                       → templates de e-mail (React Email)
```

**Princípio de nomenclatura:** pastas e arquivos em português quando representam conceitos de domínio visíveis ao usuário (rotas como `/ministerios`), e em inglês para conceitos puramente técnicos (`/lib`, `/components`). Isso evita ficar traduzindo termos técnicos sem necessidade, mas mantém as URLs e a linguagem de negócio em português — consistente com o público final do sistema. Podemos discutir se você prefere tudo em inglês (mais comum em times técnicos) antes de bater o martelo, é uma convenção que vale fixar agora porque muda muita coisa depois.

---

## 3. Modelo de Autenticação

**Escolha: Auth.js (NextAuth) com provider de credenciais (e-mail + senha), senha com hash via bcrypt, sessão via JWT.**

**Por quê:** o PRD pede login por e-mail/senha e recuperação de senha por e-mail — nada de login social (Google, etc.) foi pedido. Auth.js é a solução padrão do ecossistema Next.js para isso, com suporte nativo a fluxo de recuperação de senha customizado.

**Alternativas consideradas:**
- **Supabase Auth (auth gerenciada, com recuperação de senha pronta).** Reduziria trabalho de implementação (o fluxo de "esqueci minha senha" já vem pronto). É uma opção muito competitiva — vou retomá-la na seção 9, porque a decisão de auth acaba dependendo de qual provedor de banco/hospedagem escolhermos no geral. Se optarmos por Supabase como plataforma (recomendação da seção 9), faz sentido usar o Auth dele também, em vez de reimplementar com Auth.js.
- **Implementação 100% manual (sem biblioteca).** Descartado — reinventar hash de senha, geração de token de recuperação com expiração e proteção contra ataques é um risco de segurança desnecessário quando existem soluções maduras e gratuitas.

**Vantagens (Auth.js):** controle total sobre o modelo de dados de usuário (fica tudo no mesmo Postgres/Prisma, sem depender de outro sistema para saber "quem é esse usuário"), zero custo, sem vendor lock-in.

**Desvantagens:** você precisa implementar o fluxo de "esqueci a senha" (geração de token, e-mail, tela de redefinição) — não vem pronto como no Supabase Auth. É um trabalho conhecido e bem documentado, mas é trabalho.

**Custo:** gratuito.

**Manutenção:** média — como o modelo de usuário fica 100% sob seu controle, qualquer mudança futura (ex: adicionar login por WhatsApp/Google depois) é direta.

**Escalabilidade:** sem limites relevantes para este projeto.

> Decisão final sobre Auth.js vs Supabase Auth fica amarrada à recomendação de hospedagem (seção 9) — lá explico o motivo de recomendar Supabase, e nesse caso a recomendação também muda para Supabase Auth.

---

## 4. Estratégia de Autorização e Permissões

**Modelo: RBAC (Role-Based Access Control) híbrido — papel global para Admin/Secretário, papel por vínculo para Líder/Membro.**

Isso reflete exatamente a decisão de negócio do PRD (seção 3): Admin e Secretário são papéis do sistema como um todo; Líder e Membro são papéis de uma relação específica Usuário × Ministério.

**Modelagem conceitual:**
- Todo usuário tem um campo de **papel global**, que pode ser `admin`, `secretario` ou `nenhum` (usuário comum, sem privilégio administrativo).
- Existe uma tabela de vínculo **Usuário × Ministério**, onde cada linha representa "este usuário participa deste ministério com este papel" (`lider` ou `membro`).
- Um usuário sem papel global pode aparecer em múltiplas linhas dessa tabela de vínculo, com papéis diferentes em ministérios diferentes — exatamente como definido no PRD.

**Onde a autorização é verificada:** centralizada em uma camada de permissões (`/lib/permissions`), não espalhada em cada tela. Cada ação sensível (ex: "remover membro do ministério") passa por uma função central que decide se o usuário logado pode ou não fazer aquilo, dado seu papel global e seus vínculos. Isso é importante para consistência: se um dia uma regra de permissão mudar, você altera em um lugar só, não em quinze telas.

**Alternativas consideradas:**
- **ABAC (Attribute-Based Access Control) mais genérico**, com políticas declarativas tipo "regras". É mais flexível, mas é overkill para 4 papéis bem definidos — adicionaria complexidade sem benefício real neste estágio.
- **Checagem de permissão espalhada pelas próprias telas/rotas** (sem camada central). Mais rápido de escrever no início, mas é exatamente o tipo de decisão que gera inconsistência de segurança com o tempo (alguém esquece de checar em uma rota nova). Rejeitado por isso.

**Custo:** nenhum impacto de custo — é decisão de arquitetura de código, não de infraestrutura.

**Manutenção:** alta, justamente por centralizar a lógica.

**Escalabilidade:** se no futuro surgirem novos papéis (ex: "Tesoureiro"), o modelo já comporta isso sem redesenho.

---

## 5. Organização do Banco de Dados (Alto Nível)

Sem entrar em DDL (isso é etapa de implementação), as entidades principais são:

- **Usuario**: dados de conta (nome, e-mail, senha com hash, papel global opcional: admin/secretário).
- **Ministerio**: nome, logo.
- **UsuarioMinisterio**: vínculo entre Usuário e Ministério, com papel (líder/membro). Chave composta ou id próprio + unique constraint em (usuário, ministério).
- **Culto**: data, horário do culto, horário de chegada, tipo (regular/extraordinário), nome/descrição (para os extraordinários, ex: "Vigília de Ano Novo").
- **Escala**: o registro de "este usuário se disponibilizou para servir neste ministério, neste culto" — vínculo entre Usuário, Ministério e Culto, com status de confirmação de presença (pendente/confirmado/ausente).
- **ConfiguracaoSistema**: parâmetros administráveis, como a antecedência (em dias) para abertura do mês seguinte.
- **LogAuditoria**: quem fez o quê, quando, em qual entidade — para a seção 11 do PRD.

**Regra de integridade chave:** a constraint que impede um usuário de estar em dois ministérios no mesmo culto (seção 12 do PRD) deve ser uma **unique constraint no banco** sobre (usuário, culto) na tabela Escala — não apenas uma checagem no código. Isso garante que, mesmo com bugs futuros na aplicação ou acessos concorrentes, o banco nunca aceita um dado inconsistente. É uma rede de segurança que o código sozinho não oferece.

**Justificativa de não normalizar demais:** decidi não criar uma entidade separada de "Igreja" (matriz) já que o escopo é uma igreja só (PRD seção 3, explícito). Se isso mudar no futuro, entra como uma migration adicionando uma tabela `Igreja` e uma FK em `Ministerio` — não é uma mudança estrutural dramática, então não vejo motivo para pagar esse custo de complexidade agora "por precaução".

---

## 6. Fluxo de Navegação Entre Telas

```
Login ──► Tela Inicial (cards por ministério)
              │
              ├──► Página do Ministério
              │        ├──► Preencher/Editar Escala
              │        └──► Visualizar tabela de escalas do mês
              │
              └──► [se Admin/Secretário] Painel Administrativo
                       ├──► Usuários (criar/editar/excluir)
                       ├──► Ministérios (criar/editar/excluir, definir líderes)
                       ├──► Configurações (antecedência de abertura do mês)
                       └──► Auditoria (somente leitura)

Esqueci minha senha ──► E-mail com link ──► Redefinir senha ──► Login
E-mail de confirmação de presença ──► Link de resposta (Confirmar/Não poderei) ──► Tela de confirmação simples (sem exigir login, com token de uso único — ver seção 3 de segurança abaixo)
```

Ponto de atenção de segurança que quero destacar: o link de confirmação de presença por e-mail (Confirmar/Não poderei) deve usar um **token único e com expiração** vinculado àquela escala específica — não pode ser algo adivinhável, e deve invalidar após o uso ou após o culto passar. Isso evita que alguém forje ou reutilize o link.

---

## 7. Estratégia para Envio de E-mails

**Escolha: serviço transacional de e-mail (Resend) com templates em React Email.**

**Por quê:** enviar e-mail direto de um servidor próprio (SMTP caseiro) tem alta chance de cair em spam e é operacionalmente frágil. Um serviço transacional dedicado garante entregabilidade e dá métricas (e-mail entregue, aberto, etc.) sem esforço de infraestrutura.

**Alternativas consideradas:**
- **SendGrid.** Equivalente em maturidade, mais "corporativo". Free tier historicamente mais restritivo que o do Resend.
- **Amazon SES.** Extremamente barato em alto volume, mas exige mais configuração manual (verificação de domínio, sandbox inicial) — desproporcional para o volume de e-mails de uma igreja (algumas centenas de e-mails por semana, no máximo).
- **Resend** venceu por integração nativa com React (templates de e-mail escritos como componentes React via **React Email**, mantendo o mesmo padrão de código do resto do projeto) e por ter um free tier suficiente para este volume.

**Vantagens:** DX excelente dentro do ecossistema Next.js/React já escolhido; templates com aparência consistente da identidade visual da igreja escritos do mesmo jeito que o resto da interface.

**Desvantagens:** é um serviço de terceiros — se ele sair do ar, e-mails atrasam (mitigável, é o mesmo risco de qualquer provedor de e-mail transacional).

**Custo:** gratuito até um volume que cobre folgadamente o uso esperado; caso a igreja cresça muito, os tiers pagos são baratos (na casa de poucos dólares por mês).

**Manutenção:** baixa.

**Escalabilidade:** sobra.

---

## 8. Geração Automática das Escalas Mensais

Este ponto tem duas responsabilidades distintas que valem a pena separar:

1. **Geração dos cultos regulares do mês** (quinta 20h, domingo 10h, domingo 18h) — isso é geração de "slots" de culto, não de escalas de pessoas (as pessoas se auto-escalam depois).
2. **Abertura automática do mês seguinte** com a antecedência configurável (padrão 7 dias).

**Escolha técnica: job agendado (cron) rodando diariamente, implementado como uma rota de API protegida, disparada por um agendador externo.**

O job diário verifica: "estamos dentro da janela de antecedência configurada para abrir o próximo mês? Se sim, e os cultos daquele mês ainda não existem, cria-os." Rodar diariamente (em vez de tentar calcular a data exata de disparo) é mais simples e mais resiliente a falhas pontuais — se o job falhar um dia, ele tenta de novo no dia seguinte e ainda está dentro da janela.

O mesmo mecanismo de agendamento dispara o envio do e-mail único de confirmação de presença antes de cada culto (seção 8 do PRD).

**Alternativas consideradas:**
- **Cron job em servidor próprio (ex: crontab em uma VM).** Funcionaria, mas significa manter um servidor rodando 24/7 só para isso, o que vai contra a filosofia de baixo custo/baixa manutenção do projeto.
- **Fila de mensagens com worker dedicado (ex: BullMQ + Redis).** Robusto e o que eu recomendaria para um sistema com volume alto de jobs concorrentes. Aqui é um job simples, uma vez por dia — trazer fila + Redis é complexidade desproporcional ao problema.
- **Serviço de cron gerenciado pela própria plataforma de hospedagem** (detalhado na seção 9) — é a opção que recomendo, por não exigir infraestrutura adicional nenhuma.

**Custo:** geralmente incluso gratuitamente nos tiers de hospedagem recomendados.

**Manutenção:** baixa — é uma rota de API comum, testável como qualquer outra parte do sistema.

**Escalabilidade:** suficiente; se o volume de e-mails/jobs crescer muito no futuro, dá para evoluir para fila dedicada sem redesenhar o resto do sistema.

---

## 9. Deploy e Hospedagem

**Recomendação: Vercel (aplicação Next.js) + Supabase (Postgres + Auth + Storage + Cron).**

Esta é a decisão que mais amarra as anteriores, então vale explicar como um pacote:

- **Vercel** para hospedar a aplicação Next.js: deploy automático a cada push no git, preview de cada branch, CDN global, certificado HTTPS automático. É o ambiente "nativo" do Next.js (mesma empresa mantém os dois), então tem o menor atrito possível.
- **Supabase** para o Postgres gerenciado, e — dado que já estamos usando a plataforma — também para:
  - **Auth** (reconsiderando a seção 3: usar o Supabase Auth em vez de reimplementar recuperação de senha manualmente com Auth.js economiza trabalho real, sem perder controle sobre os dados, já que tudo continua no mesmo Postgres).
  - **Storage** (para as logos, seção 11).
  - **Cron** (via pg_cron/Edge Functions, para a geração automática de escalas, seção 8) — evita depender de um serviço de cron externo separado.

**Alternativas consideradas:**
- **Railway ou Render** (hospedagem full-stack tradicional, com banco incluso). Também são boas opções, mais "genéricas" — funcionam bem mas não têm a mesma integração nativa com Next.js que a Vercel tem, nem o pacote de Auth/Storage/Cron que o Supabase oferece.
- **AWS "from scratch"** (EC2/RDS/SES montados manualmente). Dá controle total e pode ser mais barato em escala muito grande, mas exige conhecimento de DevOps que não deveria ser pré-requisito para manter o sistema de uma igreja. Rejeitado por desproporção entre esforço operacional e necessidade real do projeto.
- **VPS única barata (ex: DigitalOcean) rodando tudo junto.** Mais barato em teoria, mas quem mantém precisa cuidar de atualização de sistema operacional, backup manual, certificado SSL, etc. — o oposto do que o PRD pede em "fácil de manter".

**Vantagens do pacote Vercel + Supabase:** onboarding rápido para qualquer novo colaborador/voluntário técnico (documentação excelente, muito usado no mercado), sem servidor para administrar, backups e segurança de infraestrutura são responsabilidade do provedor.

**Desvantagens:** é um "vendor pareado" — se um dia vocês quiserem migrar de provedor, há algum trabalho de portar Auth/Storage/Cron (o banco em si, por ser Postgres puro, migra fácil). Considero um risco aceitável dado o ganho de simplicidade operacional.

**Custo:** ambos têm free tier que cobre confortavelmente o uso esperado de uma igreja de porte médio (Vercel free tier suporta o tráfego esperado; Supabase free tier suporta o volume de dados e usuários esperado). Se a igreja crescer bastante, os primeiros tiers pagos giram em torno de US$ 20-25/mês cada — ainda assim baixo para uma organização.

**Manutenção:** muito baixa — este é o ponto central da recomendação.

**Escalabilidade:** ampla margem antes de precisar reconsiderar a arquitetura.

---

## 10. Estratégia de Backup e Recuperação

**Recomendação:** habilitar os backups diários automáticos do Supabase (inclusos a partir do tier pago inicial) e, adicionalmente, configurar um job próprio (reaproveitando o mecanismo de cron da seção 8) que exporta um dump do banco periodicamente para um storage externo (ex: o próprio Supabase Storage ou um bucket separado), como camada extra de segurança independente do provedor.

**Por quê a camada extra:** não é bom depender 100% de backups do mesmo provedor onde os dados vivem — se houver um problema na conta ou billing do Supabase, um backup replicado em outro lugar evita perda total. É uma prática de resiliência barata (o dump de um banco desse porte é pequeno) que vale a pena desde o MVP.

**Custo:** baixo — o tier de Supabase com backup diário automático já cobre a maior parte da necessidade; a cópia extra usa armazenamento de storage muito barato.

**Manutenção:** baixa, uma vez configurado.

---

## 11. Estratégia para Armazenamento das Logos

**Recomendação: Supabase Storage**, já que faz parte do mesmo pacote de infraestrutura da seção 9 — evita introduzir mais um provedor (ex: Cloudinary) só para isso.

**Alternativas consideradas:** Cloudinary (especializado em imagens, com otimização/transformação automática mais sofisticada) — seria a escolha certa se o sistema lidasse com muito conteúdo de imagem variável (galerias, uploads frequentes de usuários finais). Aqui são poucas logos, cadastradas raramente (uma por ministério + uma da igreja) — não justifica um provedor especializado adicional.

**Custo:** incluso no free tier do Supabase para este volume.

**Manutenção:** nenhuma além do já considerado no pacote geral.

---

## 12. Estratégia para Futuras Evoluções do Sistema

Pontos que deixo desenhados desde já, sem implementar, para que evoluções futuras não exijam reescrever a base:

- **App mobile nativo (se um dia fizer sentido):** como o backend já é uma API (rotas Next.js), um app mobile futuro consumiria essas mesmas rotas sem precisar duplicar lógica de negócio — só precisaria de uma camada de autenticação compatível.
- **Multi-tenant (outras unidades da Bola de Neve):** não implementado agora (fora de escopo, PRD seção 3), mas a modelagem de `Ministerio` já vinculado a uma entidade única de igreja (mesmo que hoje só exista uma) deixa o caminho mais curto se isso vier a ser pedido — adicionar uma tabela `Igreja` e uma FK é uma migration incremental, não uma reescrita.
- **Novos papéis de permissão** (ex: Tesoureiro): o modelo RBAC híbrido (seção 4) já comporta isso.
- **Substituição automática de integrantes / controle de quantidade mínima por culto** (explicitamente fora de escopo no PRD): a modelagem da tabela `Escala` já guarda os dados necessários (quem está confirmado, quem está ausente) para que essas features sejam adicionadas depois sem migração de dados retroativa.

---

## Recomendação Final Consolidada

**Next.js (App Router) + PostgreSQL via Prisma, hospedado como Vercel (aplicação) + Supabase (banco, autenticação, storage de logos e cron de agendamento), com Resend + React Email para envio de e-mails transacionais.**

Por que esse pacote, e não os componentes escolhidos individualmente à la carte, é a melhor escolha para *este* projeto especificamente: cada peça reduz a superfície de manutenção em vez de aumentá-la, o custo permanece próximo de zero na escala de uma igreja, nenhuma parte exige conhecimento avançado de DevOps para manter no dia a dia, e mesmo assim nada aqui é um beco sem saída — cada decisão tem um caminho de evolução claro (app mobile, multi-tenant, novos papéis) caso o projeto cresça além do que o PRD prevê hoje.

O maior trade-off consciente desta recomendação é o acoplamento a duas plataformas (Vercel + Supabase). Considero esse acoplamento um preço baixo e justificado pela redução de complexidade operacional que ele compra — mas é uma decisão de negócio, não só técnica, então quero seu aval explícito nisso antes de seguirmos.

---

**Próximo passo sugerido:** se você concordar com esta arquitetura, o próximo nível de detalhe antes de codar seria desenhar o schema do Prisma (modelo de dados completo, com todos os campos e relações) e as rotas/telas em detalhe. Posso seguir por aí quando você aprovar.
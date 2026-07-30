# PRD — Escala Bola de Neve Sorocaba

**Versão:** 2.0 (consolidada com decisões de negócio do MVP)
**Status:** Em revisão — aguardando aprovação para iniciar arquitetura técnica

---

## 1. Visão Geral

### Nome do Projeto
Escala Bola de Neve Sorocaba

### Objetivo
Desenvolver um sistema web responsivo para gerenciamento das escalas dos ministérios da Igreja Bola de Neve Sorocaba, substituindo o processo manual de organização das escalas. O sistema permite que cada membro informe em quais cultos deseja servir, visualize a escala do seu ministério e confirme sua presença antes de cada culto.

O acesso será realizado pelo navegador, em computadores e dispositivos móveis, sem necessidade de instalação de aplicativo.

### Escopo
O sistema será desenvolvido **exclusivamente para a Igreja Bola de Neve Sorocaba**. Não há requisito de suporte a múltiplas igrejas (multi-tenant) nesta versão, e esse cenário não deve ser considerado no projeto atual.

### Objetivo da Primeira Versão (MVP)
O foco desta versão é **substituir o processo manual** atualmente realizado pela igreja, mantendo o fluxo de trabalho já utilizado pelos ministérios. A prioridade é entregar um sistema **simples, intuitivo, rápido de usar e fácil de manter**. Funcionalidades que aumentem a complexidade sem gerar valor real para o uso cotidiano devem ser evitadas nesta fase.

---

## 2. Objetivos do Sistema

- Centralizar as escalas dos ministérios.
- Facilitar o preenchimento das escalas pelos membros.
- Permitir visualização das escalas de forma simples e acessível.
- Reduzir falhas de comunicação.
- Automatizar confirmações de presença.
- Facilitar a administração dos ministérios.

---

## 3. Modelo de Permissões

**Princípio central:** as permissões **não pertencem ao usuário de forma global** — elas pertencem à relação **Usuário × Ministério**.

Isso significa que um mesmo usuário pode, simultaneamente:
- Ser **Líder** de um ministério;
- Ser **Membro** de outro ministério;
- Ser **Líder** de mais de um ministério, se necessário.

O sistema deve suportar esse comportamento de forma nativa no modelo de dados (a permissão é um atributo do vínculo usuário-ministério, não do usuário isoladamente).

### 3.1 Papéis do Sistema

#### Administrador
Acesso total ao sistema. Pode:
- Criar, editar e excluir usuários;
- Criar e remover Secretários;
- Criar, editar e excluir ministérios;
- Alterar qualquer configuração do sistema;
- Gerenciar todos os dados.

#### Secretário
Responsável pela administração operacional da igreja. Pode:
- Criar, editar e excluir ministérios;
- Criar e editar usuários;
- Adicionar e remover membros dos ministérios;
- Definir ou remover Líderes;
- Visualizar todos os ministérios.

Não pode:
- Criar ou remover Secretários;
- Alterar configurações gerais do sistema.

#### Líder
Escopo restrito ao(s) ministério(s) em que possui liderança. Pode:
- Visualizar apenas os ministérios onde possui liderança;
- Adicionar e remover membros do(s) próprio(s) ministério(s);
- Visualizar a escala do(s) próprio(s) ministério(s);
- Visualizar confirmações de presença.

Não pode alterar permissões de usuários.

#### Membro
Pode:
- Visualizar apenas os ministérios dos quais participa;
- Preencher sua própria escala;
- Editar sua própria escala;
- Confirmar presença.

---

## 4. Ministérios (Primeira Versão)

- Boas-vindas
- Ministério Infantil
- Assistência Social

O sistema deve permitir o cadastro de novos ministérios futuramente sem necessidade de alterações estruturais.

---

## 5. Fluxo Principal

1. Usuário faz login.
2. Visualiza a tela inicial com seus ministérios em formato de cards.
3. Escolhe um ministério.
4. Visualiza a escala do mês corrente.
5. Caso ainda não tenha preenchido sua escala, clica em **Preencher Escala**.
6. Seleciona apenas os cultos em que deseja servir.
7. Salva.
8. Seu nome passa a aparecer automaticamente na tabela daquele culto.
9. O membro pode editar sua escala a qualquer momento durante o mês (não há fechamento de escala).
10. Próximo ao culto, recebe um único e-mail automático para confirmar presença.
11. Caso informe que não poderá comparecer, o líder recebe um e-mail de aviso.

**Importante:** não há aprovação por parte do líder — a própria seleção do membro representa sua escala.

---

## 6. Cultos

### 6.1 Cultos Regulares (geração automática)
Os cultos regulares são gerados automaticamente pelo sistema todo mês, sem necessidade de cadastro manual:

| Dia | Culto | Chegada |
|---|---|---|
| Quinta-feira | 20h | 19h |
| Domingo (manhã) | 10h | 9h |
| Domingo (noite) | 18h | 17h |

### 6.2 Cultos Extraordinários
Administradores e Secretários podem criar cultos extraordinários adicionais (ex.: Natal, Páscoa, conferências, congressos, vigílias, eventos especiais). Esses cultos aparecem normalmente nas escalas do mês em que forem criados.

### 6.3 Conflito de Agenda
Um usuário **não pode** estar escalado em dois ministérios no mesmo culto (mesma data e horário). O sistema deve impedir o salvamento da escala nesse caso e informar claramente ao usuário o motivo do bloqueio.

---

## 7. Ciclo de Vida das Escalas

- As escalas são organizadas **por mês**.
- **As escalas nunca são fechadas** — membros podem editar sua escala a qualquer momento durante o mês corrente.
- O sistema abre automaticamente o preenchimento do **mês seguinte** com uma antecedência configurável antes do término do mês atual.
  - Na primeira versão, a antecedência padrão é de **7 dias**.
  - Esse valor deve ser **configurável pelo Administrador** nas configurações do sistema.

**Exemplo de funcionamento (antecedência de 7 dias):**
- Entre 24 e 31 de julho: agosto já está disponível para preenchimento (em paralelo a julho).
- Em 1º de agosto: agosto passa a ser automaticamente o mês principal.
- Entre 25 e 31 de agosto: setembro já fica disponível para preenchimento.

Esse processo deve ocorrer de forma automática, sem intervenção manual.

---

## 8. Confirmação de Presença

- O sistema envia **apenas um e-mail automático** antes de cada culto.
- O membro responde:
  - **Confirmo presença**; ou
  - **Não poderei comparecer**.
- Caso informe ausência, o líder do ministério recebe automaticamente um e-mail informando a indisponibilidade.

**Fora de escopo nesta versão:**
- Alterações de situação **após** a resposta inicial — caso o membro precise mudar sua resposta depois de enviada, essa comunicação continua sendo feita manualmente pelo WhatsApp do ministério, como já ocorre hoje. Não há fluxo de cancelamento posterior no sistema.
- Alterações de escala muito próximas ao culto também continuam sendo tratadas pelo WhatsApp do ministério — o sistema não substitui esse processo.

---

## 9. Substituição de Integrantes

**Fora de escopo nesta versão.** Não há funcionalidade de substituição automática. Quando alguém informa ausência, a reorganização da escala continua sendo feita pelo líder através do WhatsApp do ministério.

---

## 10. Quantidade de Pessoas por Culto

**Fora de escopo nesta versão.** O sistema não controla quantidade mínima, máxima ou ideal de pessoas por culto. Essa regra não existe hoje na operação da igreja e não faz parte do escopo desta versão.

---

## 11. Auditoria

O sistema deve registrar alterações administrativas importantes, incluindo:
- Criação de usuários;
- Edição de usuários;
- Inclusão e remoção de membros em ministérios;
- Criação e exclusão de ministérios;
- Alteração de permissões.

Esses registros ficam visíveis **apenas para Administradores e Secretários**.

---

## 12. Tela Inicial

Após o login, o usuário visualiza seus ministérios em formato de cards. Cada card contém:
- Logo do ministério;
- Nome do ministério;
- Próxima escala do usuário naquele ministério.

Caso o usuário ainda não tenha preenchido sua escala do mês naquele ministério, o card informa isso e apresenta o botão **Preencher Escala**.

Após o usuário concluir uma escala, o sistema atualiza automaticamente o card para exibir a próxima escala futura daquele ministério.

**Fora de escopo nesta versão:** uma agenda consolidada exibindo todos os compromissos do mês do usuário entre múltiplos ministérios.

---

## 13. Página do Ministério

Cada ministério possui uma página própria contendo:
- Logo do ministério;
- Nome do ministério;
- Botão Preencher Escala;
- Tabela com as escalas do mês.

A tabela contém:
- Data;
- Horário do culto;
- Horário de chegada;
- Lista de pessoas escaladas.

Todos os membros daquele ministério podem visualizar a tabela.

---

## 14. Identidade Visual

- Logo oficial da Igreja Bola de Neve Sorocaba na tela de login.
- Logo oficial de cada ministério nos respectivos cards e páginas.
- Design moderno, limpo e intuitivo.

---

## 15. Requisitos Técnicos

- Sistema web responsivo, funcionando em computadores, tablets e celulares.
- Login por e-mail e senha.
- **Recuperação de senha por e-mail.**
- Banco de dados centralizado.
- Atualizações convencionais de interface — **sem** uso de tecnologia de tempo real (websockets ou similar). Recarregar/revalidar a página é suficiente para este projeto.
- Arquitetura organizada para permitir manutenção e evolução futura, dentro do escopo definido (sem necessidade de suportar multi-tenant).

---

## 16. Fora de Escopo (MVP) — Resumo

Para deixar explícito o que **não** será implementado nesta primeira versão, evitando ambiguidade em etapas futuras:

- Multi-tenant / múltiplas igrejas.
- Aprovação de escala por parte do líder.
- Fechamento formal de escala.
- Cancelamento de confirmação de presença após resposta inicial.
- Substituição automática de integrantes ausentes.
- Controle de quantidade mínima/máxima de pessoas por culto.
- Agenda consolidada de compromissos entre ministérios.
- Atualizações em tempo real.

Esses pontos continuam sendo resolvidos pelos processos manuais já existentes (WhatsApp do ministério) e podem ser reavaliados em versões futuras, caso façam sentido.

---

## 17. Histórico de Revisão

| Versão | Data | Alteração |
|---|---|---|
| 1.0 | — | PRD inicial |
| 2.0 | 30/07/2026 | Consolidação das decisões de negócio do MVP: modelo de permissões por Usuário×Ministério, geração automática de cultos, ciclo de vida das escalas, itens explicitamente marcados como fora de escopo, auditoria, conflito de agenda, recuperação de senha |

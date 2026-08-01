# Escala BDN Sorocaba

Sistema web para gerenciamento das escalas dos ministérios da Igreja Bola de Neve Sorocaba.

---

## Objetivo

O Escala BDN Sorocaba foi criado para substituir o gerenciamento manual das escalas realizado via WhatsApp, centralizando todo o processo em uma plataforma simples, organizada e acessível.

O sistema permitirá que cada membro visualize seus ministérios, escolha as escalas em que deseja servir, confirme presença por e-mail e possibilitará que líderes, secretários e administradores acompanhem toda a organização das equipes.

---

## Funcionalidades (MVP)

- Login com e-mail e senha
- Recuperação de senha
- Visualização dos ministérios
- Preenchimento da escala mensal
- Edição da escala durante o mês
- Visualização da próxima escala
- Confirmação de presença por e-mail
- Administração de usuários
- Administração dos ministérios
- Criação de cultos extraordinários
- Auditoria das alterações

---

## Stack Tecnológica

### Frontend

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form
- Zod
- Framer Motion
- Lucide React

### Backend

- Next.js (Server Actions)
- Prisma ORM

### Banco de Dados

- PostgreSQL (Supabase)

### Infraestrutura

- Supabase
  - Database
  - Authentication
  - Storage
- Resend (Envio de e-mails)
- Vercel (Deploy)

---

## Arquitetura

Todo o projeto foi planejado antes do início da implementação.

| Documento | Descrição |
|-----------|-----------|
| `docs/01-PRD.md` | Documento de requisitos do sistema |
| `docs/02-Arquitetura-Tecnica.md` | Arquitetura da aplicação |
| `docs/03-Modelo-Banco.md` | Modelagem do banco de dados (Prisma) |
| `docs/04-Rotas-API.md` | Rotas, APIs e Server Actions |
| `docs/05-Fluxo-Telas.md` | Fluxo das telas da aplicação |
| `docs/06-Design-System.md` | Design System e componentes |
| `docs/07-Plano-Implementacao.md` | Plano de implementação |

Toda implementação deve seguir a documentação oficial do projeto.

---

## Estrutura do Projeto

```text
Escala-BDN-Sorocaba/
│
├── app/
├── components/
├── docs/
├── emails/
├── lib/
├── prisma/
│
├── .env.example
├── components.json
├── eslint.config.mjs
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── README.md
├── tailwind.config.ts
└── tsconfig.json
```

---

## Roadmap

- [x] Planejamento da ideia
- [x] Documento de Requisitos (PRD)
- [x] Arquitetura Técnica
- [x] Modelagem do Banco de Dados
- [x] Rotas / API / Server Actions
- [x] Fluxo de Telas
- [x] Design System
- [x] Plano de Implementação
- [x] Fase 1 — Setup do Projeto
- [x] Fase 2 — Banco de Dados
- [ ] Fase 3 — Autenticação e Autorização
- [ ] Fase 4 — Layout Base
- [ ] Fase 5 — Componentes Reutilizáveis
- [ ] Fase 6 — Área do Usuário
- [ ] Fase 7 — Área Administrativa
- [ ] Fase 8 — Jobs Automáticos
- [ ] Fase 9 — E-mails
- [ ] Fase 10 — Testes
- [ ] Fase 11 — Deploy

---

## Status do Projeto

| Etapa | Status |
|-------|--------|
| Planejamento | ✅ Concluído |
| Documentação | ✅ Concluída |
| Setup | ✅ Concluído |
| Banco de Dados | ✅ Concluído |
| Autenticação | 🚧 Em desenvolvimento |
| Layout Base | ⏳ Aguardando |
| Área do Usuário | ⏳ Aguardando |
| Área Administrativa | ⏳ Aguardando |
| Testes | ⏳ Aguardando |
| Deploy | ⏳ Aguardando |

---

## Licença

Projeto privado desenvolvido para a Igreja Bola de Neve Sorocaba.

---

## Autor

Desenvolvido por **Matheus Avane**, com apoio de inteligência artificial durante o planejamento, arquitetura e desenvolvimento do projeto.

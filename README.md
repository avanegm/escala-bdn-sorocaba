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
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS

### Backend
- Next.js API Routes
- Prisma ORM

### Banco de Dados
- PostgreSQL

### Infraestrutura
- Supabase
  - Database
  - Authentication
  - Storage
- Resend (Envio de e-mails)
- Vercel (Deploy)

---

## Arquitetura

Todo o projeto foi planejado antes do início do desenvolvimento.

| Documento | Descrição |
|-----------|-----------|
| `docs/01-PRD.md` | Documento de requisitos do sistema |
| `docs/02-Arquitetura-Tecnica.md` | Arquitetura da aplicação |
| `docs/03-Modelo-Banco.md` | Modelagem do banco de dados (Prisma) |

---

## Estrutura do Projeto

```text
Escala-BDN-Sorocaba/
│
├── docs/
├── prisma/
├── public/
├── src/
│
├── .gitignore
├── README.md
├── package.json
└── tsconfig.json
```

*A estrutura será expandida conforme o desenvolvimento.*

---

## Roadmap

- [x] Planejamento da ideia
- [x] Documento de Requisitos (PRD)
- [x] Arquitetura Técnica
- [x] Modelagem do Banco de Dados
- [ ] Protótipos (UI/UX)
- [ ] Implementação Backend
- [ ] Implementação Frontend
- [ ] Testes
- [ ] Deploy em Produção

---

## Status do Projeto

| Etapa | Status |
|-------|--------|
| Ideia | ✅ Concluída |
| PRD | ✅ Concluído |
| Arquitetura | ✅ Concluída |
| Banco de Dados | ✅ Concluído |
| Protótipos | ⏳ Em breve |
| Backend | ⏳ Em breve |
| Frontend | ⏳ Em breve |
| Testes | ⏳ Em breve |
| Deploy | ⏳ Em breve |

---

## Licença

Projeto privado desenvolvido para a Igreja Bola de Neve Sorocaba.

---

## Autor

Desenvolvido por **Matheus Avane** com apoio de inteligência artificial durante o planejamento, arquitetura e desenvolvimento do projeto.
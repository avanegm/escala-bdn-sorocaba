-- CreateEnum
CREATE TYPE "PapelGlobal" AS ENUM ('ADMIN', 'SECRETARIO');

-- CreateEnum
CREATE TYPE "PapelMinisterio" AS ENUM ('LIDER', 'MEMBRO');

-- CreateEnum
CREATE TYPE "TipoCulto" AS ENUM ('REGULAR', 'EXTRAORDINARIO');

-- CreateEnum
CREATE TYPE "StatusConfirmacao" AS ENUM ('PENDENTE', 'CONFIRMADO', 'AUSENTE');

-- CreateEnum
CREATE TYPE "AcaoAuditoria" AS ENUM ('CRIACAO_USUARIO', 'EDICAO_USUARIO', 'EXCLUSAO_USUARIO', 'INCLUSAO_MEMBRO_MINISTERIO', 'REMOCAO_MEMBRO_MINISTERIO', 'DEFINICAO_LIDER', 'CRIACAO_MINISTERIO', 'EDICAO_MINISTERIO', 'EXCLUSAO_MINISTERIO', 'ALTERACAO_CONFIGURACAO', 'EDICAO_ESCALA_EM_NOME_DE');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "papel_global" "PapelGlobal",
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ministerios" (
    "id" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "logo_url" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ministerios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios_ministerios" (
    "id" UUID NOT NULL,
    "usuario_id" UUID NOT NULL,
    "ministerio_id" UUID NOT NULL,
    "papel" "PapelMinisterio" NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_ministerios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cultos" (
    "id" UUID NOT NULL,
    "data_hora_culto" TIMESTAMP(3) NOT NULL,
    "data_hora_chegada" TIMESTAMP(3) NOT NULL,
    "tipo" "TipoCulto" NOT NULL,
    "nome" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cultos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "escalas" (
    "id" UUID NOT NULL,
    "usuario_id" UUID NOT NULL,
    "ministerio_id" UUID NOT NULL,
    "culto_id" UUID NOT NULL,
    "status_confirmacao" "StatusConfirmacao" NOT NULL DEFAULT 'PENDENTE',
    "token_confirmacao" TEXT,
    "token_expira_em" TIMESTAMP(3),
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "escalas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuracoes_sistema" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "dias_antecedencia_abertura_proximo_mes" INTEGER NOT NULL DEFAULT 7,
    "horas_antecedencia_lembrete_presenca" INTEGER NOT NULL DEFAULT 24,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configuracoes_sistema_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logs_auditoria" (
    "id" UUID NOT NULL,
    "usuario_id" UUID,
    "acao" "AcaoAuditoria" NOT NULL,
    "entidade_afetada" TEXT NOT NULL,
    "entidade_id" TEXT,
    "detalhes" JSONB,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logs_auditoria_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "usuarios_papel_global_idx" ON "usuarios"("papel_global");

-- CreateIndex
CREATE UNIQUE INDEX "ministerios_nome_key" ON "ministerios"("nome");

-- CreateIndex
CREATE INDEX "ministerios_ativo_idx" ON "ministerios"("ativo");

-- CreateIndex
CREATE INDEX "usuarios_ministerios_ministerio_id_idx" ON "usuarios_ministerios"("ministerio_id");

-- CreateIndex
CREATE INDEX "usuarios_ministerios_usuario_id_idx" ON "usuarios_ministerios"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_ministerios_usuario_id_ministerio_id_key" ON "usuarios_ministerios"("usuario_id", "ministerio_id");

-- CreateIndex
CREATE UNIQUE INDEX "cultos_data_hora_culto_key" ON "cultos"("data_hora_culto");

-- CreateIndex
CREATE INDEX "cultos_tipo_idx" ON "cultos"("tipo");

-- CreateIndex
CREATE UNIQUE INDEX "escalas_token_confirmacao_key" ON "escalas"("token_confirmacao");

-- CreateIndex
CREATE INDEX "escalas_ministerio_id_culto_id_idx" ON "escalas"("ministerio_id", "culto_id");

-- CreateIndex
CREATE INDEX "escalas_culto_id_idx" ON "escalas"("culto_id");

-- CreateIndex
CREATE UNIQUE INDEX "escalas_usuario_id_culto_id_key" ON "escalas"("usuario_id", "culto_id");

-- CreateIndex
CREATE INDEX "logs_auditoria_usuario_id_idx" ON "logs_auditoria"("usuario_id");

-- CreateIndex
CREATE INDEX "logs_auditoria_entidade_afetada_entidade_id_idx" ON "logs_auditoria"("entidade_afetada", "entidade_id");

-- CreateIndex
CREATE INDEX "logs_auditoria_criado_em_idx" ON "logs_auditoria"("criado_em");

-- AddForeignKey
ALTER TABLE "usuarios_ministerios" ADD CONSTRAINT "usuarios_ministerios_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios_ministerios" ADD CONSTRAINT "usuarios_ministerios_ministerio_id_fkey" FOREIGN KEY ("ministerio_id") REFERENCES "ministerios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "escalas" ADD CONSTRAINT "escalas_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "escalas" ADD CONSTRAINT "escalas_ministerio_id_fkey" FOREIGN KEY ("ministerio_id") REFERENCES "ministerios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "escalas" ADD CONSTRAINT "escalas_culto_id_fkey" FOREIGN KEY ("culto_id") REFERENCES "cultos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs_auditoria" ADD CONSTRAINT "logs_auditoria_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

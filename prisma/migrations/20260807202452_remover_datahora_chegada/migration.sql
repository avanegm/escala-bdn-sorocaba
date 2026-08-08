/*
  Warnings:

  - You are about to drop the column `dias_antecedencia_abertura_proximo_mes` on the `configuracoes_sistema` table. All the data in the column will be lost.
  - You are about to drop the column `horas_antecedencia_lembrete_presenca` on the `configuracoes_sistema` table. All the data in the column will be lost.
  - You are about to drop the column `data_hora_chegada` on the `cultos` table. All the data in the column will be lost.
  - You are about to drop the column `status_confirmacao` on the `escalas_participantes` table. All the data in the column will be lost.
  - You are about to drop the column `token_confirmacao` on the `escalas_participantes` table. All the data in the column will be lost.
  - You are about to drop the column `token_expira_em` on the `escalas_participantes` table. All the data in the column will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "AcaoAuditoria" ADD VALUE 'CRIACAO_CULTO_REGULAR';
ALTER TYPE "AcaoAuditoria" ADD VALUE 'EDICAO_CULTO_REGULAR';
ALTER TYPE "AcaoAuditoria" ADD VALUE 'EXCLUSAO_CULTO_REGULAR';
ALTER TYPE "AcaoAuditoria" ADD VALUE 'GERACAO_PROXIMO_MES';

-- DropIndex
DROP INDEX "escalas_participantes_token_confirmacao_key";

-- AlterTable
ALTER TABLE "configuracoes_sistema" DROP COLUMN "dias_antecedencia_abertura_proximo_mes",
DROP COLUMN "horas_antecedencia_lembrete_presenca",
ADD COLUMN     "dias_antes_bloquear_alteracoes" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "cultos" DROP COLUMN "data_hora_chegada";

-- AlterTable
ALTER TABLE "cultos_regulares" ADD COLUMN     "ordem" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "escalas_participantes" DROP COLUMN "status_confirmacao",
DROP COLUMN "token_confirmacao",
DROP COLUMN "token_expira_em";

-- DropEnum
DROP TYPE "StatusConfirmacao";

-- CreateIndex
CREATE INDEX "cultos_status_idx" ON "cultos"("status");

-- CreateIndex
CREATE INDEX "cultos_regulares_ativo_idx" ON "cultos_regulares"("ativo");

/*
  Warnings:

  - You are about to drop the column `status_confirmacao` on the `escalas` table. All the data in the column will be lost.
  - You are about to drop the column `token_confirmacao` on the `escalas` table. All the data in the column will be lost.
  - You are about to drop the column `token_expira_em` on the `escalas` table. All the data in the column will be lost.
  - You are about to drop the column `usuario_id` on the `escalas` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[culto_id,ministerio_id]` on the table `escalas` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `atualizado_em` to the `cultos` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StatusCulto" AS ENUM ('PLANEJADO', 'PUBLICADO', 'FINALIZADO');

-- DropForeignKey
ALTER TABLE "escalas" DROP CONSTRAINT "escalas_usuario_id_fkey";

-- DropIndex
DROP INDEX "escalas_ministerio_id_culto_id_idx";

-- DropIndex
DROP INDEX "escalas_token_confirmacao_key";

-- DropIndex
DROP INDEX "escalas_usuario_id_culto_id_key";

-- AlterTable
ALTER TABLE "cultos" ADD COLUMN     "atualizado_em" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "status" "StatusCulto" NOT NULL DEFAULT 'PLANEJADO';

-- AlterTable
ALTER TABLE "escalas" DROP COLUMN "status_confirmacao",
DROP COLUMN "token_confirmacao",
DROP COLUMN "token_expira_em",
DROP COLUMN "usuario_id",
ADD COLUMN     "observacao" TEXT,
ADD COLUMN     "ordem" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "escalas_participantes" (
    "id" UUID NOT NULL,
    "escala_id" UUID NOT NULL,
    "usuario_id" UUID NOT NULL,
    "status_confirmacao" "StatusConfirmacao" NOT NULL DEFAULT 'PENDENTE',
    "token_confirmacao" TEXT,
    "token_expira_em" TIMESTAMP(3),
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "escalas_participantes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "escalas_participantes_token_confirmacao_key" ON "escalas_participantes"("token_confirmacao");

-- CreateIndex
CREATE INDEX "escalas_participantes_escala_id_idx" ON "escalas_participantes"("escala_id");

-- CreateIndex
CREATE INDEX "escalas_participantes_usuario_id_idx" ON "escalas_participantes"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "escalas_participantes_escala_id_usuario_id_key" ON "escalas_participantes"("escala_id", "usuario_id");

-- CreateIndex
CREATE INDEX "escalas_ministerio_id_idx" ON "escalas"("ministerio_id");

-- CreateIndex
CREATE UNIQUE INDEX "escalas_culto_id_ministerio_id_key" ON "escalas"("culto_id", "ministerio_id");

-- AddForeignKey
ALTER TABLE "escalas_participantes" ADD CONSTRAINT "escalas_participantes_escala_id_fkey" FOREIGN KEY ("escala_id") REFERENCES "escalas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "escalas_participantes" ADD CONSTRAINT "escalas_participantes_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

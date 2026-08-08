"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/db/prisma";
import { podeAdministracaoGlobal } from "@/lib/auth/permissoes";

export async function criarCulto(formData: FormData) {
  await podeAdministracaoGlobal();

  const nome = formData.get("nome")?.toString().trim() || null;
  const dataHoraCulto = formData.get("dataHoraCulto")?.toString();
  const tipo = formData.get("tipo")?.toString();

  if (!dataHoraCulto || !tipo) {
    throw new Error("Preencha todos os campos obrigatórios.");
  }

  await prisma.culto.create({
    data: {
      nome,
      dataHoraCulto: new Date(dataHoraCulto),
      tipo: tipo as any,
    },
  });

  revalidatePath("/cultos");
  redirect("/cultos");
}

/**
 * TEMPORÁRIO
 *
 * Esta Action será removida quando implementarmos
 * a geração automática das Escalas.
 *
 * Futuramente:
 * Gerar Próximo Mês
 * ↓
 * Cria todos os Cultos
 * ↓
 * Cria automaticamente uma Escala
 * para cada Ministério ativo.
 */
export async function criarEscala(
  cultoId: string,
  formData: FormData
) {
  await podeAdministracaoGlobal();

  const ministerioId = formData
    .get("ministerioId")
    ?.toString();

  if (!ministerioId) {
    throw new Error("Ministério obrigatório.");
  }

  const existente = await prisma.escala.findUnique({
    where: {
      cultoId_ministerioId: {
        cultoId,
        ministerioId,
      },
    },
  });

  if (existente) {
    throw new Error(
      "Este ministério já foi adicionado ao culto."
    );
  }

  await prisma.escala.create({
    data: {
      cultoId,
      ministerioId,
    },
  });

  revalidatePath(`/cultos/${cultoId}`);
  redirect(`/cultos/${cultoId}`);
}
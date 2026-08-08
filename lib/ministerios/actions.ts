"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/db/prisma";
import {
  podeAdministracaoGlobal,
  exigirPermissaoMinisterio,
} from "@/lib/auth/permissoes";

export async function criarMinisterio(formData: FormData) {
  await podeAdministracaoGlobal();

  const nome = formData.get("nome")?.toString().trim();

  if (!nome) {
    throw new Error("Nome obrigatório.");
  }

  await prisma.ministerio.create({
    data: {
      nome,
    },
  });

  revalidatePath("/ministerios");
  redirect("/ministerios");
}

export async function adicionarMembro(
  ministerioId: string,
  formData: FormData
) {


  await podeAdministracaoGlobal();

  const usuarioId = formData.get("usuarioId")?.toString();
  const papel = formData.get("papel")?.toString();

  if (!usuarioId || !papel) {
    throw new Error("Dados inválidos.");
  }

  const vinculoExistente = await prisma.usuarioMinisterio.findFirst({
    where: {
      usuarioId,
      ministerioId,
    },
  });

  if (vinculoExistente) {
    throw new Error("Este usuário já pertence ao ministério.");
  }

  await prisma.usuarioMinisterio.create({
    data: {
      usuarioId,
      ministerioId,
      papel: papel as any,
    },
  });

  revalidatePath(`/ministerios/${ministerioId}`);
  redirect(`/ministerios/${ministerioId}`);
}

export async function removerMembro(
  ministerioId: string,
  usuarioMinisterioId: string
) {
  await exigirPermissaoMinisterio(ministerioId);

  await prisma.usuarioMinisterio.delete({
    where: {
      id: usuarioMinisterioId,
    },
  });

  revalidatePath(`/ministerios/${ministerioId}`);
}

export async function alterarPapel(
  ministerioId: string,
  usuarioMinisterioId: string
) {
  await exigirPermissaoMinisterio(ministerioId);

  const vinculo = await prisma.usuarioMinisterio.findUnique({
    where: {
      id: usuarioMinisterioId,
    },
  });

  if (!vinculo) {
    throw new Error("Vínculo não encontrado.");
  }

  await prisma.usuarioMinisterio.update({
    where: {
      id: usuarioMinisterioId,
    },
    data: {
      papel: vinculo.papel === "LIDER" ? "MEMBRO" : "LIDER",
    },
  });

  revalidatePath(`/ministerios/${ministerioId}`);
}
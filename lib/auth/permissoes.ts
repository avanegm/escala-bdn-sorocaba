import { prisma } from "@/lib/db/prisma";
import { obterUsuarioAutenticado } from "./session";

export async function podeAdministracaoGlobal() {
  const usuario = await obterUsuarioAutenticado();

  if (!usuario) {
    throw new Error("Usuário não autenticado.");
  }

  if (
    usuario.papelGlobal !== "ADMIN" &&
    usuario.papelGlobal !== "SECRETARIO"
  ) {
    throw new Error("Sem permissão.");
  }

  return usuario;
}

export async function podeAdministrarMinisterio(
  ministerioId: string
) {
  const usuario = await obterUsuarioAutenticado();

  if (!usuario) {
    return false;
  }

  if (
    usuario.papelGlobal === "ADMIN" ||
    usuario.papelGlobal === "SECRETARIO"
  ) {
    return true;
  }

  const vinculo = await prisma.usuarioMinisterio.findFirst({
    where: {
      usuarioId: usuario.id,
      ministerioId,
      papel: "LIDER",
    },
  });

  return !!vinculo;
}

export async function exigirPermissaoMinisterio(
  ministerioId: string
) {
  const permitido =
    await podeAdministrarMinisterio(ministerioId);

  if (!permitido) {
    throw new Error("Sem permissão.");
  }
}
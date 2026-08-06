"use server"

import { redirect } from "next/navigation"
import type { PapelGlobal, PapelMinisterio } from "@prisma/client"
import { prisma } from "@/lib/db/prisma"
import type { ResultadoAction } from "@/lib/types"
import { obterUsuarioAutenticado } from "./session"
import { criarSupabaseServerClient } from "./supabase-server"

type PerfilProprio = {
  usuario: {
    id: string
    nome: string
    email: string
    papelGlobal: PapelGlobal | null
  }
  ministerios: { id: string; nome: string; papel: PapelMinisterio }[]
}

export async function obterPerfilProprio(): Promise<ResultadoAction<PerfilProprio>> {
  const usuarioAutenticado = await obterUsuarioAutenticado()

  if (!usuarioAutenticado) {
    return {
      sucesso: false,
      codigoErro: "NAO_AUTENTICADO",
      mensagem: "Sua sessão expirou ou sua conta está inativa. Faça login novamente.",
    }
  }

  const vinculos = await prisma.usuarioMinisterio.findMany({
    where: { usuarioId: usuarioAutenticado.id },
    include: { ministerio: { select: { id: true, nome: true } } },
  })

  return {
    sucesso: true,
    dados: {
      usuario: {
        id: usuarioAutenticado.id,
        nome: usuarioAutenticado.nome,
        email: usuarioAutenticado.email,
        papelGlobal: usuarioAutenticado.papelGlobal,
      },
      ministerios: vinculos.map((vinculo) => ({
        id: vinculo.ministerio.id,
        nome: vinculo.ministerio.nome,
        papel: vinculo.papel,
      })),
    },
  }
}

export async function sair(): Promise<void> {
  const supabase = await criarSupabaseServerClient()
  await supabase.auth.signOut()
  redirect("/login")
}

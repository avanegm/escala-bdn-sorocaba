import { cache } from "react"
import type { PapelGlobal } from "@prisma/client"
import { prisma } from "@/lib/db/prisma"
import type { VinculoMinisterio } from "@/lib/permissions"
import { criarSupabaseServerClient } from "./supabase-server"

export type UsuarioAutenticado = {
  id: string
  nome: string
  email: string
  papelGlobal: PapelGlobal | null
  ativo: boolean
  vinculosMinisterio: VinculoMinisterio[]
}

// Memoizado por requisição (React cache): várias partes de uma mesma renderização
// podem chamar esta função sem gerar consultas repetidas ao Supabase Auth e ao banco.
export const obterUsuarioAutenticado = cache(async (): Promise<UsuarioAutenticado | null> => {
  const supabase = await criarSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const usuario = await prisma.usuario.findUnique({
    where: { id: user.id },
    include: {
      vinculosMinisterio: {
        select: { ministerioId: true, papel: true },
      },
    },
  })

  if (!usuario || !usuario.ativo) {
    return null
  }

  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    papelGlobal: usuario.papelGlobal,
    ativo: usuario.ativo,
    vinculosMinisterio: usuario.vinculosMinisterio,
  }
})

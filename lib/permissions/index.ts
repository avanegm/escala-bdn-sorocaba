import type { PapelGlobal, PapelMinisterio } from "@prisma/client"

export type VinculoMinisterio = {
  ministerioId: string
  papel: PapelMinisterio
}

export type SessaoUsuario = {
  id: string
  papelGlobal: PapelGlobal | null
  ativo: boolean
  vinculosMinisterio: VinculoMinisterio[]
}

function vinculoNoMinisterio(
  sessao: SessaoUsuario,
  ministerioId: string
): VinculoMinisterio | undefined {
  return sessao.vinculosMinisterio.find((vinculo) => vinculo.ministerioId === ministerioId)
}

export function ehAdmin(sessao: SessaoUsuario): boolean {
  return sessao.ativo && sessao.papelGlobal === "ADMIN"
}

export function ehSecretario(sessao: SessaoUsuario): boolean {
  return sessao.ativo && sessao.papelGlobal === "SECRETARIO"
}

export function ehAdminOuSecretario(sessao: SessaoUsuario): boolean {
  return ehAdmin(sessao) || ehSecretario(sessao)
}

export function ehLiderDoMinisterio(sessao: SessaoUsuario, ministerioId: string): boolean {
  return sessao.ativo && vinculoNoMinisterio(sessao, ministerioId)?.papel === "LIDER"
}

export function ehMembroDoMinisterio(sessao: SessaoUsuario, ministerioId: string): boolean {
  return sessao.ativo && vinculoNoMinisterio(sessao, ministerioId)?.papel === "MEMBRO"
}

export function participaDoMinisterio(sessao: SessaoUsuario, ministerioId: string): boolean {
  return sessao.ativo && vinculoNoMinisterio(sessao, ministerioId) !== undefined
}

// ── Usuários (Rotas/API, seção 2.1) ──────────────────────────────

export function podeListarUsuarios(sessao: SessaoUsuario): boolean {
  return ehAdminOuSecretario(sessao)
}

export function podeCriarOuEditarUsuario(sessao: SessaoUsuario): boolean {
  return ehAdminOuSecretario(sessao)
}

export function podeDefinirPapelGlobal(
  sessao: SessaoUsuario,
  papelAlvo: PapelGlobal | null
): boolean {
  if (papelAlvo === null) {
    return ehAdminOuSecretario(sessao)
  }
  return ehAdmin(sessao)
}

export function podeInativarUsuario(sessao: SessaoUsuario): boolean {
  return ehAdminOuSecretario(sessao)
}

// ── Ministérios (Rotas/API, seção 2.2) ───────────────────────────

export function podeListarMinisterios(sessao: SessaoUsuario): boolean {
  return sessao.ativo
}

export function podeCriarOuEditarMinisterio(sessao: SessaoUsuario): boolean {
  return ehAdminOuSecretario(sessao)
}

export function podeInativarMinisterio(sessao: SessaoUsuario): boolean {
  return ehAdminOuSecretario(sessao)
}

// ── Vínculo Usuário × Ministério (Rotas/API, seção 2.3) ──────────

export function podeAdicionarMembro(
  sessao: SessaoUsuario,
  ministerioId: string,
  papelAlvo: PapelMinisterio
): boolean {
  if (ehAdminOuSecretario(sessao)) {
    return true
  }
  return ehLiderDoMinisterio(sessao, ministerioId) && papelAlvo === "MEMBRO"
}

export function podeRemoverMembro(
  sessao: SessaoUsuario,
  ministerioId: string,
  papelDoAlvo: PapelMinisterio
): boolean {
  if (ehAdminOuSecretario(sessao)) {
    return true
  }
  return ehLiderDoMinisterio(sessao, ministerioId) && papelDoAlvo === "MEMBRO"
}

export function podeListarMembrosMinisterio(sessao: SessaoUsuario, ministerioId: string): boolean {
  return ehAdminOuSecretario(sessao) || participaDoMinisterio(sessao, ministerioId)
}

// ── Cultos (Rotas/API, seção 2.4) ────────────────────────────────

export function podeListarCultosPorMes(sessao: SessaoUsuario): boolean {
  return sessao.ativo
}

export function podeEditarCulto(sessao: SessaoUsuario): boolean {
  return ehAdminOuSecretario(sessao)
}

// ── Escalas (Rotas/API, seção 2.5) ───────────────────────────────

export function podePreencherOuEditarPropriaEscala(
  sessao: SessaoUsuario,
  ministerioId: string
): boolean {
  return participaDoMinisterio(sessao, ministerioId)
}

export function podeEditarEscalaEmNomeDe(sessao: SessaoUsuario): boolean {
  return ehAdminOuSecretario(sessao)
}

export function podeListarEscalaMinisterio(sessao: SessaoUsuario, ministerioId: string): boolean {
  return ehAdminOuSecretario(sessao) || participaDoMinisterio(sessao, ministerioId)
}

// ── Configurações (Rotas/API, seção 2.6) ─────────────────────────

export function podeVerConfiguracoes(sessao: SessaoUsuario): boolean {
  return sessao.ativo
}

export function podeAtualizarConfiguracoes(sessao: SessaoUsuario): boolean {
  return ehAdmin(sessao)
}

// ── Auditoria (Rotas/API, seção 2.7) ─────────────────────────────

export function podeListarAuditoria(sessao: SessaoUsuario): boolean {
  return ehAdminOuSecretario(sessao)
}

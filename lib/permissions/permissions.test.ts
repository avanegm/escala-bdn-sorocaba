import { describe, expect, it } from "vitest"
import {
  podeAdicionarMembro,
  podeAtualizarConfiguracoes,
  podeListarAuditoria,
  podeListarMinisterios,
  type SessaoUsuario,
} from "./index"

function criarSessao(overrides: Partial<SessaoUsuario> = {}): SessaoUsuario {
  return {
    id: "usuario-1",
    papelGlobal: null,
    ativo: true,
    vinculosMinisterio: [],
    ...overrides,
  }
}

describe("podeListarMinisterios (ação de leitura)", () => {
  it("permite Admin", () => {
    expect(podeListarMinisterios(criarSessao({ papelGlobal: "ADMIN" }))).toBe(true)
  })

  it("permite Secretário", () => {
    expect(podeListarMinisterios(criarSessao({ papelGlobal: "SECRETARIO" }))).toBe(true)
  })

  it("permite Líder", () => {
    const sessao = criarSessao({
      vinculosMinisterio: [{ ministerioId: "m1", papel: "LIDER" }],
    })
    expect(podeListarMinisterios(sessao)).toBe(true)
  })

  it("permite Membro", () => {
    const sessao = criarSessao({
      vinculosMinisterio: [{ ministerioId: "m1", papel: "MEMBRO" }],
    })
    expect(podeListarMinisterios(sessao)).toBe(true)
  })

  it("nega usuário inativo", () => {
    expect(podeListarMinisterios(criarSessao({ ativo: false, papelGlobal: "ADMIN" }))).toBe(false)
  })
})

describe("podeAdicionarMembro (ação de escrita)", () => {
  it("permite Admin em qualquer ministério", () => {
    const sessao = criarSessao({ papelGlobal: "ADMIN" })
    expect(podeAdicionarMembro(sessao, "m1", "MEMBRO")).toBe(true)
  })

  it("permite Secretário em qualquer ministério", () => {
    const sessao = criarSessao({ papelGlobal: "SECRETARIO" })
    expect(podeAdicionarMembro(sessao, "m1", "MEMBRO")).toBe(true)
  })

  it("permite Líder do próprio ministério atribuindo papel MEMBRO", () => {
    const sessao = criarSessao({
      vinculosMinisterio: [{ ministerioId: "m1", papel: "LIDER" }],
    })
    expect(podeAdicionarMembro(sessao, "m1", "MEMBRO")).toBe(true)
  })

  it("nega Líder tentando atribuir papel LIDER", () => {
    const sessao = criarSessao({
      vinculosMinisterio: [{ ministerioId: "m1", papel: "LIDER" }],
    })
    expect(podeAdicionarMembro(sessao, "m1", "LIDER")).toBe(false)
  })

  it("nega Líder mexendo em outro ministério", () => {
    const sessao = criarSessao({
      vinculosMinisterio: [{ ministerioId: "m1", papel: "LIDER" }],
    })
    expect(podeAdicionarMembro(sessao, "m2", "MEMBRO")).toBe(false)
  })

  it("nega Membro", () => {
    const sessao = criarSessao({
      vinculosMinisterio: [{ ministerioId: "m1", papel: "MEMBRO" }],
    })
    expect(podeAdicionarMembro(sessao, "m1", "MEMBRO")).toBe(false)
  })
})

describe("podeAtualizarConfiguracoes (ação de escrita restrita)", () => {
  it("permite apenas Admin", () => {
    expect(podeAtualizarConfiguracoes(criarSessao({ papelGlobal: "ADMIN" }))).toBe(true)
  })

  it("nega Secretário", () => {
    expect(podeAtualizarConfiguracoes(criarSessao({ papelGlobal: "SECRETARIO" }))).toBe(false)
  })

  it("nega Líder", () => {
    const sessao = criarSessao({
      vinculosMinisterio: [{ ministerioId: "m1", papel: "LIDER" }],
    })
    expect(podeAtualizarConfiguracoes(sessao)).toBe(false)
  })

  it("nega Membro", () => {
    const sessao = criarSessao({
      vinculosMinisterio: [{ ministerioId: "m1", papel: "MEMBRO" }],
    })
    expect(podeAtualizarConfiguracoes(sessao)).toBe(false)
  })
})

describe("podeListarAuditoria", () => {
  it("permite Admin e Secretário, nega Líder e Membro", () => {
    expect(podeListarAuditoria(criarSessao({ papelGlobal: "ADMIN" }))).toBe(true)
    expect(podeListarAuditoria(criarSessao({ papelGlobal: "SECRETARIO" }))).toBe(true)
    expect(
      podeListarAuditoria(
        criarSessao({ vinculosMinisterio: [{ ministerioId: "m1", papel: "LIDER" }] })
      )
    ).toBe(false)
    expect(
      podeListarAuditoria(
        criarSessao({ vinculosMinisterio: [{ ministerioId: "m1", papel: "MEMBRO" }] })
      )
    ).toBe(false)
  })
})

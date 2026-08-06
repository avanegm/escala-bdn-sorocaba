"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { criarSupabaseBrowserClient } from "@/lib/auth/supabase-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormField } from "@/components/ui/form-field"

const MENSAGEM_LINK_INVALIDO =
  "Este link expirou ou já foi utilizado. Solicite uma nova recuperação de senha."

const esquemaRedefinirSenha = z
  .object({
    senha: z.string().min(8, "A senha precisa ter no mínimo 8 caracteres."),
    confirmarSenha: z.string(),
  })
  .refine((dados) => dados.senha === dados.confirmarSenha, {
    message: "As senhas não coincidem.",
    path: ["confirmarSenha"],
  })

type FormularioRedefinirSenha = z.infer<typeof esquemaRedefinirSenha>

export default function PaginaRedefinirSenha() {
  const router = useRouter()
  const [linkValido, setLinkValido] = useState<boolean | null>(null)
  const [mensagemErro, setMensagemErro] = useState<string | null>(null)
  const [concluido, setConcluido] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormularioRedefinirSenha>({
    resolver: zodResolver(esquemaRedefinirSenha),
  })

  useEffect(() => {
    const supabase = criarSupabaseBrowserClient()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((evento) => {
      if (evento === "PASSWORD_RECOVERY") {
        setLinkValido(true)
      }
    })

    supabase.auth.getSession().then(({ data }) => {
      setLinkValido((atual) => atual ?? data.session !== null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function aoEnviar(dados: FormularioRedefinirSenha) {
    const supabase = criarSupabaseBrowserClient()
    const { error } = await supabase.auth.updateUser({ password: dados.senha })

    if (error) {
      setMensagemErro(MENSAGEM_LINK_INVALIDO)
      return
    }

    setConcluido(true)
    setTimeout(() => router.push("/login"), 2000)
  }

  if (linkValido === false) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <p className="text-sm text-destructive" role="alert">
          {MENSAGEM_LINK_INVALIDO}
        </p>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-md border border-border bg-card p-6 shadow-card">
        <h1 className="mb-6 text-lg font-semibold text-foreground">Redefinir senha</h1>
        {concluido ? (
          <p className="text-sm text-foreground" role="status">
            Senha redefinida com sucesso. Faça login com sua nova senha.
          </p>
        ) : (
          <form onSubmit={handleSubmit(aoEnviar)} noValidate>
            <FormField>
              <Input
                label="Nova senha"
                type="password"
                autoComplete="new-password"
                error={errors.senha?.message}
                {...register("senha")}
              />
              <Input
                label="Confirmar nova senha"
                type="password"
                autoComplete="new-password"
                error={errors.confirmarSenha?.message}
                {...register("confirmarSenha")}
              />
            </FormField>
            {mensagemErro ? (
              <p className="mt-4 text-sm text-destructive" role="alert">
                {mensagemErro}
              </p>
            ) : null}
            <Button type="submit" className="mt-6 w-full" loading={isSubmitting}>
              Redefinir senha
            </Button>
          </form>
        )}
      </div>
    </main>
  )
}

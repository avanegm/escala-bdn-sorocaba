"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Link from "next/link"
import { criarSupabaseBrowserClient } from "@/lib/auth/supabase-client"
import { obterPerfilProprio } from "@/lib/auth/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormField } from "@/components/ui/form-field"

const esquemaLogin = z.object({
  email: z.string().email("Informe um e-mail válido."),
  senha: z.string().min(1, "Informe sua senha."),
})

type FormularioLogin = z.infer<typeof esquemaLogin>

export default function PaginaLogin() {
  const router = useRouter()
  const [mensagemErro, setMensagemErro] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormularioLogin>({
    resolver: zodResolver(esquemaLogin),
  })

  async function aoEnviar(dados: FormularioLogin) {
    setMensagemErro(null)
    const supabase = criarSupabaseBrowserClient()

    const { error } = await supabase.auth.signInWithPassword({
      email: dados.email,
      password: dados.senha,
    })

    if (error) {
      setMensagemErro("E-mail ou senha incorretos.")
      return
    }

    const perfil = await obterPerfilProprio()

    if (!perfil.sucesso) {
      await supabase.auth.signOut()
      setMensagemErro("Sua conta está inativa. Procure a administração da igreja.")
      return
    }

    router.push("/")
    router.refresh()
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-md border border-border bg-card p-6 shadow-card">
        <h1 className="mb-6 text-lg font-semibold text-foreground">
          Escala Bola de Neve Sorocaba
        </h1>
        <form onSubmit={handleSubmit(aoEnviar)} noValidate>
          <FormField>
            <Input
              label="E-mail"
              type="email"
              autoComplete="email"
              error={errors.email?.message}
              {...register("email")}
            />
            <Input
              label="Senha"
              type="password"
              autoComplete="current-password"
              error={errors.senha?.message}
              {...register("senha")}
            />
          </FormField>
          {mensagemErro ? (
            <p className="mt-4 text-sm text-destructive" role="alert">
              {mensagemErro}
            </p>
          ) : null}
          <Button type="submit" className="mt-6 w-full" loading={isSubmitting}>
            Entrar
          </Button>
        </form>
        <Link
          href="/esqueci-senha"
          className="mt-4 block text-center text-sm text-muted-foreground hover:text-foreground"
        >
          Esqueci minha senha
        </Link>
      </div>
    </main>
  )
}

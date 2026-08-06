"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { criarSupabaseBrowserClient } from "@/lib/auth/supabase-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormField } from "@/components/ui/form-field"

const esquemaEsqueciSenha = z.object({
  email: z.string().email("Informe um e-mail válido."),
})

type FormularioEsqueciSenha = z.infer<typeof esquemaEsqueciSenha>

export default function PaginaEsqueciSenha() {
  const [enviado, setEnviado] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormularioEsqueciSenha>({
    resolver: zodResolver(esquemaEsqueciSenha),
  })

  async function aoEnviar(dados: FormularioEsqueciSenha) {
    const supabase = criarSupabaseBrowserClient()

    await supabase.auth.resetPasswordForEmail(dados.email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/redefinir-senha`,
    })

    setEnviado(true)
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-md border border-border bg-card p-6 shadow-card">
        <h1 className="mb-6 text-lg font-semibold text-foreground">Esqueci minha senha</h1>
        {enviado ? (
          <p className="text-sm text-foreground" role="status">
            Se este e-mail estiver cadastrado, você receberá um link para redefinir sua senha.
          </p>
        ) : (
          <form onSubmit={handleSubmit(aoEnviar)} noValidate>
            <FormField>
              <Input
                label="E-mail"
                type="email"
                autoComplete="email"
                error={errors.email?.message}
                {...register("email")}
              />
            </FormField>
            <Button type="submit" className="mt-6 w-full" loading={isSubmitting}>
              Enviar link de recuperação
            </Button>
          </form>
        )}
      </div>
    </main>
  )
}

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { supabaseAnonKey, supabaseUrl } from "./env"
import type { CookieParaDefinir } from "./types";

export async function criarSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesParaDefinir: CookieParaDefinir[]) {
        try {
          cookiesParaDefinir.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        } catch {
          // "setAll" pode ser chamado a partir de um Server Component, onde não é
          // possível escrever cookies. É seguro ignorar: o middleware já mantém
          // a sessão atualizada a cada requisição.
        }
      },
    },
  })
}

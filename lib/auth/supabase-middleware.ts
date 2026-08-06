import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import { supabaseAnonKey, supabaseUrl } from "./env"
import type { CookieParaDefinir } from "./types";

type ResultadoAtualizacaoSessao = {
  response: NextResponse
  usuarioAutenticado: boolean
}

export async function atualizarSessaoSupabase(
  request: NextRequest
): Promise<ResultadoAtualizacaoSessao> {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesParaDefinir: CookieParaDefinir[]) {
        cookiesParaDefinir.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookiesParaDefinir.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        )
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return { response, usuarioAutenticado: user !== null }
}

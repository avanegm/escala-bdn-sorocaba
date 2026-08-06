import { NextResponse, type NextRequest } from "next/server"
import { atualizarSessaoSupabase } from "@/lib/auth/supabase-middleware"

const ROTAS_PUBLICAS = ["/login", "/esqueci-senha", "/redefinir-senha"]

function ehRotaPublica(pathname: string): boolean {
  return ROTAS_PUBLICAS.some((rota) => pathname === rota || pathname.startsWith(`${rota}/`))
}

export async function middleware(request: NextRequest) {
  const { response, usuarioAutenticado } = await atualizarSessaoSupabase(request)
  const { pathname } = request.nextUrl

  if (!usuarioAutenticado && !ehRotaPublica(pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  if (usuarioAutenticado && ehRotaPublica(pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = "/"
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  // Exclui assets estáticos e as rotas públicas por token (confirmação de
  // presença por e-mail e endpoints de cron), que não usam sessão de usuário.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/cron|api/confirmacao).*)"],
}

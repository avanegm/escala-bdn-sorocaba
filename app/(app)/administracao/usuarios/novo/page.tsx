import Link from "next/link";

import { podeAdministracaoGlobal } from "@/lib/auth/permissoes";
import { criarUsuario } from "@/lib/usuarios/actions";

export default async function NovoUsuarioPage() {
    await podeAdministracaoGlobal();

    return (
        <main className="mx-auto w-full max-w-3xl px-6 py-10">
            <div className="mb-8">
                <Link
                    href="/administracao"
                    className="text-sm text-muted-foreground hover:text-primary"
                >
                    ← Voltar para Administração
                </Link>

                <h1 className="mt-4 text-3xl font-semibold">
                    Novo Usuário
                </h1>

                <p className="mt-2 text-muted-foreground">
                    Cadastre um novo usuário no sistema.
                </p>
            </div>

            <div className="rounded-xl border bg-card p-6">
                <form action={criarUsuario} className="space-y-6">
                    <div>
                        <label
                            htmlFor="nome"
                            className="mb-2 block text-sm font-medium"
                        >
                            Nome
                        </label>

                        <input
                            id="nome"
                            name="nome"
                            type="text"
                            required
                            placeholder="Nome completo"
                            className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block text-sm font-medium"
                        >
                            E-mail
                        </label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            placeholder="usuario@exemplo.com"
                            className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="senha"
                            className="mb-2 block text-sm font-medium"
                        >
                            Senha inicial
                        </label>

                        <input
                            id="senha"
                            name="senha"
                            type="password"
                            required
                            minLength={6}
                            placeholder="Mínimo de 6 caracteres"
                            className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="papelGlobal"
                            className="mb-2 block text-sm font-medium"
                        >
                            Papel
                        </label>

                        <select
                            id="papelGlobal"
                            name="papelGlobal"
                            defaultValue="MEMBRO"
                            className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="MEMBRO">Membro</option>
                            <option value="SECRETARIO">
                                Secretário
                            </option>
                            <option value="ADMIN">
                                Administrador
                            </option>
                        </select>
                    </div>

                    <div className="flex items-center justify-end gap-3 border-t pt-6">
                        <Link
                            href="/administracao"
                            className="rounded-lg border px-4 py-2"
                        >
                            Cancelar
                        </Link>

                        <button
                            type="submit"
                            className="rounded-lg bg-primary px-5 py-2 text-white transition hover:opacity-90"
                        >
                            Criar Usuário
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
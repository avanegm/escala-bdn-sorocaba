import Link from "next/link";

import { prisma } from "@/lib/db/prisma";
import { podeAdministracaoGlobal } from "@/lib/auth/permissoes";

export default async function CultosRegularesPage() {
    await podeAdministracaoGlobal();

    const cultosRegulares = await prisma.cultoRegular.findMany({
        orderBy: [
            {
                diaSemana: "asc",
            },
            {
                horario: "asc",
            },
        ],
    });

    return (
        <main className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">
                        Cultos Regulares
                    </h1>

                    <p className="text-muted-foreground">
                        Configure os cultos fixos da igreja.
                    </p>
                </div>

                <Link
                    href="/administracao/cultos-regulares/novo"
                    className="rounded-lg bg-primary px-4 py-2 text-white"
                >
                    Novo Culto Regular
                </Link>
            </div>

            <div className="rounded-xl border bg-card">
                {cultosRegulares.length === 0 ? (
                    <p className="p-8 text-center text-muted-foreground">
                        Nenhum culto regular cadastrado.
                    </p>
                ) : (
                    <div className="divide-y">
                        {cultosRegulares.map((culto) => (
                            <div
                                key={culto.id}
                                className="flex items-center justify-between p-5"
                            >
                                <div>
                                    <h2 className="font-semibold">
                                        {culto.nome}
                                    </h2>

                                    <p className="text-sm text-muted-foreground">
                                        {formatarDiaSemana(culto.diaSemana)} • {culto.horario}
                                    </p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span
                                        className={`rounded px-3 py-1 text-sm ${culto.ativo
                                                ? "bg-green-100 text-green-700"
                                                : "bg-gray-100 text-gray-600"
                                            }`}
                                    >
                                        {culto.ativo ? "Ativo" : "Inativo"}
                                    </span>

                                    <Link
                                        href={`/administracao/cultos-regulares/${culto.id}/editar`}
                                        className="font-medium text-primary hover:underline"
                                    >
                                        Editar
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}

function formatarDiaSemana(dia: string) {
    switch (dia) {
        case "DOMINGO":
            return "Domingo";
        case "SEGUNDA":
            return "Segunda-feira";
        case "TERCA":
            return "Terça-feira";
        case "QUARTA":
            return "Quarta-feira";
        case "QUINTA":
            return "Quinta-feira";
        case "SEXTA":
            return "Sexta-feira";
        case "SABADO":
            return "Sábado";
        default:
            return dia;
    }
}
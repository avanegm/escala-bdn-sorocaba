import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { adicionarMembro } from "@/lib/ministerios/actions";

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export default async function NovoMembroPage({ params }: Props) {
    const { id } = await params;

    const ministerio = await prisma.ministerio.findUnique({
        where: {
            id,
        },
    });

    if (!ministerio) {
        notFound();
    }

    const usuarios = await prisma.usuario.findMany({
        where: {
            ativo: true,
            vinculosMinisterio: {
                none: {
                    ministerioId: id,
                },
            },
        },
        orderBy: {
            nome: "asc",
        },
    });

    return (
        <main className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">
                    Adicionar membro
                </h1>

                <p className="text-muted-foreground">
                    Ministério: {ministerio.nome}
                </p>
            </div>

            <form
                action={adicionarMembro.bind(null, ministerio.id)}
                className="space-y-4 rounded-xl border bg-card p-6"
            >
                <div>
                    <label className="mb-2 block font-medium">
                        Usuário
                    </label>

                    <select
                        name="usuarioId"
                        className="w-full rounded-lg border p-3"
                    >
                        {usuarios.map((usuario) => (
                            <option
                                key={usuario.id}
                                value={usuario.id}
                            >
                                {usuario.nome}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mb-2 block font-medium">
                        Papel
                    </label>

                    <select
                        name="papel"
                        className="w-full rounded-lg border p-3"
                    >
                        <option value="MEMBRO">
                            MEMBRO
                        </option>

                        <option value="LIDER">
                            LÍDER
                        </option>
                    </select>
                </div>

                <button
                    className="rounded-lg bg-primary px-4 py-2 text-white"
                >
                    Adicionar
                </button>
            </form>
        </main>
    );
}
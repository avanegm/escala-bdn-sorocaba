import Link from "next/link";

const itens = [
  {
    nome: "Dashboard",
    href: "#",
  },
  {
    nome: "Ministérios",
    href: "#",
  },
  {
    nome: "Escalas",
    href: "#",
  },
  {
    nome: "Administração",
    href: "#",
  },
  {
    nome: "Perfil",
    href: "#",
  },
];

export function Sidebar() {
  return (
    <aside className="w-64 border-r bg-card">
      <nav className="flex flex-col gap-1 p-4">
        {itens.map((item) => (
          <Link
            key={item.nome}
            href={item.href}
            className="rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
          >
            {item.nome}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
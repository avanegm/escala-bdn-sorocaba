"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  UserCircle,
  Users,
} from "lucide-react";

const itens = [
  {
    nome: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    nome: "Ministérios",
    href: "/ministerios",
    icon: Users,
  },
  {
    nome: "Escalas",
    href: "/escalas",
    icon: CalendarDays,
  },
  {
    nome: "Administração",
    href: "/administracao",
    icon: ShieldCheck,
  },
  {
    nome: "Meu Perfil",
    href: "/perfil",
    icon: UserCircle,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col border-r bg-card">
      <div className="border-b p-6">
        <h2 className="text-xl font-bold text-primary">🕊 Escala BDN</h2>
        <p className="text-sm text-muted-foreground">Sorocaba</p>
      </div>

      <nav className="flex flex-1 flex-col gap-2 p-4">
        {itens.map((item) => {
          const Icon = item.icon;

          const ativo = pathname === item.href;

          return (
            <Link
              key={item.nome}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                ativo
                  ? "bg-primary text-white"
                  : "hover:bg-accent/20"
              }`}
            >
              <Icon size={20} />
              <span>{item.nome}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4">
        <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors hover:bg-accent/20">
          <LogOut size={20} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}
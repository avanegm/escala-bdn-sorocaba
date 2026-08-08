"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { sair } from "@/lib/auth/actions";
import {
  CalendarDays,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  UserCircle,
  Users,
} from "lucide-react";

type SidebarProps = {
  papelGlobal: "ADMIN" | "SECRETARIO" | null;
};

export function Sidebar({ papelGlobal }: SidebarProps) {
  const pathname = usePathname();

  const administrador =
    papelGlobal === "ADMIN" ||
    papelGlobal === "SECRETARIO";

  const itens = [
    {
      nome: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
  ];

  if (administrador) {
    itens.push(
      {
        nome: "Ministérios",
        href: "/ministerios",
        icon: Users,
      },
      {
        nome: "Cultos",
        href: "/cultos",
        icon: CalendarDays,
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
      }
    );
  } else {
    itens.push({
      nome: "Próximos Cultos",
      href: "/cultos",
      icon: CalendarDays,
    });
  }

  itens.push({
    nome: "Meu Perfil",
    href: "/perfil",
    icon: UserCircle,
  });

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-background">
      <div className="border-b p-6">
        <h1 className="text-3xl font-bold">
          🕊 Escala BDN
        </h1>

        <p className="text-muted-foreground">
          Sorocaba
        </p>
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
        <form action={sair}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors hover:bg-accent/20"
          >
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
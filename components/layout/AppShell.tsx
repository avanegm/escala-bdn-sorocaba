import { ReactNode } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { PageContainer } from "./PageContainer";
import { obterUsuarioAutenticado } from "@/lib/auth/session";

type AppShellProps = {
  children: ReactNode;
};

export async function AppShell({ children }: AppShellProps) {
  const usuario = await obterUsuarioAutenticado();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <div className="flex flex-1">
        <Sidebar papelGlobal={usuario?.papelGlobal ?? null} />

        <PageContainer>{children}</PageContainer>
      </div>
    </div>
  );
}
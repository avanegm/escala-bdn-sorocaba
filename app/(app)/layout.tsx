import { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";

type LayoutProps = {
  children: ReactNode;
};

export default function AppLayout({ children }: LayoutProps) {
  return <AppShell>{children}</AppShell>;
}
import * as React from "react"
import { cn } from "@/lib/utils"

export type FormFieldProps = {
  children: React.ReactNode
  className?: string
}

// Espaçamento padrão entre campos de um mesmo formulário — não confundir com o
// layout interno de um campo (label + controle + erro), que cada componente de
// campo (Input, Select, etc.) já resolve sozinho.
export function FormField({ children, className }: FormFieldProps) {
  return <div className={cn("flex flex-col gap-4", className)}>{children}</div>
}

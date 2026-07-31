import type { Metadata } from "next"
import { Manrope } from "next/font/google"
import "./globals.css"

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
})

export const metadata: Metadata = {
  title: "Escala Bola de Neve Sorocaba",
  description:
    "Sistema de gerenciamento de escalas dos ministérios da Igreja Bola de Neve Sorocaba.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={manrope.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}

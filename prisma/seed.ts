import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  await prisma.configuracaoSistema.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      diasAntecedenciaAberturaProximoMes: 7,
      horasAntecedenciaLembretePresenca: 24,
    },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (erro) => {
    console.error(erro)
    await prisma.$disconnect()
    process.exit(1)
  })

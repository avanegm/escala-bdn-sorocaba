"use server";

import { DiaSemana } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/db/prisma";
import { podeAdministracaoGlobal } from "@/lib/auth/permissoes";

export async function criarCultoRegular(
  formData: FormData
) {
  await podeAdministracaoGlobal();

  const nome =
    formData.get("nome")?.toString().trim();

  const diaSemana =
    formData.get("diaSemana")?.toString();

  const horario =
    formData.get("horario")?.toString();

  if (!nome || !diaSemana || !horario) {
    throw new Error(
      "Preencha todos os campos obrigatórios."
    );
  }

  const diasValidos = Object.values(DiaSemana);

  if (
    !diasValidos.includes(
      diaSemana as DiaSemana
    )
  ) {
    throw new Error(
      "Dia da semana inválido."
    );
  }

  await prisma.cultoRegular.create({
    data: {
      nome,
      diaSemana: diaSemana as DiaSemana,
      horario,
    },
  });

  revalidatePath(
    "/administracao/cultos-regulares"
  );

  redirect(
    "/administracao/cultos-regulares"
  );
}
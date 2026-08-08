"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { PapelGlobal } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";
import { podeAdministracaoGlobal } from "@/lib/auth/permissoes";

export async function criarUsuario(formData: FormData) {
  await podeAdministracaoGlobal();

  const nome = formData.get("nome")?.toString().trim();
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const senha = formData.get("senha")?.toString();
  const papelGlobal = formData.get("papelGlobal")?.toString();

  if (!nome || !email || !senha || !papelGlobal) {
    throw new Error("Preencha todos os campos obrigatórios.");
  }

  if (senha.length < 6) {
    throw new Error("A senha deve ter pelo menos 6 caracteres.");
  }

  if (
    papelGlobal !== "MEMBRO" &&
    papelGlobal !== "SECRETARIO" &&
    papelGlobal !== "ADMIN"
  ) {
    throw new Error("Papel global inválido.");
  }

  const usuarioExistente = await prisma.usuario.findUnique({
    where: {
      email,
    },
  });

  if (usuarioExistente) {
    throw new Error("Já existe um usuário com este e-mail.");
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  const { data, error } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password: senha,
      email_confirm: true,
    });

  if (error || !data.user) {
    throw new Error(
      error?.message ||
        "Não foi possível criar o usuário no Supabase."
    );
  }

  try {
    const papel =
      papelGlobal === "MEMBRO"
        ? null
        : (papelGlobal as PapelGlobal);

    await prisma.usuario.create({
      data: {
        id: data.user.id,
        nome,
        email,
        papelGlobal: papel,
      },
    });
  } catch (erro) {
    await supabaseAdmin.auth.admin.deleteUser(data.user.id);

    console.error(
      "Erro ao criar usuário no Prisma:",
      erro
    );

    throw new Error(
      "O usuário foi criado no Auth, mas não pôde ser criado no banco."
    );
  }

  revalidatePath("/administracao");

  redirect("/administracao");
}
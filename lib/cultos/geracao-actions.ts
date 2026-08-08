"use server";

import { podeAdministracaoGlobal } from "@/lib/auth/permissoes";
import { gerarCultosDoMes } from "./gerador";

export async function gerarCultosAction(
  formData: FormData
) {
  await podeAdministracaoGlobal();

  const ano = Number(
    formData.get("ano")
  );

  const mes = Number(
    formData.get("mes")
  );

  return gerarCultosDoMes(
    ano,
    mes
  );
}
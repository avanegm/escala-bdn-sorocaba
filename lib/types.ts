// Convenção de retorno única para todas as Server Actions do sistema,
// conforme o documento de Rotas/API, seção 1. Toda Server Action futura
// (não apenas as de autenticação) deve reutilizar este tipo.
export type ResultadoAction<T> =
  | { sucesso: true; dados: T }
  | { sucesso: false; codigoErro: string; mensagem: string }

import type { CookieOptions } from "@supabase/ssr";

export type CookieParaDefinir = {
  name: string;
  value: string;
  options: CookieOptions;
};
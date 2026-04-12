import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeImagePath(path: string): string {
  return path
    .normalize("NFD") // remove acentos
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['"`]/g, "") // remove aspas
    .replace(/\s+/g, "-") // espaços -> hífen
    .replace(/[^a-zA-Z0-9\-._/]/g, "") // remove caracteres inválidos
    .replace(/-+/g, "-") // evita múltiplos hífens
    .toLowerCase()
}

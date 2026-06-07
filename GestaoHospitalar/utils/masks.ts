/**
 * Utilitários de máscara para formatação consistente de campos.
 * Aplica formatação em tempo real conforme o usuário digita.
 */

/**
 * Máscara de CPF: 000.000.000-00
 */
export function maskCPF(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

/**
 * Máscara de Telefone: (00) 00000-0000 ou (00) 0000-0000
 */
export function maskTelefone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 10) {
    // Fixo: (00) 0000-0000
    return digits
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }
  // Celular: (00) 00000-0000
  return digits
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

/**
 * Máscara de Data de Nascimento: DD/MM/AAAA
 */
export function maskDataNascimento(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  return digits
    .replace(/(\d{2})(\d)/, "$1/$2")
    .replace(/(\d{2})(\d)/, "$1/$2");
}

/**
 * Converte data no formato DD/MM/AAAA para AAAA-MM-DD (ISO)
 */
export function dataNascimentoToISO(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length !== 8) return value;
  const dia = digits.slice(0, 2);
  const mes = digits.slice(2, 4);
  const ano = digits.slice(4, 8);
  return `${ano}-${mes}-${dia}`;
}

/**
 * Converte data no formato AAAA-MM-DD (ISO) para DD/MM/AAAA
 */
export function dataISOToDisplay(value: string): string {
  if (!value || value.length !== 10) return value || "";
  const [ano, mes, dia] = value.split("-");
  return `${dia}/${mes}/${ano}`;
}

/**
 * Remove formatação e retorna apenas dígitos
 */
export function unmask(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * Valida CPF (apenas verifica quantidade de dígitos)
 */
export function isCPFValid(value: string): boolean {
  return unmask(value).length === 11;
}

/**
 * Valida Telefone (10 ou 11 dígitos)
 */
export function isTelefoneValid(value: string): boolean {
  const digits = unmask(value).length;
  return digits === 10 || digits === 11;
}

/**
 * Valida Data de Nascimento (formato e valores básicos)
 */
export function isDataNascimentoValid(value: string): boolean {
  const digits = unmask(value);
  if (digits.length !== 8) return false;
  const dia = parseInt(digits.slice(0, 2), 10);
  const mes = parseInt(digits.slice(2, 4), 10);
  const ano = parseInt(digits.slice(4, 8), 10);
  if (mes < 1 || mes > 12) return false;
  if (dia < 1 || dia > 31) return false;
  if (ano < 1900 || ano > new Date().getFullYear()) return false;
  return true;
}

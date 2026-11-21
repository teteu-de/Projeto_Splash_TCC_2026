/** Centraliza os registros técnicos sem expor tokens ou dados pessoais.
 * Em desenvolvimento, os detalhes ajudam a diagnosticar falhas.
 * Em produção, apenas avisos e erros são registrados.
 */
export class Logger {
  private static readonly isDevelopment = import.meta.env.DEV;

  /** Registra uma etapa informativa durante o desenvolvimento. */
  static info(message: string, details?: unknown): void {
    if (this.isDevelopment) console.info(`[Splash] ${message}`, details ?? "");
  }

  /** Registra avisos que merecem atenção técnica. */
  static warn(message: string, details?: unknown): void {
    console.warn(`[Splash] ${message}`, details ?? "");
  }

  /** Registra erros técnicos sem substituir mensagens amigáveis da interface. */
  static error(message: string, details?: unknown): void {
    console.error(`[Splash] ${message}`, details ?? "");
  }
}

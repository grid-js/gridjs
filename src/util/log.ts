/**
 * Centralized logging lib
 *
 * This class needs some improvements but so far it has been used to have a coherent way to log
 */
class Logger {
  private format(message: string, type: string): string {
    return `[Grid.js] [${type.toUpperCase()}]: ${message}`;
  }

  error(message: string, throwException = false): void {
    const msg = this.format(message, 'error');

    if (throwException) {
      throw Error(msg);
    } else {
      console.error(msg);
    }
  }

  warn(message: string): void {
    console.warn(this.format(message, 'warn'));
  }

  info(message: string): void {
    console.info(this.format(message, 'info'));
  }
}

export default new Logger();

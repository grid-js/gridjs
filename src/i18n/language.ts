import enUS from './en_US';
type MessageFormat = (...args) => string;
type Message = string | MessageFormat;
export type Language = { [key: string]: Message | Language };

export class Translator {
  private readonly _language: Language;
  private readonly _defaultLanguage: Language;

  constructor(language?: Language) {
    this._language = language;
    this._defaultLanguage = enUS;
  }

  /**
   * Tries to split the message with "." and find
   * the key in the given language
   *
   * @param message
   * @param lang
   */
  getString(message: string, lang: Language): MessageFormat {
    if (!lang || !message) return null;

    const splitted = message.split('.');
    const key = splitted[0];

    if (lang[key]) {
      const val = lang[key];

      if (typeof val === 'string') {
        return (): string => val;
      } else if (typeof val === 'function') {
        return val;
      } else {
        return this.getString(splitted.slice(1).join('.'), val);
      }
    }

    return null;
  }

  translate(message: string, ...args): string {
    const translated = this.getString(message, this._language);
    let messageFormat;

    if (translated) {
      messageFormat = translated;
    } else {
      messageFormat = this.getString(message, this._defaultLanguage);
    }

    if (messageFormat) {
      return messageFormat(...args);
    }

    return message;
  }
}

export function useTranslator(translator: Translator) {
  return function (message: string, ...args): string {
    return translator.translate(message, ...args);
  };
}

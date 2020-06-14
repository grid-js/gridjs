import enUS from './en_US';
export type Language = { [key: string]: string | Language };

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
  getString(message: string, lang: Language): string {
    if (!lang || !message) return null;

    const splitted = message.split('.');
    const key = splitted[0];

    if (lang[key]) {
      const val = lang[key];

      if (typeof val === 'string') {
        return val;
      } else {
        return this.getString(splitted.slice(1).join('.'), val);
      }
    }

    return null;
  }

  translate(message: string): string {
    const translated = this.getString(message, this._language);

    if (translated) {
      return String(translated);
    }

    return this.getString(message, this._defaultLanguage);
  }
}

export function useTranslator(translator: Translator) {
  return function (message: string): string {
    return translator.translate(message);
  };
}

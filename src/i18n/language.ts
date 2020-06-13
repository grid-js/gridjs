export type LanguageName = string;
export type Language = Map<string, string | Language>;
export type Languages = Map<LanguageName, Language>;

export class Translator {
  private readonly _default: LanguageName;
  private _current: LanguageName;
  private _languages: Languages;

  constructor(languages: Languages, defaultLanguage: LanguageName = 'en_US') {
    this._languages = languages;
    this._default = defaultLanguage;
  }

  get current(): LanguageName {
    return this._current;
  }

  set current(name) {
    this._current = name;
  }

  getLanguage(name: LanguageName): Language {
    if (this._languages.has(name)) {
      return this._languages.get(name);
    }

    const mainLang = name.split('_')[0];
    if (this._languages.has(mainLang)) {
      return this._languages.get(mainLang);
    }

    return this._languages.get(this._default);
  }

  /**
   * Tries to split the message with "." and find
   * the key in the given language
   *
   * @param message
   * @param lang
   */
  getString(message: string, lang: Language): string {
    for (const part of message.split('.')) {
      if (lang.has(part)) {
        const val = lang.get(part);
        if (typeof val === 'string') {
          return val;
        } else {
          return this.getString(message, val);
        }
      } else {
        return null;
      }
    }

    return null;
  }

  translate(message: string): string {
    const lang = this.getLanguage(this._current);
    const defaultLang = this.getLanguage(this._default);
    const translated = this.getString(message, lang);

    if (translated) {
      return String(translated);
    }

    return this.getString(message, defaultLang);
  }
}

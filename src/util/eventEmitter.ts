export interface EventEmitter {
  on(event: string, listener: (...args: any[]) => void): this;
  off(event: string, listener: (...args: any[]) => void): this;
  emit(event: string, ...args: any[]): boolean;
}

export class EventEmitter {
  public callbacks: { [event: string]: ((...args: any[]) => void)[] };

  // because we are using EventEmitter as a mixin and the
  // constructor won't be called by the applyMixins function
  // see src/base.ts and src/util/applyMixin.ts
  private init(event?: string): void {
    if (!this.callbacks) {
      this.callbacks = {}
    }

    if (event && !this.callbacks[event]) {
      this.callbacks[event] = [];
    }
  }

  on(event: string, listener: (...args: any[]) => void): this {
    this.init(event);

    this.callbacks[event].push(listener);
    return this;
  }

  off(event: string, listener: (...args: any[]) => void): this {
    this.init();

    if (!this.callbacks[event] || this.callbacks[event].length === 0) {
      // there is no callbacks with this key
      return this;
    }

    this.callbacks[event] = this.callbacks[event].filter(value => value != listener);

    return this;
  }

  emit(event: string, ...args: any[]): boolean {
    this.init(event);

    if (this.callbacks[event].length > 0) {
      this.callbacks[event].forEach(value => value(...args));
      return true;
    }

    return false;
  }
}

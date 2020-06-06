type EventArgs<T> = [T] extends [(...args: infer U) => any]
  ? U
  : [T] extends [void]
  ? []
  : [T];

/**
 * Example:
 *
 * export interface BaseEvents<P, S> {
 *   SET_STATE: (component: BaseComponent<P, S>, state: S) => void;
 * }
 */

export interface EventEmitter<EventTypes> {
  addListener<EventName extends keyof EventTypes>(
    event: EventName,
    listener: (...args: EventArgs<EventTypes[EventName]>) => void,
  ): EventEmitter<EventTypes>;

  on<EventName extends keyof EventTypes>(
    event: EventName,
    listener: (...args: EventArgs<EventTypes[EventName]>) => void,
  ): EventEmitter<EventTypes>;

  off<EventName extends keyof EventTypes>(
    event: EventName,
    listener: (...args: EventArgs<EventTypes[EventName]>) => void,
  ): EventEmitter<EventTypes>;

  emit<EventName extends keyof EventTypes>(
    event: EventName,
    ...args: EventArgs<EventTypes[EventName]>
  ): boolean;
}

export class EventEmitter<EventTypes> {
  private callbacks: { [event: string]: ((...args) => void)[] };

  // because we are using EventEmitter as a mixin and the
  // constructor won't be called by the applyMixins function
  // see src/base.ts and src/util/applyMixin.ts
  private init(event?: string): void {
    if (!this.callbacks) {
      this.callbacks = {};
    }

    if (event && !this.callbacks[event]) {
      this.callbacks[event] = [];
    }
  }

  on<EventName extends keyof EventTypes>(
    event: EventName,
    listener: (...args: EventArgs<EventTypes[EventName]>) => void,
  ): EventEmitter<EventTypes> {
    this.init(event as string);
    this.callbacks[event as string].push(listener);
    return this;
  }

  off<EventName extends keyof EventTypes>(
    event: EventName,
    listener: (...args: EventArgs<EventTypes[EventName]>) => void,
  ): EventEmitter<EventTypes> {
    const eventName = event as string;

    this.init();

    if (!this.callbacks[eventName] || this.callbacks[eventName].length === 0) {
      // there is no callbacks with this key
      return this;
    }

    this.callbacks[eventName] = this.callbacks[eventName].filter(
      (value) => value != listener,
    );

    return this;
  }

  emit<EventName extends keyof EventTypes>(
    event: EventName,
    ...args: EventArgs<EventTypes[EventName]>
  ): boolean {
    const eventName = event as string;

    this.init(eventName);

    if (this.callbacks[eventName].length > 0) {
      this.callbacks[eventName].forEach((value) => value(...args));
      return true;
    }

    return false;
  }
}

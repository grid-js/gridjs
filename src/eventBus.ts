import { BaseEvents } from './view/base';
import { EventEmitter } from './util/eventEmitter';

// BusEvents type is used to merge all typed Event interfaces
type BusEvents = BaseEvents<any, any>;

export class EventBus extends EventEmitter<BusEvents> {}

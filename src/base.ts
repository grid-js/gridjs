import { generateID, ID } from './util/id';
import { EventEmitter } from './util/eventEmitter';
import applyMixins from './util/applyMixin';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Base extends EventEmitter<any> {}

class Base {
  private readonly _id: ID;

  constructor(id?: ID) {
    this._id = id || generateID();
  }

  get id(): ID {
    return this._id;
  }
}

applyMixins(Base, [EventEmitter]);

export default Base;

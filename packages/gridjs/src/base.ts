import { generateUUID, ID } from './util/id';

class Base {
  private readonly _id: ID;

  constructor(id?: ID) {
    this._id = id || generateUUID();
  }

  get id(): ID {
    return this._id;
  }
}

export default Base;

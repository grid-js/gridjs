import {generateID, ID} from "./util/id";


class Base {
  private _id: ID;

  constructor() {
    this.setID();
  }

  private setID(): void {
    this._id = generateID();
  }

  public get id(): ID {
    return this._id;
  }

}

export default Base;

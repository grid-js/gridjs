import Storage from './storage';

class ServerStorage extends Storage {
  private url: string;
  // fetch() opts
  private opts: any[];
  private readonly then: ((data: any) => any[][] | PromiseLike<any[][]>) | null;

  constructor(
    url: string,
    then?: (data: any) => any[][] | PromiseLike<any[][]>,
    ...opts
  ) {
    super();

    this.url = url;
    this.then = then || (value => value);
    this.opts = opts || [];
  }

  public get(): Promise<any[][]> {
    return fetch(this.url, ...this.opts)
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw Error(
            `Could not fetch data: ${res.status} - ${res.statusText}`,
          );
        }
      })
      .then(this.then);
  }

  public get length(): Promise<number> {
    return this.get().then(v => v.length);
  }
}

export default ServerStorage;

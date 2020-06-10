import Storage from './storage';
import log from '../util/log';

export interface ServerStorageOptions {
  url: string;
  method?: string;
  headers?: HeadersInit;
  body?: BodyInit;
  then?: (data: any) => any[][] | PromiseLike<any[][]>;
  total?: (data: any) => Promise<number>;
}

class ServerStorage extends Storage<ServerStorageOptions, any[][]> {
  private readonly options: ServerStorageOptions;

  constructor(options: ServerStorageOptions) {
    super();
    this.options = options;
  }

  public get(options?: ServerStorageOptions): Promise<any[][]> {
    // this.options is the initial config object
    // options is the runtime config passed by the pipeline (e.g. search component)
    const opts = {
      ...this.options,
      ...options,
    };

    return fetch(opts.url, opts)
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          log.error(
            `Could not fetch data: ${res.status} - ${res.statusText}`,
            true,
          );
          return null;
        }
      })
      .then(opts.then);
  }

  public total(data: any): Promise<number> {
    if (typeof this.options.total === 'function') {
      return this.options.total(data);
    }

    log.error(`total method is not implemented for ${this}`);
    return null;
  }
}

export default ServerStorage;

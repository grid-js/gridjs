import Storage, { StorageResponse } from './storage';
import log from '../util/log';

export interface ServerStorageOptions {
  url: string;
  method?: string;
  headers?: HeadersInit;
  body?: BodyInit;
  then?: (data: any) => any[][];
  total?: (data: any) => number;
}

class ServerStorage extends Storage<ServerStorageOptions> {
  private readonly options: ServerStorageOptions;

  constructor(options: ServerStorageOptions) {
    super();
    this.options = options;
  }

  public get(options?: ServerStorageOptions): Promise<StorageResponse> {
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
      .then((res) => {
        return {
          data: opts.then(res),
          total: typeof opts.total === 'function' ? opts.total(res) : undefined,
        };
      });
  }
}

export default ServerStorage;

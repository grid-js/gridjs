import Storage, { StorageResponse } from './storage';
import log from '../util/log';

export interface ServerStorageOptions extends RequestInit {
  url: string;
  // to format the data and columns
  then?: (data: any) => any[][];
  // to handle the response from the server. `handle` will
  // be called first and then `then` callback will be invoked
  // The purpose of this function is to handle the behaviour
  // of server and either reject and resolve the initial response
  // before calling the `then` function
  handle?: (response: Response) => Promise<any>;
  total?: (data: any) => number;
  // to bypass the current implementation of ServerStorage and process the
  // request manually (e.g. when user wants to connect their own SDK/HTTP Client)
  data?: (opts: ServerStorageOptions) => Promise<StorageResponse>;
}

class ServerStorage extends Storage<ServerStorageOptions> {
  private readonly options: ServerStorageOptions;

  constructor(options: ServerStorageOptions) {
    super();
    this.options = options;
  }

  private handler(response: Response): Promise<any> {
    if (typeof this.options.handle === 'function') {
      return this.options.handle(response);
    }

    if (response.ok) {
      return response.json();
    } else {
      log.error(
        `Could not fetch data: ${response.status} - ${response.statusText}`,
        true,
      );
      return null;
    }
  }

  public get(options?: ServerStorageOptions): Promise<StorageResponse> {
    // this.options is the initial config object
    // options is the runtime config passed by the pipeline (e.g. search component)
    const opts = {
      ...this.options,
      ...options,
    };

    // if `options.data` is provided, the current ServerStorage
    // implementation will be ignored and we let options.data to
    // handle the request. Useful when HTTP client needs to be
    // replaced with something else
    if (typeof opts.data === 'function') {
      return opts.data(opts);
    }

    return fetch(opts.url, opts)
      .then(this.handler.bind(this))
      .then((res) => {
        return {
          data: opts.then(res),
          total: typeof opts.total === 'function' ? opts.total(res) : undefined,
        };
      });
  }
}

export default ServerStorage;

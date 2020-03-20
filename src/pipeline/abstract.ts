import Config from "../config";
import Storage from "../storage/storage";

abstract class PipelineAbstract<T> {
  abstract new(config: Config, ...args): Promise<Storage<T>>;
}

export default PipelineAbstract;

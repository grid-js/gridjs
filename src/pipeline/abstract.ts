abstract class PipelineAbstract {
  abstract execute(...args): Promise<any>;
}

export default PipelineAbstract;

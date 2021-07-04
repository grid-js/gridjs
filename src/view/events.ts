import Tabular from '../tabular';
import { Config } from '../config';

export interface ContainerEvents {
  beforeLoad: () => void;
  load: (data: Tabular) => void;
  ready: () => void;
  forceRender: (config: Config) => void;
}

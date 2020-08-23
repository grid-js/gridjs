import Tabular from '../tabular';

export interface ContainerEvents {
  beforeLoad: () => void;
  load: (data: Tabular) => void;
  ready: () => void;
}

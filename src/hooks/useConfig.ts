import { useContext } from 'preact/hooks';
import { Config, ConfigContext } from '../config';

export function useConfig(): Config {
  return useContext(ConfigContext);
}

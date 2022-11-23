import { useContext } from 'preact/hooks';
import { ConfigContext } from '../config';

export function useConfig() {
  return useContext(ConfigContext)
}

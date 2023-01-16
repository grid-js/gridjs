import { useConfig } from './useConfig';

export function useStore() {
  const config = useConfig();
  return config.store;
}

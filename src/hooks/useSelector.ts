import { useEffect, useState } from 'preact/hooks';
import { useConfig } from './useConfig';

export default function useSelector<T>(selector: (state) => T) {
  const config = useConfig();
  const store = config.store;
  const [current, setCurrent] = useState(selector(store.getState()));

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const updated = selector(store.getState());

      if (current !== updated) {
        setCurrent(updated);
      }
    });

    return unsubscribe;
  }, []);

  return current;
}

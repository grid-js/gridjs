import { useEffect, useState } from 'preact/hooks';
import { useStore } from './useStore';

export default function useSelector<T>(selector: (state) => T) {
  const store = useStore();
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

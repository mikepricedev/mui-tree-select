import { useEffect, useState } from "react";
const usePromise = (promise) => {
  var _a;
  const [[results, errors], setState] = useState([new Map(), new Map()]);
  useEffect(() => {
    let cancelled = false;
    const isPromise = promise instanceof Promise;
    if (isPromise) {
      (async () => {
        try {
          const result = await promise;
          if (cancelled) {
            return;
          }
          setState(([results, errors]) => {
            results.set(promise, result);
            return [results, errors];
          });
        } catch (error) {
          if (cancelled) {
            return;
          }
          setState(([results, errors]) => {
            errors.set(promise, error);
            return [results, errors];
          });
        }
      })();
    }
    return () => {
      cancelled = true;
      if (isPromise) {
        results.delete(promise);
        errors.delete(promise);
      }
    };
  }, [errors, promise, results]);
  if (promise instanceof Promise) {
    return {
      loading: !results.has(promise) && !errors.has(promise),
      error: (_a = errors.get(promise)) !== null && _a !== void 0 ? _a : null,
      data: results.get(promise),
    };
  } else {
    return {
      loading: false,
      error: null,
      data: promise,
    };
  }
};
export default usePromise;

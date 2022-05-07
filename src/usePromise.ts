import { useEffect, useState } from "react";

const usePromise = <Result = unknown, ErrorType = Error>(
  promise: Promise<Result> | Result
): {
  loading: boolean;
  error: ErrorType | null;
  data: Result | undefined;
} => {
  const [[results, errors], setState] = useState([
    new Map<Promise<Result>, Result>(),
    new Map<Promise<Result>, ErrorType>(),
  ]);

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
            errors.set(promise, error as ErrorType);
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
      error: errors.get(promise) ?? null,
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

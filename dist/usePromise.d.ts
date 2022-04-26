declare const usePromise: <Result = unknown, ErrorType = Error>(
  promise: Result | Promise<Result>,
  onError?: ((error: ErrorType) => void) | undefined
) => {
  loading: boolean;
  error: ErrorType | null;
  data: Result | undefined;
};
export default usePromise;

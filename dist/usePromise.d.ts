declare const usePromise: <Result = unknown, ErrorType = Error>(
  promise: Result | Promise<Result>
) => {
  loading: boolean;
  error: ErrorType | null;
  data: Result | undefined;
};
export default usePromise;

import * as React from 'react';

type AsyncCallback<T> = (abortSignal: AbortSignal) => Promise<T>;
type AsyncResult<T> = [loading: true, error: undefined, result: undefined] | [loading: false, error: Error, result: undefined] | [loading: false, error: undefined, result: T];
type RiskyAsyncResult<T> = [loading: true, result: undefined] | [loading: false, result: T];

export function useAsync<T>(effect: AsyncCallback<T>, deps: React.DependencyList = []): AsyncResult<T> {
  const [state, setState] = React.useState<AsyncResult<T>>([true, undefined, undefined]);
  React.useEffect(() => {
    setState([true, undefined, undefined]);
    const abortController = new AbortController();
    let aborted = false;
    effect(abortController.signal)
      .then((result) => {
        setState([false, undefined, result]);
      })
      .catch((err) => {
        if (aborted) return;
        setState([false, err, undefined]);
      });
    return () => {
      aborted = true;
      abortController.abort();
    };
  }, deps);
  return state;
}

export function useRiskyAsync<T>(effect: AsyncCallback<T>, deps: React.DependencyList = []): RiskyAsyncResult<T> {
  const [loading, error, result] = useAsync(effect, deps);
  if (error) throw error;
  return [loading, result] as RiskyAsyncResult<T>;
}

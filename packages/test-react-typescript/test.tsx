import React from 'react';
import { useImmer } from 'use-immer';

interface State {
  value: string;
  count: number;
}

export function Test() {
  const [state, update] = useImmer<State>({
    value: '',
    count: 0,
  });
  return (
    <div>
      <input
        onChange={(e) =>
          update((draft) => {
            draft.value = e.target.value;
          })
        }
        type="text"
        value={state.value}
      />
      <button
        onClick={() => {
          update((draft) => {
            draft.count++;
          });
        }}
        type="button"
      >
        type attribute should be required {state.count}
      </button>
    </div>
  );
}

import React from 'react';

export function Test() {
  const [value, setValue] = React.useState('');
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    // linter should enforce `value` in hook dependencies
    console.log(value);
  });
  return (
    <div>
      <input onChange={(e) => setValue(e.target.value)} type="text" value={value} />
      <button onClick={() => setCount(count + 1)} type="button">
        type attribute should be required {count}
      </button>
    </div>
  );
}

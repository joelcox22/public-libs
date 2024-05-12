import { expect, test } from 'vitest';
import * as React from 'react';
import { Test } from './example.js';

test('snapshot', () => {
  expect(<Test />).toMatchSnapshot();
});

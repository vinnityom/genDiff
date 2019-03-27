import fs from 'fs';
import genDiff from '../src';

test('should get diff right', () => {
  const expected = fs.readFileSync('__tests__/__fixtures__/expectedResult', 'utf-8');
  expect(genDiff('__tests__/__fixtures__/before.json', '__tests__/__fixtures__/after.json')).toBe(expected);
});

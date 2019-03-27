import fs from 'fs';
import genDiff from '../src';

describe('sould get diff right', () => {
  const expected = fs.readFileSync('__tests__/__fixtures__/expectedResult', 'utf-8');

  test('JSON', () => {
    expect(genDiff('__tests__/__fixtures__/JSON/before.json', '__tests__/__fixtures__/JSON/after.json')).toBe(expected);
  });

  test('yaml', () => {
    expect(genDiff('__tests__/__fixtures__/yaml/before.yml', '__tests__/__fixtures__/yaml/after.yml')).toBe(expected);
  });
});

import fs from 'fs';
import genDiff from '../src';

describe('sould get diff right', () => {
  const expected = fs.readFileSync('__tests__/__fixtures__/expectedResult', 'utf-8');

  test.each([
    ['JSON', '__tests__/__fixtures__/JSON/before.json', '__tests__/__fixtures__/JSON/after.json', expected],
    ['yaml', '__tests__/__fixtures__/yaml/before.yml', '__tests__/__fixtures__/yaml/after.yml', expected],
    ['ini', '__tests__/__fixtures__/ini/before.ini', '__tests__/__fixtures__/ini/after.ini', expected],
  ])('testing %s format',
    (ext, filepath1, filepath2, expectedResult) => {
      expect(genDiff(filepath1, filepath2)).toBe(expectedResult);
    });
});

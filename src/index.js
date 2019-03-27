import { has, uniq, union, keys } from 'lodash';
import fs from 'fs';
import path from 'path';

const getPath = pathString => path.resolve(pathString);

export default (filepath1, filepath2) => {
  const contentBefore = JSON.parse(fs.readFileSync(getPath(filepath1), 'utf-8'));
  const contentAfter = JSON.parse(fs.readFileSync(getPath(filepath2), 'utf-8'));

  const allProperties = uniq(union(keys(contentBefore), keys(contentAfter)));

  const arr = allProperties.reduce((acc, property) => {
    const valueOfFrom = contentBefore[property];
    const valueOfTo = contentAfter[property];

    if (has(contentBefore, property) && has(contentAfter, property)) {
      if (valueOfFrom === valueOfTo) {
        return [...acc, `  ${property}: ${valueOfFrom}`];
      }

      return [
        ...acc,
        `- ${property}: ${valueOfFrom}`,
        `+ ${property}: ${valueOfTo}`,
      ];
    }

    if (has(contentAfter, property)) {
      return [...acc, `+ ${property}: ${valueOfTo}`];
    }

    return [...acc, `- ${property}: ${valueOfFrom}`];
  }, []);

  return `{\n  ${arr.join('\n  ')}\n}`;
};

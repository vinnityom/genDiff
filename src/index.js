import { has, uniq } from 'lodash';
import fs from 'fs';
import path from 'path';

const signsByOrder = {
  beforeToAfter: { deleted: '-', added: '+' },
  afterToBefore: { deleted: '+', added: '-' },
};

const getPath = pathString => path.resolve(pathString);

export default (filepath1, filepath2) => {
  const contentBefore = JSON.parse(fs.readFileSync(getPath(filepath1), 'utf-8'));
  const contentAfter = JSON.parse(fs.readFileSync(getPath(filepath2), 'utf-8'));

  const propertiesOfBefore = Object.keys(contentBefore);
  const propertiessOfAfter = Object.keys(contentAfter);

  const [
    compareFrom,
    compareTo,
    orderOfComparisson,
  ] = propertiesOfBefore.length >= propertiessOfAfter.length
    ? [contentBefore, contentAfter, 'beforeToAfter'] : [contentAfter, contentBefore, 'afterToBefore'];

  const allProperties = uniq([...propertiesOfBefore, ...propertiessOfAfter]);

  const arr = allProperties.reduce((acc, property) => {
    const valueOfFrom = compareFrom[property];
    const valueOfTo = compareTo[property];

    if (has(compareFrom, property) && has(compareTo, property)) {
      if (valueOfFrom === valueOfTo) {
        return [...acc, `  ${property}: ${valueOfFrom}`];
      }

      return [
        ...acc,
        `${signsByOrder[orderOfComparisson].deleted} ${property}: ${valueOfFrom}`,
        `${signsByOrder[orderOfComparisson].added} ${property}: ${valueOfTo}`,
      ];
    }

    if (has(compareTo, property)) {
      return [...acc, `${signsByOrder[orderOfComparisson].added} ${property}: ${valueOfTo}`];
    }

    return [...acc, `${signsByOrder[orderOfComparisson].deleted} ${property}: ${valueOfFrom}`];
  }, []);

  return `{\n  ${arr.join('\n  ')}\n}`;
};

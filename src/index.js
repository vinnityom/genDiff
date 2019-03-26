import { has, uniq } from 'lodash';
import fs from 'fs';

const signsByOrder = {
  beforeToAfter: { deleted: '-', added: '+' },
  afterToBefore: { deleted: '+', added: '-' },
};

export default (filepath1, filepath2) => {
  const before = JSON.parse(fs.readFileSync(filepath1, 'utf-8'));
  const after = JSON.parse(fs.readFileSync(filepath2, 'utf-8'));

  const propertiesOfBefore = Object.keys(before);
  const propertiessOfAfter = Object.keys(after);

  const [
    compareFrom,
    compareTo,
    orderOfComparisson,
  ] = propertiesOfBefore.length >= propertiessOfAfter.length
    ? [before, after, 'beforeToAfter'] : [after, before, 'afterToBefore'];

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

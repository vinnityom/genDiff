import _ from 'lodash';
import fs from 'fs';
import path from 'path';

const getPath = pathString => path.resolve(pathString);

export default (filepath1, filepath2) => {
  const contentBefore = JSON.parse(fs.readFileSync(getPath(filepath1), 'utf-8'));
  const contentAfter = JSON.parse(fs.readFileSync(getPath(filepath2), 'utf-8'));

  const allProperties = _.union(_.keys(contentBefore), _.keys(contentAfter));

  const arr = allProperties.reduce((acc, property) => {
    const valueOfFrom = contentBefore[property];
    const valueOfTo = contentAfter[property];

    if (_.has(contentBefore, property) && _.has(contentAfter, property)) {
      if (valueOfFrom === valueOfTo) {
        return [...acc, `  ${property}: ${valueOfFrom}`];
      }

      return [
        ...acc,
        `- ${property}: ${valueOfFrom}`,
        `+ ${property}: ${valueOfTo}`,
      ];
    }

    if (_.has(contentAfter, property)) {
      return [...acc, `+ ${property}: ${valueOfTo}`];
    }

    return [...acc, `- ${property}: ${valueOfFrom}`];
  }, []);

  return `{\n  ${arr.join('\n  ')}\n}`;
};

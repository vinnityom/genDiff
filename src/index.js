import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import parse from './parsers';
import render from './render';

const getPath = pathString => path.resolve(pathString);

const getContent = (filepath) => {
  const extention = path.extname(filepath);
  return parse(extention)(fs.readFileSync(getPath(filepath), 'utf-8'));
};

export default (filepath1, filepath2) => {
  const contentBefore = getContent(filepath1);
  const contentAfter = getContent(filepath2);

  const allProperties = _.union(_.keys(contentBefore), _.keys(contentAfter));

  const arr = allProperties.map((property) => {
    const valueOfFrom = contentBefore[property];
    const valueOfTo = contentAfter[property];

    if (_.has(contentBefore, property) && _.has(contentAfter, property)) {
      if (valueOfFrom === valueOfTo) {
        return {
          property,
          status: 'unchanged',
          value: valueOfFrom,
        };
      }

      return {
        property,
        status: 'changed',
        valueBefore: valueOfFrom,
        valueAfter: valueOfTo,
      };
    }

    if (_.has(contentAfter, property)) {
      return {
        property,
        status: 'added',
        value: valueOfTo,
      };
    }

    return {
      property,
      status: 'deleted',
      value: valueOfFrom,
    };
  });

  return render(arr);
};

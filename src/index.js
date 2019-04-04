import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import parse from './parsers';
import render from './renderers';

const getPath = pathString => path.resolve(pathString);

const getContent = (filepath) => {
  const extention = path.extname(filepath);
  return parse(extention)(fs.readFileSync(getPath(filepath), 'utf-8'));
};

const nodeDispatcher = [
  {
    type: 'unchanged',
    check: (firstValue, secondValue) => (firstValue === secondValue),
    process: (property, type, currentValue) => ({
      property, type, currentValue,
    }),
  },
  {
    type: 'nested',
    check: (firstValue, secondValue) => (_.isObject(firstValue) && _.isObject(secondValue)),
    process: (property, type, currentValue, previousValue, buildDiff) => ({
      property,
      type,
      currentValue: null,
      previousValue: null,
      children: buildDiff(previousValue, currentValue),
    }),
  },
  {
    type: 'added',
    check: firstValue => (!firstValue),
    process: (property, type, currentValue) => ({
      property, type, currentValue,
    }),
  },
  {
    type: 'deleted',
    check: (firstValue, secondValue) => (!secondValue),
    process: (property, type, currentValue, previousValue) => ({
      property, type, currentValue: previousValue,
    }),
  },
  {
    type: 'updated',
    check: (firstValue, secondValue) => (firstValue !== secondValue),
    process: (property, type, currentValue, previousValue) => ({
      property, type, currentValue, previousValue,
    }),
  },
];

const buildDiff = (contentBefore, contentAfter) => {
  const properties = _.union(_.keys(contentBefore), _.keys(contentAfter));

  return properties.map((property) => {
    const valueOfFrom = contentBefore[property];
    const valueOfTo = contentAfter[property];

    const { type, process } = _.find(
      nodeDispatcher, element => element.check(valueOfFrom, valueOfTo),
    );
    return process(property, type, valueOfTo, valueOfFrom, buildDiff);
  });
};

export default (filepath1, filepath2, format = 'cascade') => {
  const contentBefore = getContent(filepath1);
  const contentAfter = getContent(filepath2);
  const diff = buildDiff(contentBefore, contentAfter);

  return render(diff, format);
};

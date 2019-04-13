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
    check: (key, firstConfig, secondConfig) => (firstConfig[key] === secondConfig[key]),
    process: currentValue => ({ currentValue }),
  },
  {
    type: 'nested',
    check: (key, firstConfig, secondConfig) => (
      _.isObject(firstConfig[key]) && _.isObject(secondConfig[key])),
    process: (currentValue, previousValue, buildDiff) => ({
      currentValue: null,
      previousValue: null,
      children: buildDiff(previousValue, currentValue),
    }),
  },
  {
    type: 'added',
    check: (key, firstConfig) => (!_.has(firstConfig, key)),
    process: currentValue => ({ currentValue }),
  },
  {
    type: 'deleted',
    check: (key, firstConfig, secondConfig) => (!_.has(secondConfig, key)),
    process: (currentValue, previousValue) => ({
      currentValue: previousValue,
    }),
  },
  {
    type: 'updated',
    check: (key, firstConfig, secondConfig) => (firstConfig[key] !== secondConfig[key]),
    process: (currentValue, previousValue) => ({
      currentValue, previousValue,
    }),
  },
];

const buildDiff = (contentBefore, contentAfter) => {
  const properties = _.union(_.keys(contentBefore), _.keys(contentAfter));

  return properties.map((property) => {
    const { type, process } = _.find(
      nodeDispatcher, element => element.check(property, contentBefore, contentAfter),
    );
    return {
      property, type, ...process(contentAfter[property], contentBefore[property], buildDiff),
    };
  });
};

export default (filepath1, filepath2, format = 'cascade') => {
  const contentBefore = getContent(filepath1);
  const contentAfter = getContent(filepath2);
  const diff = buildDiff(contentBefore, contentAfter);

  return render(diff, format);
};

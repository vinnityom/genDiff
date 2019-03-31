import _ from 'lodash';

const makeTab = times => '  '.repeat(times);

const stringify = (value, depth) => {
  if (!_.isObject(value)) {
    return value;
  }

  const lines = _.keys(value).map(key => `${makeTab(depth + 2)}  ${key}: ${value[key]}`);
  return `{\n${lines.join('\n')}\n${makeTab(depth + 1)}}`;
};

const methods = {
  unchanged: (depth, property, value) => `${makeTab(depth)}  ${property}: ${value}`,
  added: (depth, property, value) => `${makeTab(depth)}+ ${property}: ${value}`,
  deleted: (depth, property, value) => `${makeTab(depth)}- ${property}: ${value}`,
  updated: (depth, property, currentValue, previousValue) => [`${makeTab(depth)}- ${property}: ${previousValue}`, `${makeTab(depth)}+ ${property}: ${currentValue}`],
  nested: (depth, property, currentValue, previousValue, children) => `${makeTab(depth)}  ${property}: {\n${children}\n${makeTab(depth + 1)}}`,
};

const toString = (
  depth, type, property, currentValue, previousValue, children,
) => methods[type](
  depth, property, stringify(currentValue, depth), stringify(previousValue, depth), children,
);

export default (ast) => {
  const genOutput = (arr, depth) => {
    const lines = arr.map(element => toString(
      depth,
      element.type,
      element.property,
      element.currentValue,
      element.previousValue,
      genOutput(element.children, depth + 2),
    ));

    return `${_.flattenDeep(lines).join('\n')}`;
  };

  return `{\n${genOutput(ast, 1)}\n}`;
};

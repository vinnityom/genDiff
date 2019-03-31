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
  nested: (depth, property, currentValue, previousValue, children, process) => `${makeTab(depth)}  ${property}: {\n${process(children, depth + 2)}\n${makeTab(depth + 1)}}`,
};

const toString = (
  process, depth, type, property, currentValue, previousValue, children,
) => methods[type](
  depth,
  property,
  stringify(currentValue, depth),
  stringify(previousValue, depth),
  children,
  process,
);

export default (ast) => {
  const genOutput = (arr, depth) => {
    const lines = arr.map(element => toString(
      genOutput,
      depth,
      element.type,
      element.property,
      element.currentValue,
      element.previousValue,
      element.children,
    ));

    return `${_.flattenDeep(lines).join('\n')}`;
  };

  return `{\n${genOutput(ast, 1)}\n}`;
};

import _ from 'lodash';

const makeTab = times => '  '.repeat(times);

const stringify = (value, depth) => {
  if (!_.isObject(value)) {
    return value;
  }

  const strings = _.keys(value).map(key => `${makeTab(depth + 2)}  ${key}: ${value[key]}`);
  return `{\n${strings.join('\n')}\n${makeTab(depth + 1)}}`;
};

const methods = {
  unchanged: (depth, property, value) => `${makeTab(depth)}  ${property}: ${stringify(value, depth)}`,
  added: (depth, property, value) => `${makeTab(depth)}+ ${property}: ${stringify(value, depth)}`,
  deleted: (depth, property, value) => `${makeTab(depth)}- ${property}: ${stringify(value, depth)}`,
  updated: (depth, property, value) => `${makeTab(depth)}- ${property}: ${stringify(value.before, depth)}\n${makeTab(depth)}+ ${property}: ${stringify(value.after, depth)}`,
  nested: (depth, property, value, children) => `${makeTab(depth)}  ${property}: {\n${children}\n${makeTab(depth + 1)}}`,
};

const toString = (
  depth, status, property, value, children,
) => methods[status](depth, property, value, children);

export default (ast) => {
  const genOutput = (arr, depth) => {
    const strings = arr.map(element => toString(
      depth,
      element.status,
      element.property,
      element.value,
      genOutput(element.children, depth + 2),
    ));

    return `${strings.join('\n')}`;
  };

  return `{\n${genOutput(ast, 1)}\n}`;
};

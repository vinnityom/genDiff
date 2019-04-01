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
  unchanged: (depth, { property, currentValue: value }) => `${makeTab(depth)}  ${property}: ${stringify(value, depth)}`,
  added: (depth, { property, currentValue: value }) => `${makeTab(depth)}+ ${property}: ${stringify(value, depth)}`,
  deleted: (depth, { property, currentValue: value }) => `${makeTab(depth)}- ${property}: ${stringify(value, depth)}`,
  updated: (depth, { property, currentValue, previousValue }) => [`${makeTab(depth)}- ${property}: ${stringify(previousValue, depth)}`, `${makeTab(depth)}+ ${property}: ${stringify(currentValue, depth)}`],
  nested: (depth, { property, children }, process) => `${makeTab(depth)}  ${property}: {\n${process(children, depth + 2)}\n${makeTab(depth + 1)}}`,
};

const toString = (process, depth, node) => methods[node.type](depth, node, process);

export default (ast) => {
  const genOutput = (arr, depth) => {
    const lines = arr.map(node => toString(genOutput, depth, node));

    return `${_.flattenDeep(lines).join('\n')}`;
  };

  return `{\n${genOutput(ast, 1)}\n}`;
};

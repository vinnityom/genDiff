import _ from 'lodash';

const stringify = (value) => {
  if (_.isObject(value)) {
    return '[complex value]';
  }
  if (typeof value === 'string') {
    return `'${value}'`;
  }

  return value;
};

const getName = properties => properties.join('.');

const methods = {
  unchanged: (ancestors, { property }) => `Property '${getName([...ancestors, property])}' wasn't changed`,
  added: (ancestors, { property, currentValue: value }) => `Property '${getName([...ancestors, property])}' was added with value: ${stringify(value)}`,
  deleted: (ancestors, { property }) => `Property '${getName([...ancestors, property])}' was removed`,
  updated: (ancestors, { property, currentValue, previousValue }) => `Property '${getName([...ancestors, property])}' was updated. From ${stringify(previousValue)} to ${stringify(currentValue)}`,
  nested: (ancestors, { property, children }, proccess) => `${proccess(children, [...ancestors, property])}`,
};

const toString = (proccess, ancestors, node) => methods[node.type](ancestors, node, proccess);

export default (diff) => {
  const genOutput = (arr, ancestors) => {
    const lines = arr.map(node => toString(genOutput, ancestors, node));

    return `${lines.join('\n')}`;
  };

  return genOutput(diff, []);
};

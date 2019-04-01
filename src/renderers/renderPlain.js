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
  unchanged: (ancestry, { property }) => `Property '${getName([...ancestry, property])}' wasn't changed`,
  added: (ancestry, { property, currentValue: value }) => `Property '${getName([...ancestry, property])}' was added with value: ${stringify(value)}`,
  deleted: (ancestry, { property }) => `Property '${getName([...ancestry, property])}' was removed`,
  updated: (ancestry, { property, currentValue, previousValue }) => `Property '${getName([...ancestry, property])}' was updated. From ${stringify(previousValue)} to ${stringify(currentValue)}`,
  nested: (ancestry, { property, children }, proccess) => `${proccess(children, [...ancestry, property])}`,
};

const toString = (proccess, ancestry, node) => methods[node.type](ancestry, node, proccess);

export default (diff) => {
  const genOutput = (arr, ancestry) => {
    const lines = arr.map(node => toString(genOutput, ancestry, node));

    return `${lines.join('\n')}`;
  };

  return genOutput(diff, []);
};

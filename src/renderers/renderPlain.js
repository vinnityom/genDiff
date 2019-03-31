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
  unchanged: properties => `Property '${getName(properties)}' wasn't changed`,
  added: (properties, value) => `Property '${getName(properties)}' was added with value: ${value}`,
  deleted: properties => `Property '${getName(properties)}' was removed`,
  updated: (properties, currentValue, previousValue) => `Property '${getName(properties)}' was updated. From ${previousValue} to ${currentValue}`,
  nested: (properties, currentValue, previousValue, children, proccess) => `${proccess(children, properties)}`,
};

const toString = (
  proccess, type, properties, currentValue, previousValue, children,
) => methods[type](
  properties, stringify(currentValue), stringify(previousValue), children, proccess,
);

export default (diff) => {
  const genOutput = (arr, previousProperties) => {
    const lines = arr.map(node => toString(
      genOutput,
      node.type,
      [...previousProperties, node.property],
      node.currentValue,
      node.previousValue,
      node.children,
    ));
    return `${lines.join('\n')}`;
  };

  return genOutput(diff, []);
};

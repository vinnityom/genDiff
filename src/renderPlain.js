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
  unchanged: name => `Property '${name}' wasn't changed`,
  added: (name, value) => `Property '${name}' was added with value: ${value}`,
  deleted: name => `Property '${name}' was removed`,
  updated: (name, currentValue, previousValue) => `Property '${name}' was updated. From ${previousValue} to ${currentValue}`,
  nested: (property, currentValue, previousValue, children) => `${children}`,
};

const toString = (
  status, property, currentValue, previousValue, children,
) => methods[status](
  getName(property), stringify(currentValue), stringify(previousValue), children,
);

export default (diff) => {
  const genOutput = (arr, previousProperties) => {
    const strings = arr.map(node => toString(
      node.status,
      [...previousProperties, node.property],
      node.currentValue,
      node.previousValue,
      genOutput(node.children, [...previousProperties, node.property]),
    ));
    return `${strings.join('\n')}`;
  };

  return genOutput(diff, []);
};

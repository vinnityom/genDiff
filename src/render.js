import _ from 'lodash';

const makeTab = times => '  '.repeat(times);

const stringify = (value, depth) => {
  if (!_.isObject(value)) {
    return value;
  }

  const strings = _.keys(value).map(key => `  ${key}: ${value[key]}`);
  return `{\n${strings.join('\n')}\n}`;
};

const methods = {
  unchanged: (depth, property, value) => `  ${property}: ${value}`,
  added: (depth, property, value) => `+ ${property}: ${value}`,
  deleted: (depth, property, value) => `- ${property}: ${value}`,
  nested: (depth, property, value, children) => `  ${property}: ${children}`,
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
      stringify(element.value, depth + 2),
      genOutput(element.children, depth + 1),
    ));

    return `{\n${strings.join('\n')}\n}`;
  };

  return genOutput(ast, 1);
};

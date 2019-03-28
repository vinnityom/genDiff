import _ from 'lodash';

const sign = {
  unchanged: ' ',
  added: '+',
  deleted: '-',
};

const getValueString = (value, shift) => {
  if (!_.isObject(value)) {
    return value;
  }

  const strings = _.keys(value).map(key => `${shift}${key}: ${value[key]}`);
  return `{\n${shift}${strings.join(`\n${shift}`)}\n${shift}  }`;
};

export default (ast) => {
  const shift = times => '  '.repeat(times);
  const genOutput = (arr, depth) => {
    const strings = arr.map((element) => {
      const {
        property, status, value, children,
      } = element;

      if (children) {
        return `${shift(depth)}${sign[status]} ${property}: ${genOutput(children, depth + 1)}`;
      }

      if (status === 'changed') {
        return `${shift(depth)}- ${property}: ${getValueString(value.before, shift(depth + 1))}\n${shift(depth + 1)}+ ${property}: ${getValueString(value.after, shift(depth + 1))}`;
      }

      return `${shift(depth)}${sign[status]} ${property}: ${getValueString(value, shift(depth + 2))}`;
    });

    return `{\n${shift(depth - 1)}${strings.join('\n  ')}\n}`;
  };

  return genOutput(ast, 1);
};

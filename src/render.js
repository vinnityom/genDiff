const signs = {
  unchanged: ' ',
  added: '+',
  deleted: '-',
};

export default (ast) => {
  const arrayOfStrings = ast.map((element) => {
    if (element.status === 'changed') {
      return `- ${element.property}: ${element.valueBefore}\n  + ${element.property}: ${element.valueAfter}`;
    }

    return `${signs[element.status]} ${element.property}: ${element.value}`;
  });

  return `{\n  ${arrayOfStrings.join('\n  ')}\n}`;
};

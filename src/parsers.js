import yaml from 'js-yaml';
import ini from 'ini';
import _ from 'lodash';

const iniParse = (data) => {
  const parsedData = ini.parse(data);
  const numbersToString = object => _.keys(object).reduce((acc, key) => {
    const currentValue = object[key];
    if (typeof currentValue === 'number') {
      const newValue = currentValue.toString();
      return { ...acc, [key]: newValue };
    }
    if (_.isObject(currentValue)) {
      return { ...acc, [key]: numbersToString(currentValue) };
    }

    return { ...acc, [key]: currentValue };
  }, {});

  return numbersToString(parsedData);
};

const parsers = {
  '.yml': yaml.safeLoad,
  '.json': JSON.parse,
  '.ini': iniParse,
};

export default ext => parsers[ext];

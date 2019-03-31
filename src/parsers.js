import yaml from 'js-yaml';
import ini from 'ini';
import _ from 'lodash';

const iniParse = (data) => {
  const parsedData = ini.parse(data);
  const numbersToString = object => _.keys(object).reduce((acc, key) => {
    if (typeof object[key] === 'number') {
      const newData = object[key].toString();
      return { ...acc, [key]: newData };
    }
    if (_.isObject(object[key])) {
      return { ...acc, [key]: numbersToString(object[key]) };
    }

    return { ...acc, [key]: object[key] };
  }, {});

  return numbersToString(parsedData);
};

const parsers = {
  '.yml': yaml.safeLoad,
  '.json': JSON.parse,
  '.ini': iniParse,
};

export default ext => parsers[ext];

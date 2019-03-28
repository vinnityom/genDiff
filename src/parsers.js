import yaml from 'js-yaml';
import ini from 'ini';

const parsers = {
  '.yml': yaml.safeLoad,
  '.json': JSON.parse,
  '.ini': ini.parse,
};

export default ext => parsers[ext];

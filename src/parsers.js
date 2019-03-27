import yaml from 'js-yaml';
import ini from 'ini';

const parsers = {
  '.yml': content => yaml.safeLoad(content),
  '.json': content => JSON.parse(content),
  '.ini': content => ini.parse(content),
};

export default ext => parsers[ext];

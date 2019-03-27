import yaml from 'js-yaml';

const parsers = {
  '.yml': content => yaml.safeLoad(content),
  '.json': content => JSON.parse(content),
};

export default ext => parsers[ext];

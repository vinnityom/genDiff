#! /usr/bin/env node
import program from 'commander';
import { version } from '../../package.json';

program
  .version(version)
  .description('Compares two configuration files and shows a difference.')
  .option('-h, --help', 'output usage information')
  .option('-V, --version', 'output the version number')
  .option('-f, --format', 'output format')
  .arguments('<firstConfig>', '<secondConfig>')
  .parse(process.argv);

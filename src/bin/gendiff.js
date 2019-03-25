#! /usr/bin/env node
import program from 'commander';
import { version } from '../../package.json';

program
  .version(version)
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format', 'output format')
  .arguments('<firstConfig> <secondConfig>')
  .parse(process.argv);

console.log('app is running');

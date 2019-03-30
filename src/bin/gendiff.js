#! /usr/bin/env node
import program from 'commander';
import { version } from '../../package.json';
import compareConfigs from '..';

program
  .version(version)
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format', 'output format')
  .arguments('<firstConfig> <secondConfig>')
  .action((filepath1, filepath2) => {
    console.log(compareConfigs(filepath1, filepath2, program.format));
  })
  .parse(process.argv);

#! /usr/bin/env node
import program from 'commander';
import { version } from '../../package.json';
import compareConfigs from '..';

program
  .version(version)
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format', 'output format')
  .arguments('<firstConfig> <secondConfig>')
  .action((firstConfig, secondConfig) => {
    console.log(compareConfigs(firstConfig, secondConfig));
  })
  .parse(process.argv);

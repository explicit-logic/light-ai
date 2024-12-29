import chalk from 'chalk';

export function getConsoleLogPrefix(forcePrefix = false, padEnd = true) {
  if (forcePrefix) return chalk.gray('[node-llama-cpp]') + (padEnd ? ' ' : '');

  return '';
}

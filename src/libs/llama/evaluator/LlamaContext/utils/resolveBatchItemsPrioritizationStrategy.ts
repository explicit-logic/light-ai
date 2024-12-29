import type { BatchingOptions } from '../types.js';
import { firstInFirstOutStrategy } from './batchItemsPrioritizationStrategies/firstInFirstOutStrategy.js';
import { maximumParallelismStrategy } from './batchItemsPrioritizationStrategies/maximumParallelismStrategy.js';

export function resolveBatchItemsPrioritizationStrategy(strategy: Required<BatchingOptions>['itemPrioritizationStrategy']) {
  if (strategy instanceof Function) return strategy;
  if (strategy === 'maximumParallelism') return maximumParallelismStrategy;
  if (strategy === 'firstInFirstOut') return firstInFirstOutStrategy;

  void (strategy satisfies never);

  throw new Error(`Unknown batch items prioritize strategy: ${strategy}`);
}

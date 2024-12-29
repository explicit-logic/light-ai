import { maxRecentDetokenizerTokens } from '../consts';
import type { Token } from '../types';

export function resolveLastTokens(tokenArrays: Token[][], maxTokens: number = maxRecentDetokenizerTokens) {
  const lastTokens: Token[] = [];
  for (let i = tokenArrays.length - 1; i >= 0 && lastTokens.length < maxTokens; i--) {
    const tokens = tokenArrays[i]!;

    for (let j = tokens.length - 1; j >= 0 && lastTokens.length < maxTokens; j--) {
      lastTokens.unshift(tokens[j]!);
    }
  }

  return lastTokens;
}

import type { Token } from '../types';

export function compareTokens(token1?: Token, token2?: Token) {
  return token1 === token2;
}

import type { Token } from '../types';

export function isToken(token: any): token is Token {
  return typeof token === 'number';
}

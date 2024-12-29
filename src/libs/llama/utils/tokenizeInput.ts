import type { Token, Tokenizer } from '../types';
import { type LlamaText, isLlamaText } from './LlamaText';
import { isToken } from './isToken';

export function tokenizeInput(
  input: Token | Token[] | string | LlamaText,
  tokenizer: Tokenizer,
  options?: 'trimLeadingSpace',
  clone = false,
) {
  if (typeof input === 'string') return tokenizer(input, false, options);
  if (isLlamaText(input)) return input.tokenize(tokenizer, options);
  if (isToken(input)) return [input];

  if (clone) return input.slice();

  return input;
}

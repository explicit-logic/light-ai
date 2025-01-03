import type { Token, Tokenizer } from '../types';
import type { StopGenerationDetector } from './StopGenerationDetector';

export function getQueuedTokensBeforeStopTrigger(
  triggeredStops: ReturnType<(typeof StopGenerationDetector)['prototype']['getTriggeredStops']>,
  partiallyFreeTokens: {
    tokens: Token[];
    text: string;
  },
  tokenizer: Tokenizer,
) {
  if (partiallyFreeTokens.tokens.length === 0 && partiallyFreeTokens.text.length === 0) return [];
  if (partiallyFreeTokens.tokens.length !== 0 && partiallyFreeTokens.text.length === 0) return partiallyFreeTokens.tokens;
  if (partiallyFreeTokens.tokens.length === 0 && partiallyFreeTokens.text.length !== 0)
    return tokenizer(partiallyFreeTokens.text, false, 'trimLeadingSpace');

  const triggerThatStartsWithStringIndex = triggeredStops.findIndex(
    (trigger) => trigger.stopTrigger.length > 0 && typeof trigger.stopTrigger[0] === 'string',
  );
  const triggerThatStartsWithTokenIndex = triggeredStops.findIndex(
    (trigger) => trigger.stopTrigger.length > 0 && typeof trigger.stopTrigger[0] !== 'string',
  );

  if (triggerThatStartsWithTokenIndex > 0 && triggerThatStartsWithStringIndex < 0) return partiallyFreeTokens.tokens;
  if (triggerThatStartsWithStringIndex > 0 && triggerThatStartsWithTokenIndex < 0)
    return tokenizer(partiallyFreeTokens.text, false, 'trimLeadingSpace');

  const stringTokens = tokenizer(partiallyFreeTokens.text, false, 'trimLeadingSpace');
  if (
    stringTokens.length === partiallyFreeTokens.tokens.length &&
    stringTokens.every((value, index) => value === partiallyFreeTokens.tokens[index])
  )
    return stringTokens;
  if (triggerThatStartsWithStringIndex < triggerThatStartsWithTokenIndex) return stringTokens;

  return partiallyFreeTokens.tokens;
}

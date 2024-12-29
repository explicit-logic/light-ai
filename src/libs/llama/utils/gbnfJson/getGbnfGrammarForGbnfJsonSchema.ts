import { GbnfGrammarGenerator } from './GbnfGrammarGenerator.js';
import type { GbnfJsonSchema } from './types.js';
import { GbnfJsonScopeState } from './utils/GbnfJsonScopeState.js';
import { getGbnfJsonTerminalForGbnfJsonSchema } from './utils/getGbnfJsonTerminalForGbnfJsonSchema.js';

export function getGbnfGrammarForGbnfJsonSchema(
  schema: Readonly<GbnfJsonSchema>,
  {
    allowNewLines = true,
    scopePadSpaces = 4,
  }: {
    allowNewLines?: boolean;
    scopePadSpaces?: number;
  } = {},
): string {
  const grammarGenerator = new GbnfGrammarGenerator();
  const scopeState = new GbnfJsonScopeState({ allowNewLines, scopePadSpaces });
  const rootTerminal = getGbnfJsonTerminalForGbnfJsonSchema(schema, grammarGenerator, scopeState);
  const rootGrammar = rootTerminal.getGrammar(grammarGenerator);

  return grammarGenerator.generateGbnfFile(`${rootGrammar} "${'\\n'.repeat(4)}" [\\n]*`);
}

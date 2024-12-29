import type { GbnfGrammarGenerator } from '../GbnfGrammarGenerator.js';
import { GbnfTerminal } from '../GbnfTerminal.js';

export class GbnfGrammar extends GbnfTerminal {
  public readonly grammar: string | string[];
  public readonly resolveToRawGrammar: boolean;

  public constructor(grammar: string | string[], resolveToRawGrammar = false) {
    super();
    this.grammar = grammar;
    this.resolveToRawGrammar = resolveToRawGrammar;
  }

  public getGrammar(): string {
    if (Array.isArray(this.grammar)) return this.grammar.filter((item) => item !== '').join(' ');

    return this.grammar;
  }

  public override resolve(grammarGenerator: GbnfGrammarGenerator): string {
    if (this.resolveToRawGrammar) return this.getGrammar();

    return super.resolve(grammarGenerator);
  }
}

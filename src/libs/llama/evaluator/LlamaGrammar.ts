import type { AddonGrammar } from '../bindings/AddonTypes';
import type { Llama } from '../bindings/Llama.js';
import type { Token } from '../types';
import { LlamaText } from '../utils/LlamaText.js';

import grammarArithmetic from '../grammars/arithmetic.gbnf' with { type: 'text' };
import grammarC from '../grammars/c.gbnf' with { type: 'text' };
import grammarChess from '../grammars/chess.gbnf' with { type: 'text' };
import grammarEnglish from '../grammars/english.gbnf' with { type: 'text' };
import grammarJapanese from '../grammars/japanese.gbnf' with { type: 'text' };
import grammarJson from '../grammars/json.gbnf' with { type: 'text' };
import grammarJsonArr from '../grammars/json_arr.gbnf' with { type: 'text' };
import grammarList from '../grammars/list.gbnf' with { type: 'text' };

const grammarFilesMap = {
  arithmetic: grammarArithmetic,
  c: grammarC,
  chess: grammarChess,
  english: grammarEnglish,
  japanese: grammarJapanese,
  json: grammarJson,
  jsonArr: grammarJsonArr,
  list: grammarList,
} as const;

export type LlamaGrammarOptions = {
  /** GBNF grammar */
  grammar: string;

  /** Consider any of these as EOS for the generated text. Only supported by `LlamaChat` and `LlamaChatSession` */
  stopGenerationTriggers?: readonly (LlamaText | string | readonly (string | Token)[])[];

  /** Trim whitespace from the end of the generated text. Only supported by `LlamaChat` and `LlamaChatSession` */
  trimWhitespaceSuffix?: boolean;

  /**
   * Root rule name.
   *
   * Defaults to `"root"`.
   */
  rootRuleName?: string;
};

export class LlamaGrammar {
  /** @internal */ public readonly _llama: Llama;
  /** @internal */ public readonly _grammar: AddonGrammar;
  /** @internal */ private readonly _stopGenerationTriggers: readonly (LlamaText | string | readonly (string | Token)[])[];
  /** @internal */ private readonly _trimWhitespaceSuffix: boolean;
  /** @internal */ private readonly _grammarText: string;
  /** @internal */ private readonly _rootRuleName: string;

  /**
   * > GBNF files are supported.
   * > More info here: [
   * github:ggerganov/llama.cpp:grammars/README.md
   * ](https://github.com/ggerganov/llama.cpp/blob/f5fe98d11bdf9e7797bcfb05c0c3601ffc4b9d26/grammars/README.md)
   * @param llama
   * @param options
   */
  public constructor(
    llama: Llama,
    { grammar, stopGenerationTriggers = [], trimWhitespaceSuffix = false, rootRuleName = 'root' }: LlamaGrammarOptions,
  ) {
    this._llama = llama;
    this._grammar = new this._llama._bindings.AddonGrammar(grammar, {
      addonExports: this._llama._bindings,
      rootRuleName,
    });
    this._stopGenerationTriggers = stopGenerationTriggers ?? [];
    this._trimWhitespaceSuffix = trimWhitespaceSuffix;
    this._grammarText = grammar;
    this._rootRuleName = rootRuleName;
  }

  public get grammar(): string {
    return this._grammarText;
  }

  public get rootRuleName(): string {
    return this._rootRuleName;
  }

  public get stopGenerationTriggers() {
    return this._stopGenerationTriggers;
  }

  public get trimWhitespaceSuffix() {
    return this._trimWhitespaceSuffix;
  }

  /**
   * Test if the given text is compatible with the grammar.
   * @internal
   */
  public _testText(text: string): boolean {
    return this._grammar.isTextCompatible(String(text));
  }

  public static async getFor(llama: Llama, type: keyof typeof grammarFilesMap) {
    if (grammarFilesMap[type]) {
      const grammar = grammarFilesMap[type];

      return new LlamaGrammar(llama, {
        grammar,
        stopGenerationTriggers: [LlamaText(['\n'.repeat(10)])], // this is a workaround for the model not stopping to generate text,
        trimWhitespaceSuffix: true,
      });
    }

    throw new Error(`Grammar file for type "${type}" was not found`);
  }
}

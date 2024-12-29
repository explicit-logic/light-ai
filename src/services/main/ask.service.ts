import { LlamaChatSession } from '@/libs/llama/evaluator/LlamaChatSession/LlamaChatSession';
import { getLlama } from '@/utils/llama/getLlama';

import type { GbnfJsonSchema } from '@/libs/llama//utils/gbnfJson/types';

import { ensureModelPath } from '@/utils/localModels/ensureModelPath';

type Params = {
  model?: string;
  prompt: string;
  grammar?: string;
  schema?: Readonly<GbnfJsonSchema>;
};
export async function ask(params: Params) {
  const { prompt } = params;

  const llama = await getLlama();
  const modelPath = await ensureModelPath(params.model);
  const model = await llama.loadModel({
    modelPath,
  });
  const context = await model.createContext();
  const session = new LlamaChatSession({
    contextSequence: context.getSequence(),
  });

  if (params.grammar) {
    const grammar = await llama.createGrammar({
      grammar: params.grammar,
      stopGenerationTriggers: ['\n\n\n\n'],
    });
    const answer = await session.prompt(prompt, {
      grammar,
      maxTokens: context.contextSize,
    });

    return answer;
  }

  if (params.schema) {
    const grammar = await llama.createGrammarForJsonSchema(params.schema);

    const answer = await session.prompt(prompt, {
      grammar,
      maxTokens: context.contextSize,
    });

    return answer;
  }
  const answer = await session.prompt(prompt);

  return answer;
}

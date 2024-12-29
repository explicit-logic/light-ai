import { getLlama } from '@/utils/llama/getLlama';

import { LlamaCompletion } from '@/libs/llama/evaluator/LlamaCompletion';

import { ensureModelPath } from '@/utils/localModels/ensureModelPath';

type Params = {
  model?: string;
  prompt: string;
};
export async function completion(params: Params) {
  const { prompt } = params;

  const llama = await getLlama();
  const modelPath = await ensureModelPath(params.model);
  const model = await llama.loadModel({
    modelPath,
  });
  const context = await model.createContext();
  const completion = new LlamaCompletion({
    contextSequence: context.getSequence(),
  });
  const result = await completion.generateCompletion(prompt, {
    maxTokens: 500,
  });

  return result;
}

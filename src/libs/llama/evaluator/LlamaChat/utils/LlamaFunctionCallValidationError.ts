import type { ChatWrapper } from '../../../ChatWrapper.js';
import type { ChatModelFunctions } from '../../../types.js';

export class LlamaFunctionCallValidationError<const Functions extends ChatModelFunctions> extends Error {
  public readonly functions: Functions;
  public readonly chatWrapper: ChatWrapper;
  public readonly callText: string;

  public constructor(message: string, functions: Functions, chatWrapper: ChatWrapper, callText: string) {
    super(message);

    this.functions = functions;
    this.chatWrapper = chatWrapper;
    this.callText = callText;
  }
}

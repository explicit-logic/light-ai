import { withLock } from 'lifecycle-utils';

import type { BindingModule } from '@/libs/llama/bindings/AddonTypes';
import { Llama } from '@/libs/llama/bindings/Llama';
import { LlamaLogLevel } from '@/libs/llama/bindings/types';
import { defaultLlamaRamPadding } from '@/utils/llama/getLlama';
import { getPrebuiltBinaryBuildMetadata } from '@/utils/llama/getPrebuiltBinaryBuildMetadata';
import { getBinaryDir, getBindingPath, getName as getPackageName } from './binaryPackage';

let sharedLlamaWithoutBackend: Llama | null = null;

export async function getLlamaWithoutBackend() {
  if (sharedLlamaWithoutBackend != null) return sharedLlamaWithoutBackend;

  return await withLock(getLlamaWithoutBackend, 'loadAddon', async () => {
    if (sharedLlamaWithoutBackend != null) return sharedLlamaWithoutBackend;

    const packageName = getPackageName();
    if (!packageName) {
      throw new Error('No prebuilt binaries found');
    }
    const binaryDir = await getBinaryDir(packageName);
    const buildMetadata = await getPrebuiltBinaryBuildMetadata(binaryDir, packageName);
    const bindingPath = getBindingPath(binaryDir);
    const binding = loadBindingModule(bindingPath);

    sharedLlamaWithoutBackend = await Llama._create({
      bindings: binding,
      buildType: 'prebuilt',
      buildMetadata,
      logLevel: LlamaLogLevel.error,
      logger: Llama.defaultConsoleLogger,
      vramPadding: 0,
      ramPadding: defaultLlamaRamPadding,
      skipLlamaInit: true,
      debug: false,
    });

    return sharedLlamaWithoutBackend;
  });
}

function loadBindingModule(bindingModulePath: string) {
  // each llama instance has its own settings, such as a different logger, so we have to make sure we load a new instance every time
  try {
    delete require.cache[require.resolve(bindingModulePath)];
  } catch (err) {}

  try {
    const binding: BindingModule = require(bindingModulePath);

    return binding;
  } finally {
    try {
      delete require.cache[require.resolve(bindingModulePath)];
    } catch (err) {}
  }
}

import type { BindingModule } from '@/libs/llama/bindings/AddonTypes';
import { Llama } from '@/libs/llama/bindings/Llama';
import { LlamaLogLevel } from '@/libs/llama/bindings/types';
import { getPlatform } from '@/libs/llama/bindings/utils/getPlatform';
import { getPrebuiltBinaryBuildMetadata } from '@/utils/llama/getPrebuiltBinaryBuildMetadata';
import { getBinaryDir, getBindingPath, getName as getPackageName } from './binaryPackage';

let llama: Llama;

export async function getLlama() {
  if (llama) return llama;
  const packageName = getPackageName();
  if (!packageName) {
    throw new Error('No prebuilt binaries found');
  }
  const binaryDir = await getBinaryDir(packageName);
  const buildMetadata = await getPrebuiltBinaryBuildMetadata(binaryDir, packageName);
  const bindingPath = getBindingPath(binaryDir);
  const binding = loadBindingModule(bindingPath);

  llama = await Llama._create({
    bindings: binding,
    buildType: 'prebuilt',
    buildMetadata,
    logLevel: LlamaLogLevel.warn,
    logger: Llama.defaultConsoleLogger,
    maxThreads: 4,
    vramPadding: defaultLlamaVramPadding,
    ramPadding: defaultLlamaRamPadding,
    skipLlamaInit: false,
    debug: false,
  });

  return llama;
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

export const defaultLlamaVramPadding = (totalVram: number) => Math.floor(Math.min(totalVram * 0.06, 1024 * 1024 * 1024));
export const defaultLlamaRamPadding = (totalRam: number) => {
  const platform = getPlatform();

  if (platform === 'linux') return Math.floor(Math.min(totalRam * 0.25, 1024 * 1024 * 1024));

  return Math.floor(Math.min(totalRam * 0.25, 1024 * 1024 * 1024 * 6));
};

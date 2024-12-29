import path from 'node:path';

import { LLAMA_BINARIES_DIR } from '@/config/paths';
import { getPlatform } from '@/libs/llama/bindings/utils/getPlatform';
import { moduleVersion } from '@/libs/llama/config';

export function getUrl(packageName: PackageName) {
  return `https://registry.npmjs.org/@node-llama-cpp/${packageName}/-/${packageName}-${moduleVersion}.tgz`;
}

export function getDir(packageName: PackageName) {
  return path.join(LLAMA_BINARIES_DIR, packageName);
}

export function getPackageJsonPath(packageName: PackageName) {
  return path.join(getDir(packageName), 'package.json');
}

type BinaryModule = {
  getBinsDir: () => { binsDir: string; packageVersion: string };
};
export async function getBinaryDir(packageName: PackageName) {
  const dir = getDir(packageName);
  const binaryModule: BinaryModule = await import(dir);
  const { binsDir, packageVersion } = binaryModule?.getBinsDir?.() ?? {};
  if (packageVersion !== moduleVersion) {
    throw new Error('Invalid Llama binary version');
  }

  return path.join(binsDir, packageName);
}

export function getBindingPath(binaryDir: string) {
  return path.resolve(binaryDir, 'llama-addon.node');
}

export function getName() {
  const arch = process.arch;
  const platform = getPlatform();

  if (platform === 'mac') {
    if (arch === 'arm64') {
      return 'mac-arm64-metal';
    }
    if (arch === 'x64') {
      return 'mac-x64';
    }
  } else if (platform === 'linux') {
    if (arch === 'x64') {
      return 'linux-x64';
    }
    if (arch === 'arm64') {
      return 'linux-arm64';
    }
    if (arch === 'arm') {
      return 'linux-armv7l';
    }
  } else if (platform === 'win') {
    if (arch === 'x64') {
      return 'win-x64';
    }
    if (arch === 'arm64') {
      return 'win-arm64';
    }
  }

  return null;
}

export type PackageName = Exclude<ReturnType<typeof getName>, null>;

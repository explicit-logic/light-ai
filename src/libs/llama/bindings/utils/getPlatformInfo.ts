import os from 'node:os';
import { getLinuxDistroInfo } from './getLinuxDistroInfo.js';
import type { BinaryPlatform } from './getPlatform.js';

export async function getPlatformInfo(currentPlatform: BinaryPlatform): Promise<{ name: string; version: string }> {
  if (currentPlatform === 'mac')
    return {
      name: 'macOS',
      version: os.release(),
    };
  if (currentPlatform === 'linux') {
    const linuxDistroInfo = await getLinuxDistroInfo();

    return {
      name: linuxDistroInfo.name,
      version: linuxDistroInfo.version,
    };
  }
  if (currentPlatform === 'win')
    return {
      name: 'Windows',
      version: os.release(),
    };

  return {
    name: 'Unknown',
    version: os.release(),
  };
}

export type BinaryPlatformInfo = Awaited<ReturnType<typeof getPlatformInfo>>;

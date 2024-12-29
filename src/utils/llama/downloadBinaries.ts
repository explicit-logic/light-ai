import fs from 'node:fs/promises';

import {
  type PackageName,
  getDir as getPackageDir,
  getPackageJsonPath,
  getName as getPackageName,
  getUrl as getPackageUrl,
} from '@/utils/llama/binaryPackage';

import { download } from '@/utils/download';
import { extractTgz } from '@/utils/extractTgz';

export async function downloadBinaries() {
  const packageName = getPackageName();
  if (!packageName) return;
  const installed = await checkDownloaded(packageName);
  if (installed) return;
  const packageUrl = getPackageUrl(packageName);

  const { start } = await download(packageUrl, onFinishDownloading(packageName));
  await start();
}

function onFinishDownloading(packageName: PackageName) {
  return async (tempFilePath: string) => {
    const packageDir = getPackageDir(packageName);
    !(await fs.exists(packageDir)) && (await fs.mkdir(packageDir, { recursive: true }));

    await extractTgz(tempFilePath, packageDir);
    await fs.rm(tempFilePath, { force: true });
  };
}

async function checkDownloaded(packageName: PackageName) {
  const packageJsonPath = getPackageJsonPath(packageName);

  return await fs.exists(packageJsonPath);
}

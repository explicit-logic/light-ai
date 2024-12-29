import path from 'node:path';
import fs from 'fs-extra';

import type { BuildMetadataFile } from '@/libs/llama/bindings/types';

export const buildMetadataFileName = '_nlcBuildMetadata.json';

export async function getPrebuiltBinaryBuildMetadata(folderPath: string, folderName: string) {
  const buildMetadataFilePath = path.join(folderPath, buildMetadataFileName);

  if (!(await fs.pathExists(buildMetadataFilePath)))
    throw new Error(`Could not find build metadata file for prebuilt build "${folderName}"`);

  const buildMetadata: BuildMetadataFile = await fs.readJson(buildMetadataFilePath);
  return buildMetadata;
}

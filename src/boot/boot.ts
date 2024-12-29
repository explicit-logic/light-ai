import type { Params } from '@/app';
import { downloadBinaries } from '@/utils/llama/downloadBinaries';
import { pullModel } from './pullModel';

export async function boot(params: Params = {}) {
  const { model } = params;

  await downloadBinaries();
  await pullModel(model);
}

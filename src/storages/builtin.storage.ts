import models from '@/resources/models';

export async function getAll() {
  const result = Object.values(models);

  return result;
}

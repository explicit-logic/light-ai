export function includesText(value: string | string[] | null | undefined, textToCheckFor: string | string[], strictCase = false): boolean {
  if (Array.isArray(value)) return value.some((v) => includesText(v, textToCheckFor, strictCase));
  if (typeof value !== 'string') return false;

  if (Array.isArray(textToCheckFor)) return textToCheckFor.some((t) => includesText(value, t, strictCase));

  if (strictCase) return value.includes(textToCheckFor);

  return value.toLowerCase().includes(textToCheckFor.toLowerCase());
}

export function isUrl(text: string, throwOnInvalidUrl = true) {
  if (text.toLowerCase().startsWith('http://') || text.toLowerCase().startsWith('https://')) {
    try {
      new URL(text);
      return true;
    } catch {
      if (throwOnInvalidUrl) throw new Error(`Invalid URL: ${text}`);

      return false;
    }
  }

  return false;
}

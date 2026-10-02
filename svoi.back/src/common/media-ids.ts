const mediaKey = /mediaId$/i;

export function collectMediaIds(
  value: unknown,
  found = new Set<string>(),
): Set<string> {
  if (Array.isArray(value)) {
    for (const item of value) {
      collectMediaIds(item, found);
    }
    return found;
  }

  if (!value || typeof value !== 'object') {
    return found;
  }

  for (const [key, nested] of Object.entries(value)) {
    if (mediaKey.test(key) && typeof nested === 'string' && nested.length > 0) {
      found.add(nested);
      continue;
    }
    collectMediaIds(nested, found);
  }

  return found;
}

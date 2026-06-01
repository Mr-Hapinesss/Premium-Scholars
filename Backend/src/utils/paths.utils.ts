import path from 'path';
import { fileURLToPath } from 'url';

export const getDirname = (importMetaUrl: string) => {
  const filename = fileURLToPath(importMetaUrl);
  return path.dirname(filename);
};
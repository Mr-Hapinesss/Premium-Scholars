/**
 * Strips all HTML tags from a string.
 * Use on any user-supplied content that gets stored and later rendered.
 */
export const sanitizeHtml = (input: string): string => {
  return input
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .trim()
}

/**
 * Trims and collapses excess whitespace in a single-line field.
 */
export const sanitizeField = (input: string): string => {
  return input.replace(/\s+/g, ' ').trim()
}
// Excludes 0/O and 1/I/L so references can be read aloud or retyped without ambiguity.
const alphabet = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

/** Human-friendly, non-sequential order reference such as `BL-7KQ2M9XA`. */
export function generateOrderReference(length = 8): string {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  let code = "";
  for (const byte of bytes) code += alphabet[byte % alphabet.length];
  return `BL-${code}`;
}

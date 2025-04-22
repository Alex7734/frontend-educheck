export const truncate = (text: string, maxLength = 50) =>
  text.length > maxLength ? text.slice(0, maxLength) + '...' : text;

export const capitalize = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1);

export const isSubstring = (text: string, substring: string) =>
  text.toLowerCase().includes(substring.toLowerCase());

export const normalize = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9]/g, '');

export const isNormalizedSubstring = (text: string, substring: string) =>
  normalize(text).includes(normalize(substring));

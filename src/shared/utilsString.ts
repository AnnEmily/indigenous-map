export const assertExhaustive = (_value: never): never => {
  const message = 'expected exhaustive covering of input';
  throw new Error(message);
};

export const insensitiveSort = (a: string, b: string) => {
  return a.localeCompare(b, undefined, { sensitivity: 'base', numeric: true });
};

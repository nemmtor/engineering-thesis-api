type WithMessageField<T extends {}> = {
  message: string | string[];
} & T;

export const objectHasMessageField = <T extends object>(
  obj: T,
): obj is WithMessageField<T> => {
  if (Object.keys(obj).includes('message')) return true;

  return false;
};

export type ObjectWithMessageField = {
  message: any;
};

export const objectHasMessageField = (
  obj: any,
): obj is ObjectWithMessageField => {
  if (Object.keys(obj).includes('message')) return true;

  return false;
};

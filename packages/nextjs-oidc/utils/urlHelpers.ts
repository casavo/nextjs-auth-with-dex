export const isRelative = (url: string) => {
  if (typeof url !== "string") {
    throw new TypeError(`Invalid url: ${url}`);
  }
  return !/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(url);
};

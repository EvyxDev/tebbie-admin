export const toHHMM = (time) => {
  if (!time) return "";
  return time.slice(0, 5);
};

// Formats the given date in YYYYMMDD.
export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const pad = (n: number): string => {
    if (n == 0) {
      return "00";
    }
    if (n < 10) {
      return "0" + n;
    }
    return "" + n;
  };

  return year + pad(month) + pad(day);
};

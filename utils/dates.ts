export const dateAddDay = (date: Date, day: number) => {
  const newDate = new Date(date);
  return new Date(newDate.setDate(newDate.getDate() + day));
};

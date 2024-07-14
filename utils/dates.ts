export const dateAddDay: (date: Date, day: number) => Date = (date, day) => {
  const newDate = new Date(date);
  return new Date(newDate.setDate(newDate.getDate() + day));
};

export function dateFormat(d: Date) {
  if (typeof d.getMonth === "function") {
    var year = d.getFullYear();
    var month = "" + (d.getMonth() + 1).toString().padStart(2, "0");
    var day = "" + d.getDate().toString().padStart(2, "0");
    return year + "/" + month + "/" + day;
  }
  return "";
}

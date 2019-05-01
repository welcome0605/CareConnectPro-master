import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "custumDate"
})
export class DatePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    let currentDate = new Date();
    let splitDate = value.split(" ");
    value = splitDate[0].split("-");
    let mydate = new Date(value[0], value[1] - 1, value[2]);
    if (
      currentDate.getFullYear() !== mydate.getFullYear() ||
      currentDate.getDay() !== mydate.getDay() ||
      currentDate.getMonth() !== mydate.getMonth()
    ) {
      const month = mydate.toLocaleString("en-us", { month: "long" });
      return value[0] + " " + month;
    } else {
      const tmpHour = splitDate[1].split(":");
      const hours = tmpHour[0] > 12 ? tmpHour[0] - 12 : tmpHour[0];
      const am_pm = tmpHour[0] >= 12 ? "PM" : "AM";
      const timePart = `${hours}:${tmpHour[1]} ${am_pm}`;
      return timePart;
    }
  }
}

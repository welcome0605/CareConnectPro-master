import { Observable } from "rxjs";
import { Response } from "@angular/http";

export class BaseMethod {
  handleHttpResponseError$ = (error: Response) => {
    console.log(error);
    return Observable.throw(error.json().error || "Server error");
  };

  logConsoleText = (error: any) => {
    console.log(error);
  };
}

import { OnDestroy } from "@angular/core";
import { Subject, Observable } from "rxjs";

export class BaseComponent implements OnDestroy {
  protected destroy$: Subject<boolean> = new Subject<boolean>();

  constructor() {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
  logConsoleText = (error: any) => {
    console.log(error);
  };
}

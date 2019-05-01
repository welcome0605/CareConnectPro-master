import { NgModule } from "@angular/core";
import { ServerModule } from "@angular/platform-server";
import { AppComponent } from "./components/app/app.component";

@NgModule({
  bootstrap: [AppComponent],
  imports: [ServerModule]
})
export class AppModule {}

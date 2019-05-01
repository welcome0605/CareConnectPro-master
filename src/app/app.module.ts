import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './components/app.component';

//angular modules
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const routes: Routes = [];

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    [RouterModule.forRoot(routes, { enableTracing: true })],
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

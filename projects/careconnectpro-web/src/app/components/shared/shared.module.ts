import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FullCalendarModule } from "ng-fullcalendar";
import { NgbModalModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { EventComponent } from "./event/components/event/event.component";
import { HttpClientModule } from "@angular/common/http";
import { AngularEditorModule } from "@kolkov/angular-editor";
import { DatePipe } from "../../pipes/DatePipe";

@NgModule({
  declarations: [EventComponent, DatePipe],
  imports: [
    CommonModule,
    FullCalendarModule,
    NgbModalModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularEditorModule
  ],
  exports: [
    EventComponent,
    FormsModule,
    ReactiveFormsModule,
    AngularEditorModule,
    DatePipe
  ],
  providers: []
})
export class SharedModule {}

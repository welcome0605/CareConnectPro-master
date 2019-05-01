import { Component, ViewEncapsulation, OnInit, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from "@angular/common";
import { Router, NavigationStart } from '@angular/router';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    title = 'Care Connect Pro Software for Home HealthCare Agencies';

}

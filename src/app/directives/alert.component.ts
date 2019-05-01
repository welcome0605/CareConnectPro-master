import { Component, OnInit, ViewChild } from '@angular/core';

import { Alert, AlertType } from '../models/alert/alert-index';
import { AlertService } from '../services/alert-index';

import { ModalComponent } from '../common/modal.component' ;

@Component({
    moduleId: module.id.toString(),
    selector: 'alert',
    templateUrl: 'alert.component.html'
})

export class AlertComponent {
    alerts: Alert[] = [];
    @ViewChild("errorAlertsModal") modal: ModalComponent;


    constructor(private alertService: AlertService) { }
    
    ngOnInit() {
        this.alertService.getAlert().subscribe((alert: Alert) => {
            if (!alert) {
                // clear alerts when an empty alert is received
                this.alerts = [];
                return;
            }

            // add alert to array
            this.alerts.push(alert);
            this.modal.show();
        });
    }


    removeAlert(alert: Alert) {
        this.alerts = this.alerts.filter(x => x !== alert);
        if (this.alerts.length == 0)
            this.modal.hide();
    }
    
}
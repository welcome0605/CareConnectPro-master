import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AppPrimeNGModule } from "./app.module.primeng";
import { Ho2AccordionComponent } from "../components/shared/ho2-accordion/ho2-accordion.component";
import { Ho2EditHelperComponent } from "../components/shared/ho2-edithelper/ho2edithelper.component";
import { Ho2ToolTipComponent } from "../components/shared/ho2-tooltip/ho2tooltip.component";
import { Ho2StepperComponent } from "../components/shared/ho2-stepper/ho2-stepper.component";
import { WorkflowMgtComponent } from "../components/shared/workflowmgt/workflowmgt.component";

@NgModule({
  imports: [FormsModule, CommonModule, AppPrimeNGModule],
  declarations: [
    Ho2AccordionComponent,
    Ho2EditHelperComponent,
    Ho2ToolTipComponent,
    Ho2StepperComponent,
    WorkflowMgtComponent
  ],
  exports: [
    Ho2AccordionComponent,
    Ho2EditHelperComponent,
    Ho2ToolTipComponent,
    Ho2StepperComponent,
    WorkflowMgtComponent
  ]
})
export class Ho2NgModule {}

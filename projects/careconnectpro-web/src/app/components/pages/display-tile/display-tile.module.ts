// Modules
import { NgModule } from "@angular/core";
import { DisplayTileComponent } from "./display-tile.component";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [DisplayTileComponent],
  imports: [RouterModule, CommonModule],
  exports: [DisplayTileComponent],
  providers: []
})
export class DisplayTileModule {}

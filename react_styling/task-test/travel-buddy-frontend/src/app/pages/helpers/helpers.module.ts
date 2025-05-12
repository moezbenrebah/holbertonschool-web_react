import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HelpersComponent } from './helpers.component';

@NgModule({
  declarations: [HelpersComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: HelpersComponent }]) // Use forChild here
  ]
})
export class HelpersModule { }

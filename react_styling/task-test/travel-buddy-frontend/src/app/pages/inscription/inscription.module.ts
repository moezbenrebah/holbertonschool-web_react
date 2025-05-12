import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InscriptionComponent } from './inscription.component';

@NgModule({
  declarations: [InscriptionComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: InscriptionComponent }]) // Use forChild here
  ]
})
export class InscriptionModule { }

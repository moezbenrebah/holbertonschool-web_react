import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ConnexionComponent } from './connexion.component';

@NgModule({
  declarations: [ConnexionComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: ConnexionComponent }]) // Use forChild here
  ]
})
export class ConnexionModule { }

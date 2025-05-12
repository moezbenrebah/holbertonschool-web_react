import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AjouterProfilComponent } from './ajouter-profil.component';

@NgModule({
  declarations: [AjouterProfilComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: AjouterProfilComponent }]) // Use forChild here
  ]
})
export class AjouterProfilModule { }

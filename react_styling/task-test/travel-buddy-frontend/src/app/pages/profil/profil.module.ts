import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProfilComponent } from './profil.component';

@NgModule({
  declarations: [ProfilComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: ProfilComponent }]) // Use forChild here
  ]
})
export class ProfilModule { }

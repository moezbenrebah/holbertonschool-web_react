import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms'; // Add this import

@Component({
  selector: 'app-ajouter-profil',
  templateUrl: './ajouter-profil.component.html',
  styleUrls: ['./ajouter-profil.component.css'],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    FormsModule // Add this import
  ]
})
export class AjouterProfilComponent {

  onSubmit(form: any, event: Event) {
    event.preventDefault(); // Empêche le rechargement de la page

    const nom = form.value.nom;
    const prenom = form.value.prenom;
    const email = form.value.email;
    const specialites = form.value.specialites;
    const destinations = form.value.destinations;
    const langues = form.value.langues;
    const description = form.value.description;

    fetch('/ajouter-profil', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nom, prenom, email, specialites, destinations, langues, description })
    })
    .then(response => {
      if (response.ok) {
        // Redirige vers la page d'accueil après l'ajout du profil
        window.location.href = '/';
      } else {
        // Affiche un message d'erreur à l'utilisateur
        console.error('Erreur lors de l\'ajout du profil');
        alert('Une erreur est survenue lors de l\'ajout du profil.');
      }
    })
    .catch(error => {
      console.error('Erreur lors de l\'ajout du profil :', error);
      alert('Une erreur est survenue lors de l\'ajout du profil.');
    });
  }
}
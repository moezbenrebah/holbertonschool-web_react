import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Helper {
  id: number;
  name: string;
  prenom: string;
  nom: string;
  city: string;
  rating: number;
  imageUrl: string;
  description: string;
  specialites: string[];
  destinations: string[];
  langues: string[];
}

@Component({
  selector: 'app-helpers',
  templateUrl: './helpers.component.html',
  styleUrls: ['./helpers.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class HelpersComponent implements OnInit {
  selectedCity: string = '';
  filteredHelpers: Helper[] = [];
  guides: Helper[] = [
    {
      id: 1,
      name: 'Jean Dupont',
      prenom: 'Jean',
      nom: 'Dupont',
      city: 'Paris',
      rating: 4.8,
      imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      description: 'Guide expert de Paris avec 5 ans d\'expérience',
      specialites: ['Histoire', 'Architecture'],
      destinations: ['Paris', 'Versailles'],
      langues: ['Français', 'Anglais']
    },
    {
      id: 2,
      name: 'Marie Martin',
      prenom: 'Marie',
      nom: 'Martin',
      city: 'Lyon',
      rating: 4.9,
      imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      description: 'Passionnée par l\'histoire de Lyon',
      specialites: ['Histoire', 'Gastronomie'],
      destinations: ['Lyon', 'Vieux Lyon'],
      langues: ['Français', 'Anglais', 'Italien']
    }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.selectedCity = params['ville'] || '';
      this.filterHelpers();
    });
  }

  filterHelpers() {
    if (this.selectedCity) {
      this.filteredHelpers = this.guides.filter(helper =>
        helper.destinations.some(destination =>
          destination.toLowerCase().includes(this.selectedCity.toLowerCase())
        )
      );
    } else {
      this.filteredHelpers = this.guides;
    }
  }

  onImageError(event: any): void {
    event.target.src = 'https://via.placeholder.com/400x400?text=Guide';
  }
}
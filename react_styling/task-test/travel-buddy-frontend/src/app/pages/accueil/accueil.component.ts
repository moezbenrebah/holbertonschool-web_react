import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Destination {
  name: string;
  description: string;
  imageUrl: string;
}

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule]
})
export class AccueilComponent {
  currentYear = new Date().getFullYear();
  newsletterEmail = '';
  searchQuery: string = '';

  destinations!: Destination[];
  testimonials!: any[];

  constructor(private router: Router) {
    this.destinations = [
      {
        name: 'Paris',
        description: 'Découvrez la ville lumière avec nos guides parisiens passionnés.',
        imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80'
      },
      {
        name: 'Tokyo',
        description: 'Explorez la culture japonaise avec nos guides locaux.',
        imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80'
      },
      {
        name: 'New York',
        description: 'Visitez la Big Apple comme un véritable New-Yorkais.',
        imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80'
      }
    ];

    this.testimonials = [
      {
        userName: 'Sophie Martin',
        comment: 'Une expérience inoubliable avec notre guide à Paris. Je recommande vivement !',
        destination: 'Paris',
        userImage: 'https://randomuser.me/api/portraits/women/1.jpg'
      },
      {
        userName: 'Jean Dupont',
        comment: 'Découverte de Tokyo comme un local grâce à notre guide. Parfait !',
        destination: 'Tokyo',
        userImage: 'https://randomuser.me/api/portraits/men/1.jpg'
      }
    ];
  }

  ngOnInit(): void {
    // Initialization logic if needed
  }

  onImageError(event: any, destination: Destination): void {
    event.target.src = `https://via.placeholder.com/600x400?text=${destination.name}`;
  }

  onNewsletterSubmit(): void {
    if (this.newsletterEmail) {
      console.log('Newsletter subscription for:', this.newsletterEmail);
      this.newsletterEmail = '';
    }
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/helpers'], { queryParams: { ville: this.searchQuery } });
    }
  }

  scrollToSearchBar(): void {
    const searchBar = document.querySelector('.search-bar');
    if (searchBar) {
      const offset = -100; // Adjust this value as needed
      const topPosition = searchBar.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top: topPosition, behavior: 'smooth' });
    }
  }

  // Add this new method for setting search query from suggestions
  setSearchQuery(event: Event, query: string): void {
    event.preventDefault();
    this.searchQuery = query;
    // Optionally auto-submit the search
    this.onSearch();
  }
}
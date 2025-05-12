import { Component, OnInit } from '@angular/core';
import { TourService } from '../../core/services/tour.service';
import { DatePipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tours',
  templateUrl: './tours.component.html',
  styleUrls: ['./tours.component.css'],
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule]
})
export class ToursComponent implements OnInit {
  tours: any[] = [];
  filteredTours: any[] = [];
  loading = true;
  error = '';
  
  // Filter properties
  searchLocation = '';
  minPrice = 0;
  maxPrice = 1000;
  
  // Sorting
  sortOption = 'date-desc'; // Default sort
  
  constructor(
    private tourService: TourService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTours();
  }
  
  loadTours(): void {
    this.tourService.getPublishedTours().subscribe({
      next: (tours) => {
        this.tours = tours;
        this.filteredTours = [...tours];
        this.sortTours(); // Apply default sorting
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des tours.';
        this.loading = false;
        console.error('Error loading tours:', err);
      }
    });
  }
  
  applyFilters(): void {
    const filters = {
      location: this.searchLocation,
      minPrice: this.minPrice > 0 ? this.minPrice : undefined,
      maxPrice: this.maxPrice < 1000 ? this.maxPrice : undefined
    };
    
    this.tourService.getPublishedTours(filters).subscribe({
      next: (tours) => {
        this.filteredTours = tours;
        this.sortTours(); // Apply current sorting
      },
      error: (err) => {
        console.error('Error applying filters:', err);
      }
    });
  }
  
  resetFilters(): void {
    this.searchLocation = '';
    this.minPrice = 0;
    this.maxPrice = 1000;
    this.filteredTours = [...this.tours];
    this.sortTours(); // Apply current sorting
  }
  
  sortTours(): void {
    switch(this.sortOption) {
      case 'price-asc':
        this.filteredTours.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        this.filteredTours.sort((a, b) => b.price - a.price);
        break;
      case 'date-asc':
        this.filteredTours.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'date-desc':
        this.filteredTours.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      default:
        // Default sort by date descending
        this.filteredTours.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
  }
  
  isNewTour(tour: any): boolean {
    // Check if the tour was created in the last 7 days
    const createdAt = new Date(tour.createdAt);
    const now = new Date();
    const differenceInTime = now.getTime() - createdAt.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    return differenceInDays <= 7;
  }
  
  viewTourDetails(tour: any): void {
    console.log('Navigating to tour with ID:', tour);
    
    // Early exit if tour is undefined or null
    if (!tour) {
      console.error('Cannot navigate to undefined or null tour');
      return;
    }
    
    // Extract the correct tour ID
    const tourId = tour.tour_id;
    
    if (!tourId) {
      console.error('Tour ID is missing:', tour);
      return;
    }
    
    console.log(`Navigating to tour detail with ID: ${tourId}`);
    
    // Use Angular's router for navigation
    this.router.navigate(['/tours', tourId]);
  }
  
  getGuideNameFromTour(tour: any): string {
    if (tour.Guide && tour.Guide.User) {
      return `${tour.Guide.User.prenom} ${tour.Guide.User.nom}`;
    } else if (tour.guide && tour.guide.user) {
      return `${tour.guide.user.prenom} ${tour.guide.user.nom}`;
    }
    return 'Guide inconnu';
  }

  // Get appropriate tour image based on location or use default
  getTourImage(tour: any): string {
    // Map of locations to their corresponding images
    const locationImages: {[key: string]: string} = {
      'Paris': 'assets/images/paris.jpg',
      'Tokyo': 'assets/images/tokyo.jpg',
      'New York': 'assets/images/newyork.jpg'
    };
    
    // Check if the location has a specific image
    if (tour.location) {
      // Try to find exact match
      if (locationImages[tour.location]) {
        return locationImages[tour.location];
      }
      
      // Try to find partial match
      for (const location in locationImages) {
        if (tour.location.toLowerCase().includes(location.toLowerCase())) {
          return locationImages[location];
        }
      }
    }
    
    // Return default image if no match is found
    return 'assets/images/paris.jpg';
  }
}

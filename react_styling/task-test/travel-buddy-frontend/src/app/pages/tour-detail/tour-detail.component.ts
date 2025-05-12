import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TourService } from '../../core/services/tour.service';
import { CommonModule, DatePipe } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { ProfileImagePipe } from '../../shared/pipes/profile-image.pipe';

@Component({
  selector: 'app-tour-detail',
  templateUrl: './tour-detail.component.html',
  styleUrls: ['./tour-detail.component.css'],
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule, ProfileImagePipe]
})
export class TourDetailComponent implements OnInit {
  tour: any = null;
  loading = true;
  error = '';
  isAuthenticated = false;
  participantCount = 1;
  tourId: string | null = null;
  activeTab = 'description'; // Default active tab

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tourService: TourService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Check authentication status
    this.authService.isAuthenticated().subscribe(isAuth => {
      this.isAuthenticated = isAuth;
    });

    // Get tour ID from route params
    this.route.paramMap.subscribe(params => {
      this.tourId = params.get('id');
      console.log('Tour ID from route:', this.tourId);
      
      if (!this.tourId) {
        this.error = 'Tour introuvable - ID manquant';
        this.loading = false;
        return;
      }
      
      this.loadTourDetails(this.tourId);
    });
  }
  
  loadTourDetails(id: string): void {
    console.log('Loading tour details for ID:', id);
    this.loading = true;
    this.error = '';
    
    this.tourService.getTourById(id).subscribe({
      next: (response) => {
        console.log('Tour API response:', response);
        
        // Handle the tour data, accounting for different response formats
        if (response && response.tour) {
          this.tour = response.tour;
        } else if (response) {
          this.tour = response;
        } else {
          this.error = 'Format de réponse invalide';
        }
        
        this.loading = false;
        
        // Scroll to top when tour data is loaded
        window.scrollTo(0, 0);
      },
      error: (err) => {
        console.error('Error fetching tour:', err);
        this.error = 'Erreur lors du chargement du tour. Veuillez réessayer.';
        this.loading = false;
      }
    });
  }

  bookTour(): void {
    console.log('Booking tour, authentication status:', this.isAuthenticated);
    
    // Get current auth status directly from the token
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      console.log('Token exists, proceeding to booking page');
      
      // Use Angular's router instead of window.location.href
      // This preserves the Angular routing context
      this.router.navigate(['/book-tour', this.tour.tour_id], {
        queryParams: { participants: this.participantCount },
        // Force Angular navigation to not be replaced in history
        // and prevent any guards from redirecting if possible
        replaceUrl: false,
        skipLocationChange: false
      });
      
      console.log('Router navigation triggered to /book-tour/' + this.tour.tour_id);
    } else {
      console.log('No token found, redirecting to login');
      // Redirect to login if not authenticated
      this.router.navigate(['/connexion'], { 
        queryParams: { returnUrl: `/tours/${this.tour.tour_id}` } 
      });
    }
  }
  
  contactGuide(): void {
    if (!this.isAuthenticated) {
      // Redirect to login if not authenticated
      this.router.navigate(['/connexion'], { 
        queryParams: { returnUrl: `/tours/${this.tour.tour_id}` } 
      });
      return;
    }
    
    // Show contact modal or navigate to messaging page
    alert('Fonctionnalité de contact du guide en cours de développement');
  }

  goBack(): void {
    this.router.navigate(['/tours']);
  }
  
  // Calculate the total price based on number of participants
  getTotalPrice(): number {
    return (this.tour?.price || 0) * this.participantCount;
  }
  
  // Format date with day of week in French
  formatDateWithDay(date: string): string {
    if (!date) return '';
    
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    
    return new Date(date).toLocaleDateString('fr-FR', options);
  }

  // Get appropriate tour image based on location or use default
  getTourImage(): string {
    if (!this.tour || !this.tour.location) return 'assets/images/paris.jpg';
    
    // Map of locations to their corresponding images
    const locationImages: {[key: string]: string} = {
      'Paris': 'assets/images/paris.jpg',
      'Tokyo': 'assets/images/tokyo.jpg',
      'New York': 'assets/images/newyork.jpg'
    };
    
    // Check if the location has a specific image
    // Try to find exact match
    if (locationImages[this.tour.location]) {
      return locationImages[this.tour.location];
    }
    
    // Try to find partial match
    for (const location in locationImages) {
      if (this.tour.location.toLowerCase().includes(location.toLowerCase())) {
        return locationImages[location];
      }
    }
    
    // Return default image if no match is found
    return 'assets/images/paris.jpg';
  }
  
  // Get guide name from tour object with null safety
  getGuideName(): string {
    if (this.tour?.Guide?.User) {
      return `${this.tour.Guide.User.prenom} ${this.tour.Guide.User.nom}`;
    }
    return 'Guide local';
  }
  
  // Switch tabs
  changeTab(tabName: string): void {
    this.activeTab = tabName;
  }
  
  // Navigate gallery images
  selectImage(index: number): void {
    // This is a placeholder for gallery functionality
    // You would implement actual gallery navigation here
    const dots = document.querySelectorAll('.gallery-dot');
    dots.forEach(dot => dot.classList.remove('active'));
    if (dots[index]) {
      dots[index].classList.add('active');
    }
  }
}
import { Component, OnInit } from '@angular/core';
import { TourService } from '../../core/services/tour.service';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-guide-dashboard',
  templateUrl: './guide-dashboard.component.html',
  styleUrl: './guide-dashboard.component.css',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class GuideDashboardComponent implements OnInit {
  tours: any[] = [];
  pendingBookingRequests: any[] = [];
  loading = true;
  error = '';
  
  // Add missing properties
  summary = {
    totalTours: 0,
    publishedTours: 0,
    totalBookings: 0,
    totalParticipants: 0,
    totalRevenue: 0,
    pendingRequests: 0
  };
  
  // Search, filter, and sort properties
  searchTerm = '';
  filterStatus = 'all'; // 'all', 'published', 'draft'
  sortBy = 'date'; // Default sort field
  sortDirection = 'desc'; // 'asc' or 'desc'

  constructor(
    private tourService: TourService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadGuideStats();
    this.loadPendingRequests();
  }

  loadGuideStats() {
    this.loading = true;
    this.tourService.getGuideStats().subscribe({
      next: (response) => {
        console.log('Guide stats response:', response);
        
        // Check the structure of the response to handle both array and object with tours property
        if (response && response.tours) {
          this.tours = response.tours;
          this.summary = response.summary || {
            totalTours: 0,
            publishedTours: 0,
            totalBookings: 0,
            totalParticipants: 0,
            totalRevenue: 0,
            pendingRequests: 0
          };
        } else if (Array.isArray(response)) {
          // If response is directly an array of tours
          this.tours = response;
          
          // Calculate summary if not provided
          this.summary = {
            totalTours: this.tours.length,
            publishedTours: this.tours.filter(t => t.status === 'published').length,
            totalBookings: 0,
            totalParticipants: 0,
            totalRevenue: 0,
            pendingRequests: 0
          };
        } else {
          console.warn('Unexpected response format for guide stats:', response);
          this.tours = [];
        }
        
        // Calculate estimated revenue if not provided by API
        if (!this.summary.totalRevenue) {
          this.summary.totalRevenue = this.tours.reduce((sum, tour) => {
            return sum + (tour.stats?.estimatedRevenue || 0);
          }, 0);
        }
        
        this.loading = false;
        
        // Log the processed data
        console.log('Processed tours data:', this.tours);
        console.log('Processed summary data:', this.summary);
      },
      error: (err) => {
        console.error('Error loading guide statistics:', err);
        this.error = 'Une erreur est survenue lors du chargement de vos statistiques.';
        this.loading = false;
      }
    });
  }

  loadPendingRequests() {
    this.tourService.getBookingRequests().subscribe({
      next: (requests) => {
        this.pendingBookingRequests = requests.filter(req => req.approval_status === 'pending');
        this.summary.pendingRequests = this.pendingBookingRequests.length;
      },
      error: (err) => {
        console.error('Error loading pending booking requests:', err);
      }
    });
  }

  // Navigation methods
  createNewTour() {
    this.router.navigate(['/publish-tour']);
  }

  viewBookingRequests() {
    this.router.navigate(['/booking-requests']);
  }

  navigateToRequests() {
    this.router.navigate(['/booking-requests']);
  }

  navigateToCreateTour() {
    this.router.navigate(['/publish-tour']);
  }

  navigateToEditTour(tourId: string) {
    this.router.navigate(['/edit-tour', tourId]);
  }

  viewTourDetails(tourId: string) {
    this.router.navigate(['/edit-tour', tourId]);
  }

  // Sorting methods
  setSortBy(field: string) {
    if (this.sortBy === field) {
      // Toggle direction if clicking on the same field
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Set new field and default to ascending
      this.sortBy = field;
      this.sortDirection = 'asc';
    }
  }

  getSortIndicator(field: string): string {
    if (this.sortBy !== field) return '';
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }

  // Filtering methods
  getFilteredTours() {
    // Start with status filter
    let filtered = this.tours;
    
    if (this.filterStatus !== 'all') {
      filtered = filtered.filter(tour => tour.status === this.filterStatus);
    }
    
    // Apply search filter if there's a search term
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const search = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(tour => 
        tour.title?.toLowerCase().includes(search) || 
        tour.location?.toLowerCase().includes(search)
      );
    }
    
    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      let valA, valB;
      
      switch (this.sortBy) {
        case 'title':
          valA = a.title || '';
          valB = b.title || '';
          break;
        case 'location':
          valA = a.location || '';
          valB = b.location || '';
          break;
        case 'date':
          valA = new Date(a.date || 0).getTime();
          valB = new Date(b.date || 0).getTime();
          break;
        case 'bookings':
          valA = a.stats?.totalBookings || 0;
          valB = b.stats?.totalBookings || 0;
          break;
        case 'participants':
          valA = a.stats?.totalParticipants || 0;
          valB = b.stats?.totalParticipants || 0;
          break;
        case 'revenue':
          valA = a.stats?.estimatedRevenue || 0;
          valB = b.stats?.estimatedRevenue || 0;
          break;
        default:
          valA = a[this.sortBy] || 0;
          valB = b[this.sortBy] || 0;
      }
      
      // Handle string comparison
      if (typeof valA === 'string' && typeof valB === 'string') {
        const comparison = valA.localeCompare(valB);
        return this.sortDirection === 'asc' ? comparison : -comparison;
      }
      
      // Handle numeric comparison
      const comparison = valA > valB ? 1 : valA < valB ? -1 : 0;
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
    
    return filtered;
  }

  // Utility methods
  formatDate(dateStr: string | Date): string {
    const date = dateStr instanceof Date ? dateStr : new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  }
  
  formatCurrency(amount: number | undefined): string {
    if (amount === undefined || amount === null) return '0,00 €';
    return amount.toLocaleString('fr-FR', { 
      style: 'currency', 
      currency: 'EUR' 
    });
  }
  
  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'published': return 'badge-success';
      case 'draft': return 'badge-secondary';
      case 'active': return 'badge-primary';
      case 'inactive': return 'badge-danger';
      default: return 'badge-secondary';
    }
  }
}

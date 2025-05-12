import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { TourService, Tour } from '../../services/tour.service';
import { GuideService, Guide, GuideApplication } from '../../services/guide.service';
import { AuthService, User } from '../../services/auth.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

interface Booking {
  id: string;
  tour?: Tour;
  user?: User;
  bookingDate: Date;
  participants: number;
  totalPrice: number;
  status: string;
}

interface Activity {
  id: string;
  type: string;
  title: string;
  time: Date;
}

interface Stats {
  totalUsers: number;
  totalTours: number;
  totalBookings: number;
  totalGuides: number;
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  providers: [DatePipe]
})
export class AdminDashboardComponent implements OnInit {
  // Dashboard state
  activeTab = 'overview';
  dateRange = '30d';
  
  // Loading states
  isLoadingUsers = false;
  isLoadingTours = false;
  isLoadingGuides = false;
  
  // Error states
  userLoadError = '';
  tourLoadError = '';
  guideLoadError = '';
  
  // Stats
  stats: Stats = {
    totalUsers: 0,
    totalTours: 0,
    totalBookings: 0,
    totalGuides: 0
  };
  
  // Overview data
  recentActivities: Activity[] = [];
  
  // Users data
  users: User[] = [];
  filteredUsers: User[] = [];
  userSearch = '';
  currentUserPage = 1;
  totalUserPages = 1;
  
  // Tours data
  tours: Tour[] = [];
  filteredTours: Tour[] = [];
  tourSearch = '';
  currentTourPage = 1;
  totalTourPages = 1;
  
  // Bookings data
  bookings: Booking[] = [];
  filteredBookings: Booking[] = [];
  bookingSearch = '';
  currentBookingPage = 1;
  totalBookingPages = 1;
  
  // Guides data
  guides: Guide[] = [];
  filteredGuides: Guide[] = [];
  guideSearch = '';
  currentGuidePage = 1;
  totalGuidePages = 1;
  pendingGuideApplications: GuideApplication[] = [];
  
  // Forms
  settingsForm: FormGroup;
  moderationForm: FormGroup;
  
  // Modals
  showConfirmModal = false;
  confirmModalTitle = '';
  confirmModalMessage = '';
  confirmModalButton = 'Confirmer';
  confirmModalDanger = false;
  confirmAction: Function = () => {};

  constructor(
    private userService: UserService,
    private tourService: TourService,
    private guideService: GuideService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.settingsForm = this.fb.group({
      siteName: ['Travel Buddy', Validators.required],
      siteDescription: ['Your favorite travel service', Validators.required],
      contactEmail: ['contact@travelbuddy.com', [Validators.required, Validators.email]],
      commissionRate: [10, [Validators.required, Validators.min(0), Validators.max(100)]],
      maintenanceMode: [false],
      enableRegistration: [true]
    });
    
    this.moderationForm = this.fb.group({
      reviewModeration: [true],
      tourApproval: [true]
    });
  }

  ngOnInit(): void {
    // Start by showing the users tab by default to ensure data is visible
    this.activeTab = 'users';
    console.log('Initial activeTab set to:', this.activeTab);
    
    this.loadDashboardData();
  }

  // Load all data needed for the dashboard
  loadDashboardData(): void {
    console.log('Loading dashboard data...');
    this.loadStats();
    this.loadRecentActivities();
    this.loadUsers();
    this.loadTours();
    this.loadBookings();
    this.loadGuides();
    this.loadPendingGuideApplications();
  }

  // Stats loading
  loadStats(): void {
    // Users count
    this.userService.getUsersCount().pipe(
      catchError(error => {
        console.error('Error loading user count:', error);
        return this.userService.getMockUsersCount();
      })
    ).subscribe((count: number) => {
      this.stats.totalUsers = count || 0;
    });
    
    // Tours count
    this.tourService.getToursCount().pipe(
      catchError(error => {
        console.error('Error loading tour count:', error);
        return of(15); // Default mock value
      })
    ).subscribe((count: number) => {
      this.stats.totalTours = count || 0;
    });
    
    // Set default mock values for bookings and guides
    this.stats.totalBookings = 128;
    
    // Guides count - get it from the guides array length after loading guides
    this.guideService.getGuides().pipe(
      catchError(error => {
        console.error('Error loading guides count:', error);
        return this.guideService.getMockGuides();
      })
    ).subscribe((guides: Guide[]) => {
      this.stats.totalGuides = guides.length || 0;
    });
  }

  // Activities loading
  loadRecentActivities(): void {
    // In a real application, you would call your API to get recent activities
    // For demonstration purposes, we're using mock data
    this.recentActivities = [
      {
        id: '1',
        type: 'booking',
        title: 'Nouvelle réservation pour "Tour de Paris"',
        time: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
      },
      {
        id: '2',
        type: 'user',
        title: 'Nouvel utilisateur inscrit: Jean Dupont',
        time: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
      },
      {
        id: '3',
        type: 'tour',
        title: 'Nouveau tour publié: "Visite de Nice"',
        time: new Date(Date.now() - 1000 * 60 * 60 * 5) // 5 hours ago
      },
      {
        id: '4',
        type: 'guide',
        title: 'Nouvelle demande de guide: Marie Martin',
        time: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
      }
    ];
  }

  // User management
  loadUsers(): void {
    this.isLoadingUsers = true;
    this.userLoadError = '';
    
    this.userService.getUsers().pipe(
      catchError(error => {
        console.error('Error loading users:', error);
        this.userLoadError = 'Impossible de charger les utilisateurs. Utilisation des données de démo.';
        return this.userService.getMockUsers();
      }),
      finalize(() => {
        this.isLoadingUsers = false;
      })
    ).subscribe((users: User[]) => {
      console.log('Users loaded:', users);
      // Ensure all users have the active property set
      this.users = users.map(user => ({
        ...user,
        active: user.active ?? true // Default to true if active is undefined
      }));
      this.filteredUsers = [...this.users];
      this.calculateUserPagination();
    });
  }

  searchUsers(): void {
    if (!this.userSearch.trim()) {
      this.filteredUsers = [...this.users];
    } else {
      const search = this.userSearch.toLowerCase().trim();
      this.filteredUsers = this.users.filter(user => 
        (user.prenom?.toLowerCase() || '').includes(search) || 
        (user.nom?.toLowerCase() || '').includes(search) || 
        (user.email?.toLowerCase() || '').includes(search)
      );
    }
    this.calculateUserPagination();
  }

  calculateUserPagination(): void {
    // Assuming 10 items per page
    this.totalUserPages = Math.ceil(this.filteredUsers.length / 10);
    if (this.currentUserPage > this.totalUserPages) {
      this.currentUserPage = 1;
    }
  }

  editUser(user: User): void {
    // Implement edit user functionality
    console.log('Edit user:', user);
    // Typically would open a modal or navigate to a user edit page
  }

  toggleUserStatus(user: User): void {
    // Ensure active property is a boolean before using it
    const isActive = !!user.active;
    
    this.confirmModalTitle = isActive ? 'Suspendre l\'utilisateur' : 'Activer l\'utilisateur';
    this.confirmModalMessage = isActive 
      ? `Êtes-vous sûr de vouloir suspendre l'utilisateur ${user.prenom} ${user.nom}?` 
      : `Êtes-vous sûr de vouloir réactiver l'utilisateur ${user.prenom} ${user.nom}?`;
    this.confirmModalButton = 'Confirmer';
    this.confirmModalDanger = isActive;
    this.confirmAction = () => {
      user.active = !isActive;
      this.userService.updateUser(user).subscribe(() => {
        // Success handling
        this.closeConfirmModal();
      });
    };
    this.showConfirmModal = true;
  }

  confirmDeleteUser(user: User): void {
    this.confirmModalTitle = 'Supprimer l\'utilisateur';
    this.confirmModalMessage = `Êtes-vous sûr de vouloir supprimer définitivement l'utilisateur ${user.prenom} ${user.nom}? Cette action est irréversible.`;
    this.confirmModalButton = 'Supprimer';
    this.confirmModalDanger = true;
    this.confirmAction = () => {
      this.userService.deleteUser(user.user_id.toString()).subscribe(() => {
        // Remove user from the array
        this.users = this.users.filter(u => u.user_id !== user.user_id);
        this.searchUsers(); // Refresh filtered list
        this.closeConfirmModal();
      });
    };
    this.showConfirmModal = true;
  }

  exportUsers(): void {
    // Implement export functionality
    console.log('Exporting users data');
    // This would typically generate a CSV or Excel file with user data
  }

  // Tour management
  loadTours(): void {
    this.isLoadingTours = true;
    this.tourLoadError = '';
    
    this.tourService.getTours().pipe(
      catchError(error => {
        console.error('Error loading tours:', error);
        this.tourLoadError = 'Impossible de charger les tours. Utilisation des données de démo.';
        return this.tourService.getMockTours();
      }),
      finalize(() => {
        this.isLoadingTours = false;
      })
    ).subscribe((tours: Tour[]) => {
      console.log('Tours loaded:', tours);
      this.tours = tours.map(tour => ({
        ...tour,
        active: tour.active ?? true // Default to true if active is undefined
      }));
      this.filteredTours = [...this.tours];
      this.calculateTourPagination();
    });
  }

  searchTours(): void {
    if (!this.tourSearch.trim()) {
      this.filteredTours = [...this.tours];
    } else {
      const search = this.tourSearch.toLowerCase().trim();
      this.filteredTours = this.tours.filter(tour => 
        (tour.title?.toLowerCase() || '').includes(search) || 
        (tour.location?.toLowerCase() || '').includes(search)
      );
    }
    this.calculateTourPagination();
  }

  calculateTourPagination(): void {
    // Assuming 10 items per page
    this.totalTourPages = Math.ceil(this.filteredTours.length / 10);
    if (this.currentTourPage > this.totalTourPages) {
      this.currentTourPage = 1;
    }
  }

  getGuideName(tour: Tour): string {
    // If the guide is already loaded with user info
    if (tour.guide && tour.guide.user) {
      return `${tour.guide.user.prenom} ${tour.guide.user.nom}`;
    }
    
    // Look up the guide from our guides array using guide_id
    if (tour.guide_id && this.guides.length > 0) {
      const guide = this.guides.find(g => g.guide_id === tour.guide_id || g.id === tour.guide_id);
      if (guide && guide.user) {
        return `${guide.user.prenom} ${guide.user.nom}`;
      }
    }
    
    // Try to get guide ID information
    const guideId = tour.guide_id || 'Unknown';
    return `Guide ID: ${guideId}`;
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'danger';
      case 'completed': return 'info';
      default: return '';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'active': return 'Actif';
      case 'pending': return 'En attente';
      case 'cancelled': return 'Annulé';
      case 'completed': return 'Terminé';
      default: return status;
    }
  }

  viewTourDetails(tour: Tour): void {
    // Implement view details functionality
    console.log('View tour details:', tour);
  }

  editTour(tour: Tour): void {
    // Implement edit tour functionality
    console.log('Edit tour:', tour);
  }

  toggleTourStatus(tour: Tour): void {
    // Ensure active property is a boolean
    const isActive = !!tour.active;
    
    this.confirmModalTitle = isActive ? 'Désactiver le tour' : 'Activer le tour';
    this.confirmModalMessage = isActive 
      ? `Êtes-vous sûr de vouloir désactiver le tour "${tour.title}"?` 
      : `Êtes-vous sûr de vouloir activer le tour "${tour.title}"?`;
    this.confirmModalButton = 'Confirmer';
    this.confirmModalDanger = isActive;
    this.confirmAction = () => {
      tour.active = !isActive;
      this.tourService.updateTour(tour).subscribe(() => {
        // Success handling
        this.closeConfirmModal();
      });
    };
    this.showConfirmModal = true;
  }

  confirmDeleteTour(tour: Tour): void {
    this.confirmModalTitle = 'Supprimer le tour';
    this.confirmModalMessage = `Êtes-vous sûr de vouloir supprimer définitivement le tour "${tour.title}"? Cette action est irréversible.`;
    this.confirmModalButton = 'Supprimer';
    this.confirmModalDanger = true;
    this.confirmAction = () => {
      this.tourService.deleteTour(tour.tour_id).subscribe(() => {
        // Remove tour from the array
        this.tours = this.tours.filter(t => t.tour_id !== tour.tour_id);
        this.searchTours(); // Refresh filtered list
        this.closeConfirmModal();
      });
    };
    this.showConfirmModal = true;
  }

  exportTours(): void {
    // Implement export functionality
    console.log('Exporting tours data');
  }

  // Booking management
  loadBookings(): void {
    // In a real application, you would call your API to get bookings
    // For demonstration purposes, we're using mock data
    this.bookings = [
      {
        id: '1',
        tour: {
          tour_id: '1',
          title: 'Tour de Paris',
          description: 'Découvrez Paris',
          guide_id: '1',
          location: 'Paris',
          price: 50,
          date: new Date(),
          duration: 3,
          status: 'active',
          active: true
        },
        user: {
          user_id: 1,
          prenom: 'Jean',
          nom: 'Dupont',
          email: 'jean@example.com',
          role: 'user',
          active: true,
          profileImage: ''
        },
        bookingDate: new Date(),
        participants: 2,
        totalPrice: 100,
        status: 'confirmed'
      },
      {
        id: '2',
        tour: {
          tour_id: '2',
          title: 'Tour de Lyon',
          description: 'Découvrez Lyon',
          guide_id: '2',
          location: 'Lyon',
          price: 45,
          date: new Date(),
          duration: 4,
          status: 'active',
          active: true
        },
        user: {
          user_id: 2,
          prenom: 'Marie',
          nom: 'Martin',
          email: 'marie@example.com',
          role: 'user',
          active: true,
          profileImage: ''
        },
        bookingDate: new Date(),
        participants: 3,
        totalPrice: 135,
        status: 'pending'
      }
    ];
    this.filteredBookings = [...this.bookings];
    this.calculateBookingPagination();
  }

  searchBookings(): void {
    if (!this.bookingSearch.trim()) {
      this.filteredBookings = [...this.bookings];
    } else {
      const search = this.bookingSearch.toLowerCase().trim();
      this.filteredBookings = this.bookings.filter(booking => 
        (booking.tour?.title?.toLowerCase() || '').includes(search) || 
        (booking.user?.prenom?.toLowerCase() || '').includes(search) || 
        (booking.user?.nom?.toLowerCase() || '').includes(search) || 
        booking.id.toLowerCase().includes(search)
      );
    }
    this.calculateBookingPagination();
  }

  calculateBookingPagination(): void {
    // Assuming 10 items per page
    this.totalBookingPages = Math.ceil(this.filteredBookings.length / 10);
    if (this.currentBookingPage > this.totalBookingPages) {
      this.currentBookingPage = 1;
    }
  }

  getBookingStatusClass(status: string): string {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'danger';
      case 'completed': return 'info';
      default: return '';
    }
  }

  getBookingStatusLabel(status: string): string {
    switch (status) {
      case 'confirmed': return 'Confirmée';
      case 'pending': return 'En attente';
      case 'cancelled': return 'Annulée';
      case 'completed': return 'Terminée';
      default: return status;
    }
  }

  viewBookingDetails(booking: Booking): void {
    // Implement view details functionality
    console.log('View booking details:', booking);
  }

  editBooking(booking: Booking): void {
    // Implement edit booking functionality
    console.log('Edit booking:', booking);
  }

  confirmDeleteBooking(booking: Booking): void {
    this.confirmModalTitle = 'Supprimer la réservation';
    this.confirmModalMessage = `Êtes-vous sûr de vouloir supprimer définitivement la réservation #${booking.id}? Cette action est irréversible.`;
    this.confirmModalButton = 'Supprimer';
    this.confirmModalDanger = true;
    this.confirmAction = () => {
      // In a real app, you would call the API to delete the booking
      this.bookings = this.bookings.filter(b => b.id !== booking.id);
      this.searchBookings(); // Refresh filtered list
      this.closeConfirmModal();
    };
    this.showConfirmModal = true;
  }

  exportBookings(): void {
    // Implement export functionality
    console.log('Exporting bookings data');
  }

  // Guide management
  loadGuides(): void {
    this.isLoadingGuides = true;
    this.guideLoadError = '';
    
    this.guideService.getGuides().pipe(
      catchError(error => {
        console.error('Error loading guides:', error);
        this.guideLoadError = 'Impossible de charger les guides. Utilisation des données de démo.';
        return this.guideService.getMockGuides();
      }),
      finalize(() => {
        this.isLoadingGuides = false;
      })
    ).subscribe((guides: Guide[]) => {
      console.log('Guides loaded:', guides);
      this.guides = guides.map(guide => ({
        ...guide,
        active: guide.active ?? true // Default to true if active is undefined
      }));
      this.filteredGuides = [...this.guides];
      this.calculateGuidePagination();
    });
  }

  loadPendingGuideApplications(): void {
    // In a real application, you would call your API to get pending guide applications
    this.guideService.getMockPendingApplications().subscribe((applications: GuideApplication[]) => {
      this.pendingGuideApplications = applications;
    });
  }

  searchGuides(): void {
    if (!this.guideSearch.trim()) {
      this.filteredGuides = [...this.guides];
    } else {
      const search = this.guideSearch.toLowerCase().trim();
      this.filteredGuides = this.guides.filter(guide => 
        (guide.user?.prenom?.toLowerCase() || '').includes(search) || 
        (guide.user?.nom?.toLowerCase() || '').includes(search) || 
        (guide.specialty?.toLowerCase() || '').includes(search)
      );
    }
    this.calculateGuidePagination();
  }

  calculateGuidePagination(): void {
    // Assuming 10 items per page
    this.totalGuidePages = Math.ceil(this.filteredGuides.length / 10);
    if (this.currentGuidePage > this.totalGuidePages) {
      this.currentGuidePage = 1;
    }
  }

  getStarsArray(rating: number = 0): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  getEmptyStarsArray(rating: number = 0): number[] {
    return Array(5 - Math.floor(rating)).fill(0);
  }

  viewGuideProfile(guide: Guide): void {
    // Implement view profile functionality
    console.log('View guide profile:', guide);
  }

  toggleGuideStatus(guide: Guide): void {
    // Ensure active property is a boolean
    const isActive = !!guide.active;
    
    this.confirmModalTitle = isActive ? 'Désactiver le guide' : 'Activer le guide';
    this.confirmModalMessage = isActive 
      ? `Êtes-vous sûr de vouloir désactiver le guide ${guide.user?.prenom} ${guide.user?.nom}?` 
      : `Êtes-vous sûr de vouloir activer le guide ${guide.user?.prenom} ${guide.user?.nom}?`;
    this.confirmModalButton = 'Confirmer';
    this.confirmModalDanger = isActive;
    this.confirmAction = () => {
      guide.active = !isActive;
      
      // Make sure we have either id or guide_id for the update
      const guideToUpdate = {
        ...guide,
        id: guide.guide_id || guide.id
      };
      
      this.guideService.updateGuide(guideToUpdate).subscribe(() => {
        // Success handling
        this.closeConfirmModal();
      });
    };
    this.showConfirmModal = true;
  }

  confirmDeleteGuide(guide: Guide): void {
    this.confirmModalTitle = 'Supprimer le guide';
    this.confirmModalMessage = `Êtes-vous sûr de vouloir supprimer définitivement le guide ${guide.user?.prenom} ${guide.user?.nom}? Cette action est irréversible.`;
    this.confirmModalButton = 'Supprimer';
    this.confirmModalDanger = true;
    this.confirmAction = () => {
      // Check which ID we have available and prioritize guide_id
      const guideId = guide.guide_id?.toString() || guide.id?.toString();
      
      console.log('Deleting guide with ID:', guideId);
      
      if (!guideId) {
        console.error('Cannot delete guide: No valid ID found');
        this.closeConfirmModal();
        return;
      }
      
      this.guideService.deleteGuide(guideId).subscribe({
        next: () => {
          console.log('Guide deleted successfully');
          // Remove guide from the array
          this.guides = this.guides.filter(g => 
            (g.guide_id?.toString() !== guideId) && 
            (g.id?.toString() !== guideId)
          );
          this.searchGuides(); // Refresh filtered list
          this.closeConfirmModal();
        },
        error: (error) => {
          console.error('Error deleting guide:', error);
          // Show error message but still close the modal
          this.closeConfirmModal();
        }
      });
    };
    this.showConfirmModal = true;
  }

  approveGuideApplication(application: GuideApplication): void {
    this.confirmModalTitle = 'Approuver la demande de guide';
    this.confirmModalMessage = `Êtes-vous sûr de vouloir approuver la demande de ${application.user?.prenom} ${application.user?.nom}?`;
    this.confirmModalButton = 'Approuver';
    this.confirmModalDanger = false;
    this.confirmAction = () => {
      // In a real app, you would call the API to approve the application
      this.pendingGuideApplications = this.pendingGuideApplications.filter(a => a.id !== application.id);
      // Refresh guides list
      this.loadGuides();
      this.closeConfirmModal();
    };
    this.showConfirmModal = true;
  }

  rejectGuideApplication(application: GuideApplication): void {
    this.confirmModalTitle = 'Rejeter la demande de guide';
    this.confirmModalMessage = `Êtes-vous sûr de vouloir rejeter la demande de ${application.user?.prenom} ${application.user?.nom}?`;
    this.confirmModalButton = 'Rejeter';
    this.confirmModalDanger = true;
    this.confirmAction = () => {
      // In a real app, you would call the API to reject the application
      this.pendingGuideApplications = this.pendingGuideApplications.filter(a => a.id !== application.id);
      this.closeConfirmModal();
    };
    this.showConfirmModal = true;
  }

  exportGuides(): void {
    // Implement export functionality
    console.log('Exporting guides data');
  }

  // Settings
  saveSettings(): void {
    // In a real app, you would call the API to save settings
    console.log('Saving settings:', this.settingsForm.value);
    setTimeout(() => {
      this.settingsForm.markAsPristine();
      // Show success message
    }, 500);
  }

  saveModeration(): void {
    // In a real app, you would call the API to save moderation settings
    console.log('Saving moderation settings:', this.moderationForm.value);
    setTimeout(() => {
      this.moderationForm.markAsPristine();
      // Show success message
    }, 500);
  }

  exportAllData(): void {
    // Implement export all data functionality
    console.log('Exporting all data');
  }

  confirmPurgeInactiveData(): void {
    this.confirmModalTitle = 'Purger les données inactives';
    this.confirmModalMessage = 'Êtes-vous sûr de vouloir supprimer définitivement toutes les données inactives depuis plus de 6 mois? Cette action est irréversible.';
    this.confirmModalButton = 'Purger';
    this.confirmModalDanger = true;
    this.confirmAction = () => {
      // In a real app, you would call the API to purge inactive data
      console.log('Purging inactive data');
      this.closeConfirmModal();
      // Show success message
    };
    this.showConfirmModal = true;
  }

  // Utility methods
  changeTab(tab: string): void {
    console.log(`Changing tab to: ${tab}`);
    this.activeTab = tab;
  }

  changeDateRange(range: string): void {
    this.dateRange = range;
    // Reload data based on new date range
    this.loadDashboardData();
  }

  changePage(page: number, type: string): void {
    switch (type) {
      case 'users':
        this.currentUserPage = page;
        break;
      case 'tours':
        this.currentTourPage = page;
        break;
      case 'bookings':
        this.currentBookingPage = page;
        break;
      case 'guides':
        this.currentGuidePage = page;
        break;
    }
  }

  getActivityIcon(type: string): string {
    switch (type) {
      case 'booking': return 'fas fa-calendar-check';
      case 'user': return 'fas fa-user';
      case 'tour': return 'fas fa-map-marked-alt';
      case 'guide': return 'fas fa-id-badge';
      default: return 'fas fa-info-circle';
    }
  }

  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'admin': return 'admin';
      case 'guide': return 'guide';
      case 'user': return 'user';
      default: return '';
    }
  }

  getProfileImageUrl(imageUrl: string | undefined): string {
    if (!imageUrl) {
      return 'assets/images/default-profile.png';
    }
    
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    // For relative URLs, make sure it points to assets/images
    if (imageUrl === 'default-profile.png') {
      return 'assets/images/default-profile.png';
    }
    
    if (!imageUrl.includes('assets/images/')) {
      return `assets/images/${imageUrl}`;
    }
    
    return imageUrl;
  }

  closeConfirmModal(): void {
    this.showConfirmModal = false;
  }
}
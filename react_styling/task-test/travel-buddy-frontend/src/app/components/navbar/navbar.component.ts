import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service'; // Changed to use core services
import { TourService } from '../../core/services/tour.service'; // Changed to use core services
import { interval, Subscription, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isGuide: boolean = false;
  isAdmin: boolean = false; 
  isMobileMenuOpen: boolean = false;
  isProfileMenuOpen: boolean = false;
  userAvatar: string | null = null;
  userName: string | null = null;
  pendingRequestsCount: number = 0;
  private requestsCheckInterval: Subscription | null = null;
  
  get isLoggedIn(): boolean {
    return this.authService.getToken() !== null;
  }

  constructor(
    private authService: AuthService,
    private tourService: TourService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    // Check if user is authenticated and get their details
    if (this.isLoggedIn) {
      this.loadUserData();
    }
    
    // Subscribe to authentication state changes
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.loadUserData();
      } else {
        // Reset user data when logged out
        this.isGuide = false;
        this.isAdmin = false;
        this.userName = null;
        this.userAvatar = null;
        
        if (this.requestsCheckInterval) {
          this.requestsCheckInterval.unsubscribe();
          this.requestsCheckInterval = null;
        }
      }
    });
  }

  loadUserData(): void {
    this.authService.getUser().subscribe({
      next: (user) => {
        if (user) {
          this.isGuide = user.role === 'guide';
          this.isAdmin = user.role === 'admin';
          this.userName = user.prenom || user.nom || user.email || 'User';
          this.userAvatar = user.profileImage || null;
          
          // If user is a guide, start checking for pending requests
          if (this.isGuide) {
            this.checkPendingRequests();
            // Set up an interval to check for new requests every minute
            this.requestsCheckInterval = interval(60000).pipe(
              switchMap(() => this.checkPendingRequestsObservable())
            ).subscribe();
          }
        }
      },
      error: (error) => {
        console.error('Error loading user data:', error);
      }
    });
  }
  
  ngOnDestroy(): void {
    // Clean up subscription when component is destroyed
    if (this.requestsCheckInterval) {
      this.requestsCheckInterval.unsubscribe();
    }
  }

  // Helper method to return an observable for pending requests
  checkPendingRequestsObservable() {
    return this.tourService.getBookingRequests().pipe(
      switchMap(requests => {
        // Filter for pending requests
        const pendingCount = requests.filter(req => req.approval_status === 'pending').length;
        this.pendingRequestsCount = pendingCount;
        return of(pendingCount);
      }),
      catchError(error => {
        console.error('Error checking pending requests:', error);
        return of(0);
      })
    );
  }

  // Check for pending booking requests
  checkPendingRequests(): void {
    if (!this.isGuide) return;
    
    this.tourService.getBookingRequests().subscribe({
      next: (requests) => {
        this.pendingRequestsCount = requests.filter(req => req.approval_status === 'pending').length;
      },
      error: (err) => {
        console.error('Error checking pending requests:', err);
      }
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const navbar = document.querySelector('.navbar') as HTMLElement;
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    
    // Prevent body scrolling when menu is open
    if (this.isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      // Close profile dropdown when mobile menu is closed
      this.isProfileMenuOpen = false;
    }
  }

  toggleProfileMenu(event?: Event) {
    if (event) {
      event.stopPropagation(); // Prevent event bubbling
    }
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  // Close dropdowns when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // Close profile dropdown when clicking outside
    const dropdown = document.querySelector('.has-dropdown') as HTMLElement;
    if (dropdown && !dropdown.contains(event.target as Node)) {
      this.isProfileMenuOpen = false;
    }
  }

  onLogin(): void {
    this.router.navigate(['/connexion']);
    this.closeMobileMenu();
  }

  onRegister(): void {
    this.router.navigate(['/inscription']);
    this.closeMobileMenu();
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
    this.closeMobileMenu();
  }

  onBecomeGuide(): void {
    this.router.navigate(['/become-guide']);
    this.closeMobileMenu();
  }

  private closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
    document.body.style.overflow = '';
  }
}
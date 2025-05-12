import { Routes } from '@angular/router';
import { BecomeGuideComponent } from './pages/become-guide/become-guide.component';
import { PublishTourComponent } from './pages/publish-tour/publish-tour.component';
import { AccueilComponent } from './pages/accueil/accueil.component';
import { ConnexionComponent } from './pages/connexion/connexion.component';
import { InscriptionComponent } from './pages/inscription/inscription.component';
import { ProfilComponent } from './pages/profil/profil.component';
import { AuthGuard } from './guards/auth.guard';
import { ToursComponent } from './pages/tours/tours.component';
import { EditTourComponent } from './pages/edit-tour/edit-tour.component';
// Import BookTourComponent directly
import { BookTourComponent } from './pages/book-tour/book-tour.component';
import { BookingRequestsComponent } from './pages/booking-requests/booking-requests.component';

export const routes: Routes = [
  { path: '', component: AccueilComponent },
  { path: 'connexion', component: ConnexionComponent },
  { path: 'inscription', component: InscriptionComponent },
  { 
    path: 'profil', 
    component: ProfilComponent, 
    canActivate: [AuthGuard]
  },
  { 
    path: 'become-guide', 
    component: BecomeGuideComponent, 
    canActivate: [AuthGuard]
  },
  { 
    path: 'publish-tour', 
    component: PublishTourComponent, 
    canActivate: [AuthGuard]
  },
  { 
    path: 'edit-tour/:id', 
    component: EditTourComponent, 
    canActivate: [AuthGuard]
  },
  { 
    path: 'booking-requests', 
    component: BookingRequestsComponent, 
    canActivate: [AuthGuard]
  },
  // Tours routes
  { path: 'tours', component: ToursComponent },
  { 
    path: 'tours/:id', 
    loadComponent: () => import('./pages/tour-detail/tour-detail.component').then(m => m.TourDetailComponent)
  },
  // Book tour route with higher priority and without guard
  { 
    path: 'book-tour/:id', 
    component: BookTourComponent
  },
  
  // Comment out the wildcard route temporarily for testing
  // { path: '**', redirectTo: '' }
];

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './pages/accueil/accueil.component';
import { ConnexionComponent } from './pages/connexion/connexion.component';
import { InscriptionComponent } from './pages/inscription/inscription.component';
import { ProfilComponent } from './pages/profil/profil.component';
import { BecomeGuideComponent } from './pages/become-guide/become-guide.component';
import { PublishTourComponent } from './pages/publish-tour/publish-tour.component';
import { AuthGuard } from './guards/auth.guard';
import { ToursComponent } from './pages/tours/tours.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { AdminGuard } from './guards/admin.guard';
import { EditTourComponent } from './pages/edit-tour/edit-tour.component';
import { BookTourComponent } from './pages/book-tour/book-tour.component';
import { BookingRequestsComponent } from './pages/booking-requests/booking-requests.component';
import { MyBookingsComponent } from './pages/my-bookings/my-bookings.component';
import { UserAgendaComponent } from './pages/user-agenda/user-agenda.component';
import { GuideDashboardComponent } from './pages/guide-dashboard/guide-dashboard.component';

const routes: Routes = [
  { path: '', component: AccueilComponent },
  { path: 'connexion', component: ConnexionComponent },
  { path: 'inscription', component: InscriptionComponent },
  { path: 'profil', component: ProfilComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'become-guide', component: BecomeGuideComponent, canActivate: [AuthGuard] },
  { path: 'publish-tour', component: PublishTourComponent, canActivate: [AuthGuard] },
  { path: 'edit-tour/:id', component: EditTourComponent, canActivate: [AuthGuard] },
  { path: 'booking-requests', component: BookingRequestsComponent, canActivate: [AuthGuard] },
  { path: 'tours', component: ToursComponent },
  { 
    path: 'tours/:id', 
    loadComponent: () => import('./pages/tour-detail/tour-detail.component').then(m => m.TourDetailComponent)
  },
  // Add book-tour route - without AuthGuard for now to simplify testing
  { 
    path: 'book-tour/:id', 
    component: BookTourComponent
  },
  { 
    path: 'admin', 
    component: AdminDashboardComponent, 
    canActivate: [AuthGuard, AdminGuard] 
  },
  // New routes for booking management
  { path: 'my-bookings', component: MyBookingsComponent, canActivate: [AuthGuard] },
  { path: 'my-tours', component: UserAgendaComponent, canActivate: [AuthGuard] },
  { path: 'guide-dashboard', component: GuideDashboardComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the auth token
    const token = this.authService.getToken();

    // Clone the request and add the authorization header if token exists
    if (token) {
      // Clone the request and add the authorization header
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          // Add these headers to ensure the preflight requests are handled correctly
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        // Allow credentials to be included in the request
        withCredentials: true
      });
    }

    // Send the cloned request to the next handler
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle authentication errors
        if (error.status === 401) {
          console.log('Unauthorized request - redirecting to login');
          this.authService.logout();
          this.router.navigate(['/connexion']);
        }
        return throwError(() => error);
      })
    );
  }
}

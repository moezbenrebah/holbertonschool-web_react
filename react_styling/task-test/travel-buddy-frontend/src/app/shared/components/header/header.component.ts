import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isLoggedIn = false; // Example state, replace with actual logic

  onBecomeGuide(): void {
    console.log('Become a guide clicked');
  }

  onLogout(): void {
    console.log('Logout clicked');
  }

  onLogin(): void {
    console.log('Login clicked');
  }

  onRegister(): void {
    console.log('Register clicked');
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-auth-callback',
  template: `
    <div class="min-h-screen bg-netflix-black flex items-center justify-center">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
        <p class="text-white text-lg">Completing login...</p>
      </div>
    </div>
  `,
  standalone: true
})
export class AuthCallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Get token from URL parameters
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        // Store token in localStorage
        localStorage.setItem('auth_token', token);
        
        // Redirect to home page
        this.router.navigate(['/']);
      } else {
        // If no token, redirect to home with error
        this.router.navigate(['/'], { queryParams: { error: 'auth_failed' } });
      }
    });
  }
}

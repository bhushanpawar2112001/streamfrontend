import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  @Input() isVisible = false;
  @Output() close = new EventEmitter<void>();
  @Output() loginSuccess = new EventEmitter<any>();

  loginData = {
    email: '',
    password: ''
  };
  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    this.loading = true;
    this.error = '';

    this.authService.login(this.loginData.email, this.loginData.password).subscribe({
      next: (response) => {
        this.loading = false;
        console.log('Login response in component:', response);
        // Emit the full response so the app component has access to both user and token
        this.loginSuccess.emit(response);
      },
      error: (error: any) => {
        this.loading = false;
        this.error = error.error?.message || 'Login failed. Please try again.';
      }
    });
  }

  loginWithGoogle() {
    // Redirect to backend Google OAuth endpoint
    window.location.href = 'http://localhost:3000/auth/google';
  }

  closeModal() {
    this.close.emit();
  }
} 
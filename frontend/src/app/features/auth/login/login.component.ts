import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { UserRole } from '../../../core/models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  showPassword = false;
  isLoading = false;
  errorMessage = '';
  roles: UserRole[] = ['General User', 'Admin'];
  private destroy$ = new Subject<void>();

  particles = Array.from({ length: 18 }, (_, i) => i);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    public themeService: ThemeService
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated) {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.loginForm = this.fb.group({
      userId: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['General User', Validators.required],
    });

    this.authService.authState$.pipe(takeUntil(this.destroy$)).subscribe((state) => {
      this.isLoading = state.isLoading;
      this.errorMessage = state.error || '';
    });
  }

  fillDemo(type: 'admin' | 'user'): void {
    if (type === 'admin') {
      this.loginForm.patchValue({ userId: 'ADMIN001', password: 'Admin@123', role: 'Admin' });
    } else {
      this.loginForm.patchValue({ userId: 'USR001', password: 'User@123', role: 'General User' });
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid || this.isLoading) return;
    this.authService.clearError();
    this.authService.login(this.loginForm.value).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: () => {},
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

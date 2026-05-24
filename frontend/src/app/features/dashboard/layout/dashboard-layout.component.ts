import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subject, filter, takeUntil } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { User } from '../../../core/models';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss'],
})
export class DashboardLayoutComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  sidebarOpen = true;
  currentRoute = '';
  private destroy$ = new Subject<void>();

  navItems = [
    { label: 'Dashboard', icon: 'grid', route: '/dashboard', adminOnly: false },
    { label: 'User Management', icon: 'users', route: '/admin', adminOnly: true },
  ];

  constructor(
    public authService: AuthService,
    private router: Router,
    public themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.authService.authState$.pipe(takeUntil(this.destroy$)).subscribe((state) => {
      this.currentUser = state.user;
    });

    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((e: NavigationEnd) => { this.currentRoute = e.urlAfterRedirects; });

    this.currentRoute = this.router.url;
  }

  get visibleNavItems() {
    return this.navItems.filter(
      (item) => !item.adminOnly || this.authService.isAdmin
    );
  }

  logout(): void {
    this.authService.logout();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

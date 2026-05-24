import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil, finalize } from 'rxjs';
import { UserService } from '../../../core/services/user.service';
import { NotificationService } from '../../../core/services/notification.service';
import { User } from '../../../core/models';
import { UserDialogComponent } from './user-dialog.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit, OnDestroy {
  users: User[] = [];
  loading = true;
  searchQuery = '';
  selectedRole = '';
  selectedStatus = '';
  simulatedDelay = 0;

  currentPage = 1;
  pageSize = 8;
  totalUsers = 0;
  totalPages = 0;

  roles = ['', 'Admin', 'General User'];
  delayOptions = [
    { label: 'No delay', value: 0 },
    { label: '1s', value: 1000 },
    { label: '2s', value: 2000 },
    { label: '4s', value: 4000 },
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private userService: UserService,
    private notify: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService
      .getAllUsers({
        page: this.currentPage,
        limit: this.pageSize,
        role: this.selectedRole || undefined,
        isActive: this.selectedStatus === '' ? undefined : this.selectedStatus === 'active',
        search: this.searchQuery || undefined,
        delay: this.simulatedDelay || undefined,
      })
      .pipe(takeUntil(this.destroy$), finalize(() => { this.loading = false; }))
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.users = res.data.users;
            this.totalUsers = res.data.pagination.total;
            this.totalPages = res.data.pagination.totalPages;
          }
        },
        error: () => this.notify.error('Failed to load users'),
      });
  }

  openCreateDialog(): void {
    const ref = this.dialog.open(UserDialogComponent, {
      width: '500px',
      panelClass: 'nd-dialog',
      data: { mode: 'create' },
    });
    ref.afterClosed().subscribe((result) => {
      if (result) { this.loadUsers(); this.notify.success('User created successfully'); }
    });
  }

  openEditDialog(user: User): void {
    const ref = this.dialog.open(UserDialogComponent, {
      width: '500px',
      panelClass: 'nd-dialog',
      data: { mode: 'edit', user },
    });
    ref.afterClosed().subscribe((result) => {
      if (result) { this.loadUsers(); this.notify.success('User updated successfully'); }
    });
  }

  toggleStatus(user: User): void {
    this.userService.toggleUserStatus(user._id).subscribe({
      next: (res) => {
        if (res.success) {
          this.loadUsers();
          this.notify.success(`User ${user.isActive ? 'deactivated' : 'activated'}`);
        }
      },
      error: (err) => this.notify.error(err.error?.message || 'Failed to toggle user status'),
    });
  }

  deleteUser(user: User): void {
    if (!confirm(`Delete user "${user.username}"? This cannot be undone.`)) return;
    this.userService.deleteUser(user._id).subscribe({
      next: () => { this.loadUsers(); this.notify.success('User deleted'); },
      error: (err) => this.notify.error(err.error?.message || 'Failed to delete user'),
    });
  }

  onSearch(): void { this.currentPage = 1; this.loadUsers(); }
  onFilterChange(): void { this.currentPage = 1; this.loadUsers(); }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedRole = '';
    this.selectedStatus = '';
    this.currentPage = 1;
    this.loadUsers();
  }

  prevPage(): void { if (this.currentPage > 1) { this.currentPage--; this.loadUsers(); } }
  nextPage(): void { if (this.currentPage < this.totalPages) { this.currentPage++; this.loadUsers(); } }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  trackByUser(_: number, u: User): string { return u.userId; }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}

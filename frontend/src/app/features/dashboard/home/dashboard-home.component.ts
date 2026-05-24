import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, forkJoin, takeUntil, finalize } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { RecordService } from '../../../core/services/record.service';
import { NotificationService } from '../../../core/services/notification.service';
import { DashboardRecord, DashboardStats, User } from '../../../core/models';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss'],
})
export class DashboardHomeComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;

  // Records table
  records: DashboardRecord[] = [];
  filteredRecords: DashboardRecord[] = [];
  stats: DashboardStats | null = null;
  accessLevel = '';

  // Loading states (async demo)
  loadingRecords = true;
  loadingStats = true;
  loadingProfile = true;

  // Filters
  searchQuery = '';
  selectedStatus = '';
  selectedPriority = '';
  simulatedDelay = 0;

  // Pagination
  currentPage = 1;
  pageSize = 8;
  totalRecords = 0;
  totalPages = 0;

  // Table columns
  displayedColumns = ['recordId', 'title', 'category', 'status', 'priority', 'accessLevel', 'completion', 'dueDate'];

  // Filter options
  statuses = ['', 'Active', 'Pending', 'Resolved', 'Closed'];
  priorities = ['', 'Low', 'Medium', 'High', 'Critical'];
  delayOptions = [
    { label: 'No delay', value: 0 },
    { label: '1 second', value: 1000 },
    { label: '2 seconds', value: 2000 },
    { label: '4 seconds', value: 4000 },
  ];

  today = new Date();
  private destroy$ = new Subject<void>();

  constructor(
    public authService: AuthService,
    private recordService: RecordService,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    this.authService.authState$
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => { this.currentUser = state.user; });

    // Demonstrate async parallel loading on page load
    this.loadDashboardAsync();
  }

  /**
   * Parallel async data loading using forkJoin.
   * Showcases how multiple API calls run concurrently,
   * each with independent loading states.
   */
  loadDashboardAsync(): void {
    this.loadingRecords = true;
    this.loadingStats = true;
    this.loadingProfile = true;

    // Load profile concurrently (independent)
    this.authService.refreshProfile()
      .pipe(takeUntil(this.destroy$), finalize(() => { this.loadingProfile = false; }))
      .subscribe({ error: () => {} });

    // Load stats concurrently (with optional delay for demo)
    this.recordService.getDashboardStats(this.simulatedDelay || undefined)
      .pipe(takeUntil(this.destroy$), finalize(() => { this.loadingStats = false; }))
      .subscribe({
        next: (res) => { if (res.success && res.data) this.stats = res.data; },
        error: () => this.notify.error('Failed to load stats'),
      });

    // Load records (with optional delay for demo)
    this.loadRecords();
  }

  loadRecords(): void {
    this.loadingRecords = true;
    this.recordService
      .getRecords({
        page: this.currentPage,
        limit: this.pageSize,
        status: this.selectedStatus || undefined,
        priority: this.selectedPriority || undefined,
        search: this.searchQuery || undefined,
        delay: this.simulatedDelay || undefined,
      })
      .pipe(takeUntil(this.destroy$), finalize(() => { this.loadingRecords = false; }))
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.records = res.data.records;
            this.filteredRecords = this.records;
            this.totalRecords = res.data.pagination.total;
            this.totalPages = res.data.pagination.totalPages;
            this.accessLevel = res.data.accessLevel;
          }
        },
        error: () => this.notify.error('Failed to load records'),
      });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadRecords();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadRecords();
  }

  onDelayChange(): void {
    this.loadDashboardAsync();
  }

  prevPage(): void {
    if (this.currentPage > 1) { this.currentPage--; this.loadRecords(); }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) { this.currentPage++; this.loadRecords(); }
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedStatus = '';
    this.selectedPriority = '';
    this.currentPage = 1;
    this.loadRecords();
  }

  getStatCount(breakdown: { _id: string; count: number }[], key: string): number {
    return breakdown?.find((s) => s._id === key)?.count ?? 0;
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  trackByRecord(_: number, rec: DashboardRecord): string { return rec._id; }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

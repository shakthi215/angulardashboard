import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { RecordsResponse, DashboardStats, DashboardRecord, ApiResponse } from '../models';

export interface RecordFilters {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
  search?: string;
  delay?: number;
}

@Injectable({ providedIn: 'root' })
export class RecordService {
  private baseUrl = `${environment.apiUrl}/records`;

  constructor(private http: HttpClient) {}

  getRecords(filters: RecordFilters = {}): Observable<RecordsResponse> {
    let params = new HttpParams();
    if (filters.page) params = params.set('page', filters.page.toString());
    if (filters.limit) params = params.set('limit', filters.limit.toString());
    if (filters.status) params = params.set('status', filters.status);
    if (filters.priority) params = params.set('priority', filters.priority);
    if (filters.search) params = params.set('search', filters.search);
    if (filters.delay) params = params.set('delay', filters.delay.toString());

    return this.http.get<RecordsResponse>(this.baseUrl, { params });
  }

  getRecordById(id: string): Observable<ApiResponse<{ record: DashboardRecord }>> {
    return this.http.get<ApiResponse<{ record: DashboardRecord }>>(`${this.baseUrl}/${id}`);
  }

  getDashboardStats(delay?: number): Observable<ApiResponse<DashboardStats>> {
    let params = new HttpParams();
    if (delay) params = params.set('delay', delay.toString());
    return this.http.get<ApiResponse<DashboardStats>>(`${this.baseUrl}/stats`, { params });
  }
}

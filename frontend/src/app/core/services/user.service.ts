import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { User, ApiResponse } from '../models';

export interface UserFilters {
  page?: number;
  limit?: number;
  role?: string;
  isActive?: boolean;
  search?: string;
  delay?: number;
}

export interface UsersResponse {
  success: boolean;
  data: {
    users: User[];
    pagination: { total: number; page: number; limit: number; totalPages: number };
  };
}

export interface CreateUserPayload {
  username: string;
  email: string;
  password: string;
  role: string;
  department: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private baseUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  getAllUsers(filters: UserFilters = {}): Observable<UsersResponse> {
    let params = new HttpParams();
    if (filters.page) params = params.set('page', filters.page.toString());
    if (filters.limit) params = params.set('limit', filters.limit.toString());
    if (filters.role) params = params.set('role', filters.role);
    if (filters.isActive !== undefined)
      params = params.set('isActive', filters.isActive.toString());
    if (filters.search) params = params.set('search', filters.search);
    if (filters.delay) params = params.set('delay', filters.delay.toString());

    return this.http.get<UsersResponse>(`${this.baseUrl}/users`, { params });
  }

  getUserById(id: string): Observable<ApiResponse<{ user: User }>> {
    return this.http.get<ApiResponse<{ user: User }>>(`${this.baseUrl}/users/${id}`);
  }

  createUser(payload: CreateUserPayload): Observable<ApiResponse<{ user: User }>> {
    return this.http.post<ApiResponse<{ user: User }>>(`${this.baseUrl}/users`, payload);
  }

  updateUser(id: string, payload: Partial<User>): Observable<ApiResponse<{ user: User }>> {
    return this.http.put<ApiResponse<{ user: User }>>(`${this.baseUrl}/users/${id}`, payload);
  }

  toggleUserStatus(id: string): Observable<ApiResponse<{ user: User }>> {
    return this.http.patch<ApiResponse<{ user: User }>>(
      `${this.baseUrl}/users/${id}/toggle-status`,
      {}
    );
  }

  deleteUser(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.baseUrl}/users/${id}`);
  }
}

export type UserRole = 'General User' | 'Admin';

export interface User {
  _id: string;
  id: string;
  userId: string;
  username: string;
  email: string;
  role: UserRole;
  department: string;
  avatar: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt?: string;
}

export interface LoginRequest {
  userId: string;
  password: string;
  role: UserRole;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export type RecordStatus = 'Active' | 'Pending' | 'Resolved' | 'Closed';
export type RecordPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type RecordAccessLevel = 'Public' | 'Restricted' | 'Confidential';

export interface DashboardRecord {
  _id: string;
  recordId: string;
  title: string;
  description: string;
  status: RecordStatus;
  priority: RecordPriority;
  accessLevel: RecordAccessLevel;
  assignedTo: string;
  category: string;
  tags: string[];
  dueDate: string;
  completionPercentage: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface RecordsResponse {
  success: boolean;
  data: {
    records: DashboardRecord[];
    pagination: Pagination;
    accessLevel: string;
  };
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DashboardStats {
  totalRecords: number;
  statusBreakdown: { _id: string; count: number }[];
  priorityBreakdown: { _id: string; count: number }[];
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface LoadingState {
  records: boolean;
  stats: boolean;
  users: boolean;
  profile: boolean;
}

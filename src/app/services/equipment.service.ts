import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Equipment {
  id: string;
  name: string;
  type: string;
  serialNumber: string;
  status: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface DashboardStats {
  total: number;
  available: number;
  reserved: number;
  rented: number;
}

export interface DashboardResponse {
  equipments: PageResponse<Equipment>;
  stats: DashboardStats;
}

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {
  private apiUrl = 'http://localhost:8080/api/v1/equipments';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getDashboardData(page: number = 1, size: number = 20): Observable<DashboardResponse> {
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<DashboardResponse>(
      `${this.apiUrl}/dashboard?page=${page}&size=${size}`,
      { headers }
    );
  }
}

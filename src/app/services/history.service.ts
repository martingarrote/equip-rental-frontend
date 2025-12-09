import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageResponse } from '../components/list/list';
import { AuthService } from './auth.service';

export interface HistoryRecord {
  equipmentId: string;
  equipmentName: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: string;
  description: string;
}

@Injectable({ providedIn: 'root' })
export class HistoryService {
  private apiUrl = 'http://localhost:8080/api/v1/history';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getHistory(page: number, size: number): Observable<PageResponse<HistoryRecord>> {
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    const params = `?page=${page}&size=${size}&detailLevel=DETAILED`;

    return this.http.get<PageResponse<HistoryRecord>>(
      `${this.apiUrl}${params}`,
      { headers }
    );
  }
}

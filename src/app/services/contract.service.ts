import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { PageResponse } from '../components/list/list'

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  private apiUrlContracts = 'http://localhost:8080/api/v1/contracts';
  private apiUrlRentals = 'http://localhost:8080/api/v1/rentals/contract';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
  }

  private buildHeaders(): HttpHeaders {
    const token = this.authService.getToken();

    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getContracts(page: number, size: number): Observable<PageResponse<any>> {
    const headers = this.buildHeaders();
    const params = `?page=${page}&size=${size}`;

    return this.http.get<PageResponse<any>>(
      `${this.apiUrlContracts}${params}`,
      {headers}
    );
  }

  getRentalsByContract(
    contractId: string,
    page: number,
    size: number
  ): Observable<PageResponse<any>> {

    const headers = this.buildHeaders();
    const params = `?page=${page}&size=${size}`;

    return this.http.get<PageResponse<any>>(
      `${this.apiUrlRentals}/${contractId}${params}`,
      {headers}
    );
  }

  getMyContracts(page: number, size: number) {
    return this.http.get<PageResponse<any>>(
      `${this.apiUrlContracts}/my-contracts?page=${page}&size=${size}`,
      { headers: this.buildHeaders() }
    );
  }

}

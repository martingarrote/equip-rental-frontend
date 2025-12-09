import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

interface LoginResponse {
  accessToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/v1/auth';
  private tokenSubject: BehaviorSubject<string | null>;
  public token$: Observable<string | null>;

  constructor(private http: HttpClient) {
    this.tokenSubject = new BehaviorSubject<string | null>(this.getToken());
    this.token$ = this.tokenSubject.asObservable();
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      { email, password }
    ).pipe(
      map(response => {
        console.log('Response do backend:', response); // Debug
        if (response.accessToken) {
          console.log('Token recebido, salvando...'); // Debug
          this.setToken(response.accessToken);
          console.log('Verificando após salvar:', localStorage.getItem('auth_token')); // Debug
        }
        return response;
      }),
      catchError(error => {
        console.error('Erro no login:', error);
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    this.clearToken();
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private setToken(token: string): void {
    localStorage.setItem('auth_token', token);
    this.tokenSubject.next(token);
    console.log('Token salvo:', token); // Debug
    console.log('isAuthenticated:', this.isAuthenticated()); // Debug
  }

  private clearToken(): void {
    localStorage.removeItem('auth_token');
    this.tokenSubject.next(null);
  }

  getTokenData(): any {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      return null;
    }
  }

  getUserRole(): string | null {
    const data = this.getTokenData();
    return data?.role || null;
  }
}

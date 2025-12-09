import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-role-redirect',
  standalone: true,
  template: '<div>Redirecionando...</div>'
})
export class RoleRedirectComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    const userRole = this.authService.getUserRole();
    console.log('Redirecionando baseado na role:', userRole);

    if (userRole === 'CUSTOMER') {
      this.router.navigate(['/home']);
    } else if (userRole === 'EMPLOYEE') {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}

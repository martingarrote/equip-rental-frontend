import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service'

@Component({
  selector: 'app-menu',
  imports: [RouterLink],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu implements OnInit {

  userRole: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole();

    this.authService.token$.subscribe(() => {
      this.userRole = this.authService.getUserRole();
    });
  }

  hasRole(role: string): boolean {
    return this.userRole === role;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

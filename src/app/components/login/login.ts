import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, preencha todos os campos';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Login bem-sucedido', response);
        this.isLoading = false;
        this.router.navigate(['/']).then(() => {
          console.log('Navegação concluída');
        });
      },
      error: (error) => {
        this.errorMessage = 'Email ou senha inválidos';
        this.isLoading = false;
        console.error('Erro no login:', error);
      }
    });
  }
}

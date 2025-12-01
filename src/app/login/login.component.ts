import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  showPassword = false;
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  onLogin(form: any) {
  const { username, password } = form.value;

  this.authService.login(username, password).subscribe(success => {
    if (success) {
      this.toastService.show('Login successful 🎉', 'success');
      this.router.navigate(['/employees']);
    } else {
      this.toastService.show('Invalid credentials ❌', 'error');
    }
  });
}

}

import { Component } from '@angular/core';
import { login, tokenKey } from '../../../constants/urlconstants';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterModule, TitleCasePipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(
    private router: Router,
    public auth: AuthService
  ) { }

  hasRole(roles: string[]): boolean {
    return roles.some(role => this.auth.tokenDecode.roles.includes(role));
  }

  signOut() {
    localStorage.removeItem(tokenKey);
    this.router.navigateByUrl(login);
  }
}

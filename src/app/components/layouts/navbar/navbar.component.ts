import { Component } from '@angular/core';
import { login, tokenKey } from '../../../constants/urlconstants';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(
    private router: Router
  ) { }

  signOut() {
    localStorage.removeItem(tokenKey);
    this.router.navigateByUrl(login);
  }
}

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TokenModel } from '../models/token.model';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { claims, login, tokenKey } from '../constants/urlconstants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  tokenDecode: TokenModel = new TokenModel();

  constructor(private router: Router) {}

  isAuthenticated() {
    const token: string | null = localStorage.getItem(tokenKey);

    if (!token) {
      this.router.navigateByUrl(login);
      return false;
    }

    const decode: JwtPayload | any = jwtDecode(token);
    const exp = decode.exp;
    const now = new Date().getTime() / 1000;

    if (now > exp) {
      localStorage.removeItem(tokenKey);
      this.router.navigateByUrl(login);
      return false;
    }

    // ✅ Roller kaybolmasın diye tekrar yükle
    this.tokenDecode.id = decode[claims + '/nameidentifier'];
    this.tokenDecode.name = decode[claims + '/name'];
    this.tokenDecode.email = decode[claims + '/emailaddress'];

    const roles = decode["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    this.tokenDecode.roles = Array.isArray(roles) ? roles : [roles];

    return true;
  }
}

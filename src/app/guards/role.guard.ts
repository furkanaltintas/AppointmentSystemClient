import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if(!authService.isAuthenticated()) {
    router.navigate(["/login"]);
    return false;
  }

  // Gerekli roller
  const requiredRoles: string[] = route.data["roles"];
  const userRoles = authService.tokenDecode.roles;

  // Kullanıcının gerekli rollere sahip olup olmadığını kontrol et
  const hasAccess = userRoles.some(role => requiredRoles.includes(role));

  if(!hasAccess) {
    router.navigate(["/unauthorized"]);
    return false;
  }

  return true; // Yetkiliyse erişime izin ver
};

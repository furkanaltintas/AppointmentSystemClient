import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LayoutsComponent } from './components/layouts/layouts.component';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { DoctorsComponent } from './components/doctors/doctors.component';
import { DepartmentsComponent } from './components/departments/departments.component';
import { PatientComponent } from './components/patients/patient.component';
import { UsersComponent } from './components/users/users.component';
import { roleGuard } from './guards/role.guard';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: "unauthorized", component: UnauthorizedComponent },
  {
    path: '',
    component: LayoutsComponent,
    canActivateChild: [()=> inject(AuthService).isAuthenticated()],
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: "doctors",
        component: DoctorsComponent,
        canActivate: [roleGuard],
        data: { roles: ["Doctor"]}
      },
      {
        path: "departments",
        component: DepartmentsComponent,
        canActivate: [roleGuard],
        data: { roles: ["Admin"]}
      },
      {
        path: "patients",
        component: PatientComponent,
        canActivate: [roleGuard],
        data: { roles: ["Doctor", "Staff"]}
      },
      {
        path: "users",
        component: UsersComponent,
        canActivate: [roleGuard], // 🛑 Kullanıcı rolü kontrol edilecek
        data: { roles: ["Admin"] } // ❗ Sadece "Admin" rolü olanlar erişebilir
      }
    ],
  },
  { path: '**', component: NotFoundComponent },
];

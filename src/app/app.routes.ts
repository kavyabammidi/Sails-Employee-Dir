import { Routes } from '@angular/router';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeDetailsComponent } from './employee-details/employee-details.component';
import { ErrorComponent } from './error/error.component';
import { FavouriteListComponent } from './favourite-list/favourite-list.component';
import { employeeExistsGuard } from './guards/employee-exists.guard';
import { LoginComponent } from './login/login.component'; // import login
import { canActivateGuard } from './guards/can-activate.guard';
import { AddEmployeeComponent } from './add-employee/add-employee.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'employees', component: EmployeeListComponent, canActivate: [canActivateGuard] },
  { 
    path: 'employee/:id', 
    component: EmployeeDetailsComponent, 
    canActivate: [canActivateGuard, employeeExistsGuard] // <- add canActivateGuard here
  },
  { path: 'favourites', component: FavouriteListComponent, canActivate: [canActivateGuard] },
  { path: 'add-employee', component: AddEmployeeComponent },
  { path: '**', component: ErrorComponent }
];



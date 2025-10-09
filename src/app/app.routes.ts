

// import { FavouriteListComponent } from './favourite-list/favourite-list.component';
import { Routes } from '@angular/router';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeDetailsComponent } from './employee-details/employee-details.component';
import { ErrorComponent } from './error/error.component';
import { EmployeeExistsGuard } from './guards/employee-exists.guard';
import { FavouriteListComponent } from './favourite-list/favourite-list.component';




export const routes: Routes = [
  {path:'',redirectTo:'employees',pathMatch:'full'},
  { path: 'employees', component: EmployeeListComponent },
  { path: 'employee/:id', component: EmployeeDetailsComponent, canActivate: [EmployeeExistsGuard] },
  { path: 'favourites', component: FavouriteListComponent },

  { path: '**', component: ErrorComponent }
];

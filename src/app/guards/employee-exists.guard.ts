import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { EmployeeService } from '../services/employee.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeExistsGuard implements CanActivate {

  constructor(private employeeService: EmployeeService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const id = Number(route.paramMap.get('id'));
    const employee = this.employeeService.getEmployeeById(id);

    if (employee) {
      return true;
    } else {
      this.router.navigate(['/error']);
      return false;
    }
  }
}

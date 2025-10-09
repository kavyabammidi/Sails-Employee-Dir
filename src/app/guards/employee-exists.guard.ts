import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { EmployeeService } from '../services/employee.service';

export const employeeExistsGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const employeeService = inject(EmployeeService);
  const router = inject(Router);

  const id = Number(route.paramMap.get('id'));
  const emp = employeeService.getEmployeeById(id);
  if (emp) {
    return true;
  } else {
    router.navigate(['/error']);
    return false;
  }
};

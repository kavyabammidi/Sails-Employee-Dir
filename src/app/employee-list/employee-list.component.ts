import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EmployeeService } from '../services/employee.service';
import { EmployeeCardComponent } from '../employee-card/employee-card.component';
import { Employee } from '../models/employee';
import { Observable, combineLatest, map, startWith } from 'rxjs';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
  standalone: true,
  imports: [CommonModule, EmployeeCardComponent],
})
export class EmployeeListComponent implements OnInit {
  filteredEmployees$: Observable<Employee[]>;

  constructor(public employeeService: EmployeeService, private router: Router) {
    // ✅ Use employees$ (BehaviorSubject) instead of getEmployees()
    this.filteredEmployees$ = combineLatest([
      this.employeeService.employees$, // ✅ Changed from getEmployees()
      this.employeeService.search$.pipe(startWith('')),
      this.employeeService.sort$.pipe(startWith('')),
    ]).pipe(
      map(([employees, searchText, sortAttribute]) => {
        console.log('🔄 Filtering employees, total:', employees.length);
        
        const search = searchText.toLowerCase();

        // ✅ Safe filtering (prevents undefined errors)
        let filtered = employees.filter((emp) => {
          const name = emp.name?.toLowerCase() || '';
          const dept = emp.department?.toLowerCase() || '';
          const desig = emp.designation?.toLowerCase() || '';
          return (
            name.includes(search) ||
            dept.includes(search) ||
            desig.includes(search)
          );
        });

        console.log('🔍 Filtered employees:', filtered.length);

        // ✅ Sorting logic
        if (sortAttribute) {
          filtered = [...filtered].sort((a, b) => {
            if (sortAttribute === 'dateOfJoining') {
              const dateA = a.dateOfJoining?.getTime() || 0;
              const dateB = b.dateOfJoining?.getTime() || 0;
              return dateA - dateB;
            }

            const valA = a[sortAttribute as keyof Employee];
            const valB = b[sortAttribute as keyof Employee];

            if (typeof valA === 'string' && typeof valB === 'string') {
              return valA.localeCompare(valB);
            }

            return 0;
          });
        }

        return filtered;
      })
    );
  }

  ngOnInit(): void {
    // ✅ Load employees on init
    this.employeeService.getEmployees();
  }

  handleToggleFav(id: number) {
    this.employeeService.toggleFavourite(id);
  }

  viewDetails(id: number) {
    this.router.navigate(['/employee', id]);
  }

  getFavouriteLabel(empId: number): string {
    return this.employeeService.isFavourite(empId)
      ? 'Unmark Favourite'
      : 'Mark Favourite';
  }
}
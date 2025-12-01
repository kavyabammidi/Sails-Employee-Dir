import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../services/employee.service';
import { Employee } from '../models/employee';
import { AgePipe } from '../pipes/age.pipe';
import { JoinDatePipe } from '../pipes/join-date.pipe';

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [CommonModule, JoinDatePipe],
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.scss']
})
export class EmployeeDetailsComponent implements OnInit {
  employee!: Employee; // will be assigned after fetching from API

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    // Subscribe to the Observable returned by the service
    this.employeeService.getEmployeeById(id).subscribe(emp => {
      if (emp) {
        this.employee = emp;
      } else {
        this.router.navigate(['/error']); // fallback if id invalid
      }
    });
  }

  goBack() {
    this.router.navigate(['/employees']);
  }
}

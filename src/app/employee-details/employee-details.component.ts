import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../services/employee.service';
import { Employee } from '../models/employee';
import { AgePipe } from '../pipes/age.pipe';
import { JoinDatePipe } from '../pipes/join-date.pipe'; // if you created this

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.scss'],
  standalone: true,
  imports: [CommonModule, AgePipe, JoinDatePipe]
})
export class EmployeeDetailsComponent implements OnInit {
  employee!: Employee; // ✅ use non-null assertion because you fetch it in ngOnInit

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const emp = this.employeeService.getEmployeeById(id);
    if (emp) {
      this.employee = emp; // now employee is always defined
    } else {
      this.router.navigate(['/error']);
    }
  }

  goBack() {
    this.router.navigate(['/employees']);
  }
}

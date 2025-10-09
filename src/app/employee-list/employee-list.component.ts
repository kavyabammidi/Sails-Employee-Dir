import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import { Employee } from '../models/employee';
import { EmployeeCardComponent } from '../employee-card/employee-card.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
  standalone:true,
  imports:[EmployeeCardComponent,CommonModule]
})
export class EmployeeListComponent implements OnInit {
  
  employees: Employee[] = [];

  constructor(public employeeService: EmployeeService,private router:Router) {}

  ngOnInit(): void {
    this.employees = this.employeeService.getEmployees();
  }
  handleToggleFav(id: number) {
    const emp = this.employeeService.getEmployeeById(id);
    if (emp) {
      this.employeeService.toggleFavourite(id);
    }
  }
  
  viewDetails(id: number) {
    this.router.navigate(['/employee', id]);
  }
}

import { Injectable } from '@angular/core';
import { Employee } from '../models/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private favouriteEmployees: number[] = [];
  private employees: Employee[] = [
    {
      id: 1,
      name: 'John Doe',
      designation: 'Software Engineer',
      department: 'IT',
      dateOfJoining: new Date('2022-05-10'),
      profilePhotoUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
      email: 'john.doe@example.com',          
      dateOfBirth: new Date('1995-06-20')
    },
    {
      id: 2,
      name: 'Jane Smith',
      designation: 'HR Manager',
      department: 'HR',
      dateOfJoining: new Date('2021-08-15'),
      profilePhotoUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
      email: 'john.doe@example.com',          
    dateOfBirth: new Date('1995-06-20')
    },
    {
      id: 3,
      name: 'Jane Smith',
      designation: 'HR Manager',
      department: 'HR',
      dateOfJoining: new Date('2021-08-15'),
      profilePhotoUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
      email: 'john.doe@example.com',          
    dateOfBirth: new Date('1995-06-20')
    },
    {
      id: 4,
      name: 'Jane Smith',
      designation: 'HR Manager',
      department: 'HR',
      dateOfJoining: new Date('2021-08-15'),
      profilePhotoUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
      email: 'john.doe@example.com',          
    dateOfBirth: new Date('1995-06-20')
    },
    {
      id: 5,
      name: 'Jane Smith',
      designation: 'HR Manager',
      department: 'HR',
      dateOfJoining: new Date('2021-08-15'),
      profilePhotoUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
      email: 'john.doe@example.com',          
    dateOfBirth: new Date('1995-06-20')
    },
    {
      id: 6,
      name: 'Jane Smith',
      designation: 'HR Manager',
      department: 'HR',
      dateOfJoining: new Date('2021-08-15'),
      profilePhotoUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
      email: 'john.doe@example.com',          
      dateOfBirth: new Date('1995-06-20')
    },
    {
      id: 7,
      name: 'Jane Smith',
      designation: 'HR Manager',
      department: 'HR',
      dateOfJoining: new Date('2021-08-15'),
      profilePhotoUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
      email: 'john.doe@example.com',          
    dateOfBirth: new Date('1995-06-20')
    }
  ];

  constructor() {}

  getEmployees(): Employee[] {
    return this.employees;
  }

  getEmployeeById(id: number): Employee | undefined {
    return this.employees.find(emp => emp.id === id);
  }
  getFavourites(): Employee[] {
    return this.employees.filter(emp => this.isFavourite(emp.id));
  }

  toggleFavourite(id: number): void {
    if (this.isFavourite(id)) {
      this.favouriteEmployees = this.favouriteEmployees.filter(favId => favId !== id);
    } else {
      this.favouriteEmployees.push(id);
    }
  }

  isFavourite(id: number): boolean {
    return this.favouriteEmployees.includes(id);
  }
}

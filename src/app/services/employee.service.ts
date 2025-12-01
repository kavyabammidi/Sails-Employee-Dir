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
      name: 'JOHN',
      designation: 'Software Engineer',
      department: 'IT',
      dateOfJoining: new Date('2022-05-10'),
      profilePhotoUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
      email: 'john.doe@example.com',          
      dateOfBirth: new Date('1975-05-05')
    },
    {
      id: 2,
      name: 'DEVI',
      designation: 'HR Manager',
      department: 'HR',
      dateOfJoining: new Date('2021-08-15'),
      profilePhotoUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
      email: 'john.doe@example.com',          
    dateOfBirth: new Date('2004-11-20')
    },
    {
      id: 3,
      name: 'KAVYA',
      designation: 'Trainee Software Engineer',
      department: 'Angular',
      dateOfJoining: new Date('2025-08-15'),
      profilePhotoUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
      email: 'kavyabammidi@example.com',          
    dateOfBirth: new Date('2004-05-16')
    },
    {
      id: 4,
      name: 'YATEESHA',
      designation: 'HR Manager',
      department: 'HR',
      dateOfJoining: new Date('2021-08-15'),
      profilePhotoUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
      email: 'john.doe@example.com',          
    dateOfBirth: new Date('1695-04-27')
    },
    {
      id: 5,
      name: 'CHANDHANA',
      designation: 'HR Manager',
      department: 'HR',
      dateOfJoining: new Date('2021-08-15'),
      profilePhotoUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
      email: 'john.doe@example.com',          
    dateOfBirth: new Date('1975-06-20')
    },
    {
      id: 6,
      name: 'ANUSHA',
      designation: 'HR Manager',
      department: 'HR',
      dateOfJoining: new Date('2021-08-15'),
      profilePhotoUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
      email: 'john.doe@example.com',          
      dateOfBirth: new Date('1982-06-10')
    },
    {
      id: 7,
      name: 'MANASA',
      designation: 'HR Manager',
      department: 'HR',
      dateOfJoining: new Date('2021-08-15'),
      profilePhotoUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
      email: 'john.doe@example.com',          
    dateOfBirth: new Date('1991-02-21')
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

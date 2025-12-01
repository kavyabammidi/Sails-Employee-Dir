import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../services/employee.service';
import { EmployeeCardComponent } from '../employee-card/employee-card.component';
import { Router, RouterLink } from '@angular/router';
import { Employee } from '../models/employee';

@Component({
  selector: 'app-favourite-list',
  standalone: true,
  imports: [CommonModule, EmployeeCardComponent, RouterLink],
  templateUrl: './favourite-list.component.html',
  styleUrls: ['./favourite-list.component.scss']
})
export class FavouriteListComponent implements OnInit {
  theme: 'light' | 'dark' = 'light';
  favourites: Employee[] = [];
  filteredFavourites: Employee[] = [];

  constructor(public employeeService: EmployeeService, private router: Router) {}

  ngOnInit(): void {
    // Subscribe to the favourites Observable
    this.employeeService.getFavourites().subscribe(favs => {
      this.favourites = favs;
      this.filteredFavourites = [...favs];
    });

    // Subscribe to search changes
    this.employeeService.search$.subscribe(searchText => {
      const text = searchText.toLowerCase();
      this.filteredFavourites = this.favourites.filter(emp =>
        emp.name.toLowerCase().includes(text) ||
        emp.department.toLowerCase().includes(text)
      );
    });

    // Subscribe to sort changes
    this.employeeService.sort$.subscribe(attribute => {
      if (!attribute) return;
      this.filteredFavourites.sort((a, b) => {
        if (attribute === 'dateOfJoining') {
          return new Date(a.dateOfJoining).getTime() - new Date(b.dateOfJoining).getTime();
        }
        return (a[attribute as keyof Employee] as string).localeCompare(
          b[attribute as keyof Employee] as string
        );
      });
    });
  }

  toggleFavourite(id: number) {
    this.employeeService.toggleFavourite(id);
    // Refresh favourites after toggling
    this.employeeService.getFavourites().subscribe(favs => {
      this.favourites = favs;
      this.filteredFavourites = [...favs];
    });
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

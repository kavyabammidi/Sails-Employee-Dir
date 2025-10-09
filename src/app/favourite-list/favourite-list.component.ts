// favourite-list.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../services/employee.service';
import { EmployeeCardComponent } from '../employee-card/employee-card.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-favourite-list',
  standalone: true,
  imports: [CommonModule, EmployeeCardComponent, RouterLink],
  templateUrl: './favourite-list.component.html',
  styleUrls: ['./favourite-list.component.scss']
})
export class FavouriteListComponent {
  favourites: any[] = [];
  constructor(public employeeService: EmployeeService) {}
  ngOnInit(): void {
    this.favourites = this.employeeService.getFavourites();
  }


  

  

  toggleFavourite(id: number) {
    this.employeeService.toggleFavourite(id);
    this.favourites = this.employeeService.getFavourites();
  }
}

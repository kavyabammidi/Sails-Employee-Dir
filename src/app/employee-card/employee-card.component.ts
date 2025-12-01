import { Component, Input, Output, EventEmitter, ViewEncapsulation, HostBinding } from '@angular/core';
import { Employee } from '../models/employee';
import { CommonModule } from '@angular/common';
import { JoinDatePipe } from '../pipes/join-date.pipe';

@Component({
  selector: 'app-employee-card',
  standalone: true,
  imports: [CommonModule,JoinDatePipe],
  templateUrl: './employee-card.component.html',
  styleUrl: './employee-card.component.scss',
  encapsulation: ViewEncapsulation.Emulated
})
export class EmployeeCardComponent {
  @Input() employee!: Employee;
  @Input() isFavourite: boolean = false;
  @Output() toggleFav = new EventEmitter<number>();

  
  

  onToggleFav() {
    this.toggleFav.emit(this.employee.id);
  }
}

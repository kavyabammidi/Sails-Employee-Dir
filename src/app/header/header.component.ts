import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(public router: Router) {}

  isDetailsPage(): boolean {
    return this.router.url.includes('/employee/');
  }
  canShowFavouritesLink(): boolean {
    const url = this.router.url;
    return !url.includes('/employee/') && !url.includes('/favourites');
  }
  
}

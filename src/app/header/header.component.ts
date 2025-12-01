import { Component, Output, EventEmitter, Input, HostListener, afterNextRender, Injector } from '@angular/core';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../services/employee.service';
import { AuthService } from '../services/auth.service';
import { filter } from 'rxjs/operators';
import { AddEmployeeComponent } from '../add-employee/add-employee.component';

// ✅ Bootstrap global declaration
declare var bootstrap: any;

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, AddEmployeeComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  currentTheme: 'light' | 'dark' = 'light';
  searchText: string = '';
  showBottomBar: boolean = false;
  currentSort: string = 'name';
  
  showProfileMenu = false;
  toggleProfileMenu(event: MouseEvent) {
    event.stopPropagation();
    this.showProfileMenu = !this.showProfileMenu;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.position-relative')) {
      this.showProfileMenu = false;
    }
  }

  @Input() employeeCount: number = 0;
  @Output() viewModeChange = new EventEmitter<'card' | 'table'>();

  constructor(
    private router: Router,
    private employeeService: EmployeeService,
    public authService: AuthService,
    private injector: Injector
  ) {
    // Subscribe to theme updates
    this.employeeService.theme$.subscribe(theme => this.currentTheme = theme);
    this.employeeService.search$.subscribe(text => this.searchText = text);
    this.employeeService.sort$.subscribe(sort => this.currentSort = sort);
    this.employeeService.employeeCount$.subscribe(count => this.employeeCount = count);

    // React to route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const url = this.router.url;
        this.showBottomBar =
          authService.isLoggedIn() && ['/employees', '/favourites'].includes(url.split('?')[0]);
        
        // Reinitialize tooltips after navigation
        if (this.showBottomBar) {
          this.initTooltips();
        }
      });

    // ✅ Initialize tooltips after render
    afterNextRender(() => {
      this.initTooltips();
    }, { injector: this.injector });
  }

  private initTooltips() {
    // Check if we're in browser and bootstrap is available
    if (typeof document !== 'undefined' && typeof bootstrap !== 'undefined') {
      const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
      tooltipTriggerList.forEach((el: any) => {
        // Dispose existing tooltip if any
        const existingTooltip = bootstrap.Tooltip.getInstance(el);
        if (existingTooltip) {
          existingTooltip.dispose();
        }
        // Create new tooltip
        new bootstrap.Tooltip(el);
      });
    }
  }

  isDetailsPage(): boolean {
    return this.router.url.includes('/employee/');
  }

  showFavouritesLink(): boolean {
    return this.router.url === '/employees';
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.employeeService.setTheme(newTheme);
  }

  onSortChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.employeeService.setSort(select.value);
  }

  onSearchChange(event: Event) {
    const searchText = (event.target as HTMLInputElement).value;
    this.employeeService.updateSearch(searchText);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
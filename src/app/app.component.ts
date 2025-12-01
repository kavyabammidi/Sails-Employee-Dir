import { Component,OnInit,Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { HeaderComponent } from './header/header.component';
import { JoinDatePipe } from './pipes/join-date.pipe';
import { EmployeeCardComponent } from './employee-card/employee-card.component';
import { EmployeeService } from './services/employee.service';
import { LoaderComponent } from './loader/loader.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent,LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'employee-directory';
  constructor(private employeeService: EmployeeService, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.employeeService.theme$.subscribe(theme => {
      const body = this.renderer.selectRootElement('body', true);
      if (theme === 'dark') {
        this.renderer.addClass(body, 'dark-theme');
        this.renderer.removeClass(body, 'light-theme');
      } else {
        this.renderer.addClass(body, 'light-theme');
        this.renderer.removeClass(body, 'dark-theme');
      }
    });
  }
  
}

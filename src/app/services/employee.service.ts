import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Employee } from '../models/employee';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private favouriteEmployees: number[] = [];
  private sortSubject = new BehaviorSubject<string>('');
  sort$ = this.sortSubject.asObservable();
  
  private themeSubject = new BehaviorSubject<'light' | 'dark'>(
    this.isBrowser() ? (localStorage.getItem('theme') as 'light' | 'dark') || 'light' : 'light'
  );
  theme$ = this.themeSubject.asObservable();
  
  private searchSubject = new BehaviorSubject<string>('');
  search$ = this.searchSubject.asObservable();
  private employeeCountSubject = new BehaviorSubject<number>(0);
  employeeCount$ = this.employeeCountSubject.asObservable();

  // ✅ BehaviorSubject to hold current employee list
  private employeesSubject = new BehaviorSubject<Employee[]>([]);
  employees$ = this.employeesSubject.asObservable();

  private readonly LOCAL_KEY = 'localEmployees';
  private isDataLoaded = false; // ✅ Track if data has been loaded

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (this.isBrowser()) {
      this.applyThemeToBody(this.themeSubject.value);
      
      this.theme$.subscribe(theme => {
        this.applyThemeToBody(theme);
      });

      // ✅ Load employees immediately on service creation (browser only)
      this.loadEmployeesOnInit();
    }
  }

  // ✅ Check if running in browser
  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  // ✅ Apply theme to document body (only in browser)
  private applyThemeToBody(theme: 'light' | 'dark') {
    if (!this.isBrowser()) return;
    
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  }

  // ✅ Load employees on service initialization
  private loadEmployeesOnInit(): void {
    if (this.isDataLoaded) return;

    console.log('🔄 Initializing employee data...');

    // Load local employees immediately (synchronous)
    const localEmployees = this.getLocalEmployees();
    
    if (localEmployees.length > 0) {
      console.log('✅ Found local employees, loading them first:', localEmployees.length);
      this.employeesSubject.next(localEmployees);
      this.employeeCountSubject.next(localEmployees.length);
    }

    // Then fetch API employees
    this.http.get<any>('https://dummyjson.com/users').pipe(
      map((res) => {
        const apiEmployees: Employee[] = res.users.map((u: any) => ({
          id: u.id,
          name: `${u.firstName} ${u.lastName}`,
          designation: u.company?.title || 'N/A',
          department: u.company?.department || 'N/A',
          profilePhotoUrl: u.image,
          email: u.email,
          phone: u.phone,
          age: u.age,
          dateOfJoining: new Date(),
          address: {
            city: u.address?.city || '',
            state: u.address?.state || '',
            stateCode: u.address?.stateCode || '',
            postalCode: u.address?.postalCode || '',
            country: u.address?.country || '',
          },
        }));

        // Merge API + Local
        const allEmployees = [...apiEmployees, ...localEmployees];

        console.log('✅ Total employees loaded:', allEmployees.length, 
                    `(API: ${apiEmployees.length}, Local: ${localEmployees.length})`);

        // Update count and BehaviorSubject
        this.employeeCountSubject.next(allEmployees.length);
        this.employeesSubject.next(allEmployees);
        this.isDataLoaded = true;

        return allEmployees;
      }),
      tap({
        error: (err) => {
          console.error('❌ Error loading API employees:', err);
          // If API fails, keep local employees
          if (localEmployees.length > 0) {
            console.log('⚠️ Using local employees only due to API error');
          }
        }
      })
    ).subscribe();
  }

  // ✅ Fetch employees (returns observable to existing data or triggers reload)
  getEmployees(): Observable<Employee[]> {
    // If data isn't loaded yet, trigger load
    if (!this.isDataLoaded && this.isBrowser()) {
      this.loadEmployeesOnInit();
    }
    return this.employees$;
  }

  // ✅ Get next employee ID
  getNextId(): number {
    const current = this.employeesSubject.getValue();
    const maxId = current.length > 0 ? Math.max(...current.map((e) => e.id)) : 0;
    return maxId + 1;
  }

  // ✅ Add new employee (updates BehaviorSubject + LocalStorage)
  addEmployee(newEmp: Employee): void {
    const currentEmployees = this.employeesSubject.getValue();
    const updatedEmployees = [...currentEmployees, newEmp];

    console.log('➕ Adding new employee:', {
      id: newEmp.id,
      name: newEmp.name,
      totalEmployees: updatedEmployees.length
    });

    // Update BehaviorSubject
    this.employeesSubject.next(updatedEmployees);
    this.employeeCountSubject.next(updatedEmployees.length);
    
    // Save only locally added employees (id > 30)
    const localEmployees = updatedEmployees.filter((e) => e.id > 30);
    this.saveLocalEmployees(localEmployees);
  }

  
  // ✅ Get one employee
  getEmployeeById(id: number): Observable<Employee | undefined> {
    return this.employees$.pipe(map((emps) => emps.find((e) => e.id === id)));
  }

  // ✅ Favourites handling
  toggleFavourite(id: number): void {
    if (this.isFavourite(id)) {
      this.favouriteEmployees = this.favouriteEmployees.filter((f) => f !== id);
    } else {
      this.favouriteEmployees.push(id);
    }
  }

  isFavourite(id: number): boolean {
    return this.favouriteEmployees.includes(id);
  }

  getFavourites(): Observable<Employee[]> {
    return this.employees$.pipe(
      map((emps) => emps.filter((e) => this.isFavourite(e.id)))
    );
  }

  // ✅ Helpers for search, theme, sort
  setSort(attribute: string) {
    this.sortSubject.next(attribute);
  }

  setTheme(theme: 'light' | 'dark') {
    if (this.isBrowser()) {
      localStorage.setItem('theme', theme);
    }
    this.themeSubject.next(theme);
  }

  setSearch(text: string) {
    this.searchSubject.next(text);
  }

  updateSearch(value: string) {
    this.searchSubject.next(value);
  }

  clearSearch() {
    this.searchSubject.next('');
  }

  // ✅ LocalStorage utilities
  private getLocalEmployees(): Employee[] {
    if (!this.isBrowser()) return [];
    
    const data = localStorage.getItem(this.LOCAL_KEY);
    if (!data) {
      console.log('📭 No local employees found in localStorage');
      return [];
    }
    
    try {
      const employees = JSON.parse(data);
      console.log('📖 Loaded from localStorage:', employees.length, 'employees');
      
      // Debug: Log each employee's name
      employees.forEach((emp: any, index: number) => {
        console.log(`   Employee ${index + 1}:`, {
          id: emp.id,
          name: emp.name,
          department: emp.department,
          designation: emp.designation
        });
      });
      
      // Convert dateOfJoining back to Date object if it's a string
      return employees.map((emp: any) => ({
        ...emp,
        dateOfJoining: emp.dateOfJoining ? new Date(emp.dateOfJoining) : new Date()
      }));
    } catch (error) {
      console.error('❌ Error parsing localStorage data:', error);
      return [];
    }
  }

  private saveLocalEmployees(employees: Employee[]): void {
    if (!this.isBrowser()) return;
    
    try {
      console.log('💾 Saving to localStorage:', employees.length, 'employees');
      
      // Debug: Log what we're saving
      employees.forEach((emp, index) => {
        console.log(`   Saving Employee ${index + 1}:`, {
          id: emp.id,
          name: emp.name,
          department: emp.department,
          designation: emp.designation
        });
      });
      
      localStorage.setItem(this.LOCAL_KEY, JSON.stringify(employees));
      console.log('✅ Successfully saved to localStorage');
      
      // Verify save
      const saved = localStorage.getItem(this.LOCAL_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        console.log('✅ Verification: localStorage now contains', parsed.length, 'employees');
      }
    } catch (error) {
      console.error('❌ Error saving to localStorage:', error);
    }
  }
}
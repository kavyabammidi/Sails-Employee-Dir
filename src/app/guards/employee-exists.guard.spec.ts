import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { employeeExistsGuard } from './employee-exists.guard';

describe('employeeExistsGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => employeeExistsGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});

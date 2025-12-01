import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  AbstractControl,
  ValidatorFn,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { EmployeeService } from '../services/employee.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastService } from '../services/toast.service';

declare var bootstrap: any;

// ✅ Custom validator for no all-same digits in phone number
function noAllSameDigitsValidator(): ValidatorFn {
  return (control: AbstractControl) => {
    const value = control.value;
    if (!value) return null;
    if (/^(\d)\1{9}$/.test(value)) {
      return { allSameDigits: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit {
  employeeForm!: FormGroup;

  departments = [
    'Human Resources', 'Engineering', 'Research and Development', 'Support',
    'Product Management', 'Marketing', 'Services', 'Accounting', 'Training', 'Legal'
  ];

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.setupModalListener();
  }

  initializeForm(): void {
    this.employeeForm = this.fb.group({
      id: [{ value: '', disabled: true }],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      age: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{1,2}$'),
        Validators.min(1)
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      department: ['', Validators.required],
      title: ['', Validators.required],
      profilePhotoUrl: [''],
      address: this.fb.group({
        city: ['', Validators.required],
        state: ['', Validators.required],
        stateCode: ['', Validators.required],
        postalCode: ['', Validators.required],
        country: ['', Validators.required],
      }),
      phone: ['', [
        Validators.pattern('^[0-9]{10}$'),
        noAllSameDigitsValidator()
      ]]
    });

    const nextId = this.employeeService.getNextId();
    this.employeeForm.patchValue({ id: nextId });
  }

  setupModalListener(): void {
    if (typeof document !== 'undefined') {
      const modalEl = document.getElementById('addEmployeeModal');
      if (modalEl) {
        modalEl.addEventListener('show.bs.modal', () => {
          this.resetForm();
        });
      }
    }
  }

  resetForm(): void {
    this.employeeForm.reset();
    const nextId = this.employeeService.getNextId();
    this.employeeForm.patchValue({ id: nextId });
  }

  closeModal(): void {
    if (typeof document !== 'undefined') {
      const modalEl = document.getElementById('addEmployeeModal');
      if (modalEl) {
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();
      }

      setTimeout(() => {
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) backdrop.remove();
        document.body.classList.remove('modal-open');
        document.body.style.removeProperty('overflow');
        document.body.style.removeProperty('padding-right');
      }, 300);
    }
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      this.toastService.show('⚠️ Please fill in all required fields correctly.', 'error');
      return;
    }

    const formValue = this.employeeForm.getRawValue();

    if (!formValue.firstName || !formValue.lastName) {
      this.toastService.show('❌ First Name and Last Name are required!', 'error');
      return;
    }

    if (!formValue.title) {
      this.toastService.show('❌ Designation/Title is required!', 'error');
      return;
    }

    const newEmployee: any = {
      id: parseInt(formValue.id) || this.employeeService.getNextId(),
      name: `${formValue.firstName.trim()} ${formValue.lastName.trim()}`,
      designation: formValue.title.trim(),
      department: formValue.department,
      dateOfJoining: new Date(),
      profilePhotoUrl: formValue.profilePhotoUrl || 'https://via.placeholder.com/150',
      email: formValue.email,
      phone: formValue.phone,
      age: parseInt(formValue.age),
      address: {
        city: formValue.address.city,
        state: formValue.address.state,
        stateCode: formValue.address.stateCode,
        postalCode: formValue.address.postalCode,
        country: formValue.address.country
      }
    };

    if (!newEmployee.name || newEmployee.name === ' ' || newEmployee.name === 'undefined undefined') {
      this.toastService.show('❌ Error: Employee name is invalid!', 'error');
      console.error('Invalid employee name:', newEmployee);
      return;
    }

    if (!newEmployee.designation) {
      this.toastService.show('❌ Error: Employee designation is invalid!', 'error');
      console.error('Invalid employee designation:', newEmployee);
      return;
    }

    try {
      this.employeeService.addEmployee(newEmployee);
      this.toastService.show('✅ Employee added successfully!', 'success');
      this.closeModal();
      this.resetForm();
    } catch (error) {
      this.toastService.show('❌ Error adding employee. Please try again.', 'error');
      console.error('❌ Error adding employee:', error);
    }
  }

  onCancel(): void {
    this.closeModal();
  }
}

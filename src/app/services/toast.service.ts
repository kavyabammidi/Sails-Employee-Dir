import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  show(message: string, type: 'success' | 'error' | 'info' = 'info') {
    const toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
      this.createToastContainer();
    }

    const bgClass = {
      success: 'bg-success text-white',
      error: 'bg-danger text-white',
      info: 'bg-primary text-white'
    }[type];

    const toast = document.createElement('div');
    toast.className = `toast align-items-center ${bgClass} border-0 show mb-2`;
    toast.role = 'alert';
    toast.ariaLive = 'assertive';
    toast.ariaAtomic = 'true';
    toast.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">${message}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    `;

    document.querySelector('.toast-container')?.appendChild(toast);

    // Auto remove after 3 seconds
    setTimeout(() => toast.remove(), 3000);
  }

  private createToastContainer() {
  const container = document.createElement('div');
  container.className = 'toast-container position-fixed top-0 start-50 translate-middle-x p-3 mt-3';
  document.body.appendChild(container);
}

}

import { HttpRequest, HttpHandlerFn, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoaderService } from '../services/loader.service'; // 

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const token = localStorage.getItem('token');
  const loaderService = inject(LoaderService);

  // 🔹 Clone request to include token (if exists)
  const clonedReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  // 🔹 Show loader before request
  loaderService.show();

  // 🔹 Hide loader when request completes (success or error)
  return next(clonedReq).pipe(
    finalize(() => loaderService.hide())
  );
};

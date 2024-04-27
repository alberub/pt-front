import { HttpInterceptorFn } from '@angular/common/http';

export const interceptor: HttpInterceptorFn = (req, next) => {
  
    const authToken = sessionStorage.getItem('token');

    if (authToken) {
      const authReq = req.clone({
        setHeaders: {
          'x-token': authToken
        }
      });
      return next(authReq)
    }

    return next(req);
}
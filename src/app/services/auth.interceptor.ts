import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/internal/operators';
import notify from 'devextreme/ui/notify';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {
  }

  intercept(req: HttpRequest<any>,
            next: HttpHandler): Observable<any> {
    if (req.method === 'GET') {
      return next.handle(req).pipe(
        catchError(((error: HttpErrorResponse): Observable<any> => {
          if (error.status === 403) {
            notify({message: 'Permission Denied', position: 'top'}, 'error', 1500);
          } else if (error.status === 500) {
            notify({message: error.error.value, position: 'top'}, 'error', 1500);
          } else {
            notify({message: error.message, position: 'top'}, 'error', 1500);
          }
          return throwError(error);
        })));
    }

    return next
      .handle(req)
      .pipe(
        tap((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            notify({message: 'Successful', position: 'top'}, 'success', 1500);
          }
        }),
        catchError(((error: HttpErrorResponse): Observable<any> => {
          if (error.status === 403) {
            notify({message: 'Permission Denied', position: 'top'}, 'error', 1500);
          } else if (error.status === 500) {
            notify({message: error.error.value, position: 'top'}, 'error', 1500);
          } else {
            notify({message: error.message, position: 'top'}, 'error', 1500);
          }
          return throwError(error);
        })));
  }
}

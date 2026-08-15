import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { GenericHttpService } from './generic-http.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  private POST_SALES = `api/POSSales/sales/create`;
private GET_SALES_LIST = `api/POSSales/sales`;
  constructor(
    private genericHttpService: GenericHttpService<any>
  ) {}
getSalesList(): Observable<any> {
  return this.genericHttpService
    .getAll<any>(this.GET_SALES_LIST)
    .pipe(map((response: any) => {

        if (
          response &&
          response.statusCode === 200 &&
          Array.isArray(response.data)
        ) {
          return response;
        }

        return {
          statusCode: 500,
          message: 'Invalid response',
          data: []
        };
      })

    );
}

  saveSales(postData: any): Observable<any> {
    return this.genericHttpService.create(this.POST_SALES, postData)
      .pipe(
        catchError((error) => {

          console.error(
            'Error occurred while saving Sales:',
            error
          );

          const errorMessage =
            error?.error?.message ||
            'Failed to save sales. Please try again.';

          Swal.fire({
            icon: 'error',
            title: 'Submission Failed',
            text: errorMessage
          });

          return throwError(
            () => new Error('Failed to save sales')
          );
        })
      );
  }
}
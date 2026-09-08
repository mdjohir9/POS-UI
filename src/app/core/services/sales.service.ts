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
  private GET_SALES_INVOICE = `api/POSSales/sales/invoice`;
  constructor(
    private genericHttpService: GenericHttpService<any>
  ) {}

   getSalesInvoiceById(id: number): Observable<any> {

    return this.genericHttpService .getById<any>(  this.GET_SALES_INVOICE, id )
      .pipe(
        map((response: any) => {
          if (response) {
            return response;
          }
          return {
            statusCode: 500,
            message: 'Invalid response',
            data: null
          };

        }),
        catchError((error) => {

          console.error(
            'Error occurred while loading Brand:',
            error
          );

          return throwError(
            () => error
          );

        })

      );
  }
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
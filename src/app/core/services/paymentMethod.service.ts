import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { GenericHttpService } from './generic-http.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class PaymentMethodService {

  private companyId: string | null;
  private userId: string | null;

  private GET_PAYMENT_METHODS = `api/POSSalesPaymentMethod/payment-methods`;
  private GET_PAYMENT_METHOD_BY_ID = `/api/POSSalesPaymentMethod/payment-method/`;
  private POST_PAYMENT_METHOD = `/api/POSSalesPaymentMethod/create`;
  private UPDATE_PAYMENT_METHOD = `/api/POSSalesPaymentMethod/update`;
  private DELETE_PAYMENT_METHOD = `/api/POSSalesPaymentMethod/delete`;

  constructor(
    private genericHttpService: GenericHttpService<any>
  ) {
    this.companyId = sessionStorage.getItem('__companyId__');
    this.userId = sessionStorage.getItem('__useId__');
  }

  // =========================
  // Get All Payment Methods
  // =========================
  getPaymentMethods(): Observable<any> {
    return this.genericHttpService
      .getAll<any>(`${this.GET_PAYMENT_METHODS}?companyId=${this.companyId}`)
      .pipe(
        map((response: any) => {
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

  // =========================
  // Get Payment Method By ID
  // =========================
  getPaymentMethodById(id: any): Observable<any> {

    return this.genericHttpService
      .getById<any>(
        this.GET_PAYMENT_METHOD_BY_ID,
        id
      )
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
        })
      );
  }

  // =========================
  // Create Payment Method
  // =========================
  savePaymentMethod(postData: any): Observable<any> {

    return this.genericHttpService
      .create(
        this.POST_PAYMENT_METHOD,
        postData
      )
      .pipe(
        catchError((error) => {

          console.error(
            'Error occurred while saving Payment Method:',
            error
          );

          const errorMessage =
            error?.error?.message ||
            'Failed to save payment method. Please try again.';

          Swal.fire({
            icon: 'error',
            title: 'Submission Failed',
            text: errorMessage
          });

          return throwError(
            () => new Error('Failed to save payment method')
          );
        })
      );
  }

  // =========================
  // Update Payment Method
  // =========================
  updatePaymentMethod(
    postData: any,
    id: any
  ): Observable<any> {

    const url =
      `${this.UPDATE_PAYMENT_METHOD}/${id}`;

    return this.genericHttpService
      .update(
        url,
        postData
      )
      .pipe(
        catchError((error) => {

          console.error(
            'Error occurred while updating Payment Method:',
            error
          );

          const errorMessage =
            error?.error?.message ||
            'Failed to update payment method. Please try again.';

          Swal.fire({
            icon: 'error',
            title: 'Update Failed',
            text: errorMessage
          });

          return throwError(
            () => new Error('Failed to update payment method')
          );
        })
      );
  }

  // =========================
  // Delete Payment Method
  // =========================
  deletePaymentMethod(id: any): Observable<any> {

    const url =
      `${this.DELETE_PAYMENT_METHOD}/${id}` +
      `?userId=${this.userId}`;

    return this.genericHttpService
      .genericdelete(url)
      .pipe(
        catchError((error) => {

          console.error(
            'Error occurred while deleting Payment Method:',
            error
          );

          const errorMessage =
            error?.error?.message ||
            'Failed to delete payment method. Please try again.';

          Swal.fire({
            icon: 'error',
            title: 'Delete Failed',
            text: errorMessage
          });

          return throwError(
            () => new Error('Failed to delete payment method')
          );
        })
      );
  }
}
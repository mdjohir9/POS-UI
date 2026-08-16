import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { GenericHttpService } from './generic-http.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  private companyId: string | null;
  private userId: string | null;

  // =========================
  // Purchase API Endpoints
  // =========================

  private GET_PURCHASES =
    `api/POSPurchase/Purchase`;

  private GET_PURCHASE_BY_ID =
    `api/POSPurchase/purchase/`;

  private POST_PURCHASE =
    `api/POSPurchase/purchase/create`;

  private UPDATE_PURCHASE =
    `api/POSPurchase/purchase/update`;

  private DELETE_PURCHASE =
    `api/POSPurchase/purchase/delete`;


  constructor(
    private genericHttpService: GenericHttpService<any>
  ) {

    this.companyId =
      sessionStorage.getItem('__companyId__');

    this.userId =
      sessionStorage.getItem('__useId__');
  }


  // =========================
  // Get All Purchases
  // =========================

  getPurchases(): Observable<any> {

    return this.genericHttpService
      .getAll<any>(
        `${this.GET_PURCHASES}?companyId=${this.companyId}`
      )
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

        }),

        catchError((error) => {

          console.error(
            'Error occurred while loading Purchases:',
            error
          );

          return throwError(
            () => error
          );

        })

      );
  }


  // =========================
  // Get Purchase By ID
  // =========================

  getPurchaseById(id: any): Observable<any> {

    return this.genericHttpService
      .getById<any>(
        this.GET_PURCHASE_BY_ID,
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

        }),

        catchError((error) => {

          console.error(
            'Error occurred while loading Purchase:',
            error
          );

          return throwError(
            () => error
          );

        })

      );
  }


  // =========================
  // Create Purchase
  // =========================

  savePurchase(postData: any): Observable<any> {

    return this.genericHttpService
      .create(
        this.POST_PURCHASE,
        postData
      )
      .pipe(

        catchError((error) => {

          console.error(
            'Error occurred while saving Purchase:',
            error
          );

          const errorMessage =
            error?.error?.message ||
            'Failed to save purchase. Please try again.';

          Swal.fire({
            icon: 'error',
            title: 'Submission Failed',
            text: errorMessage
          });

          return throwError(
            () => new Error(
              'Failed to save purchase'
            )
          );

        })

      );
  }


  // =========================
  // Update Purchase
  // =========================

  updatePurchase(
    postData: any,
    id: any
  ): Observable<any> {

    const url =
      `${this.UPDATE_PURCHASE}/${id}`;

    return this.genericHttpService
      .update(
        url,
        postData
      )
      .pipe(

        catchError((error) => {

          console.error(
            'Error occurred while updating Purchase:',
            error
          );

          const errorMessage =
            error?.error?.message ||
            'Failed to update purchase. Please try again.';

          Swal.fire({
            icon: 'error',
            title: 'Update Failed',
            text: errorMessage
          });

          return throwError(
            () => new Error(
              'Failed to update purchase'
            )
          );

        })

      );
  }


  // =========================
  // Delete Purchase
  // =========================

  deletePurchase(id: any): Observable<any> {

    const url =
      `${this.DELETE_PURCHASE}/${id}` +
      `?userId=${this.userId}`;

    return this.genericHttpService
      .genericdelete(url)
      .pipe(

        catchError((error) => {

          console.error(
            'Error occurred while deleting Purchase:',
            error
          );

          const errorMessage =
            error?.error?.message ||
            'Failed to delete purchase. Please try again.';

          Swal.fire({
            icon: 'error',
            title: 'Delete Failed',
            text: errorMessage
          });

          return throwError(
            () => new Error(
              'Failed to delete purchase'
            )
          );

        })

      );
  }

}
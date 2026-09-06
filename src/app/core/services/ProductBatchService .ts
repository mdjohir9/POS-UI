import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { GenericHttpService } from './generic-http.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ProductBatchService  {
  private companyId: string | null;
  private userId: string | null;

  private GET_PRODUCT_BATCHES = `api/POSProductBatch/batchs`;
  private GET_PRODUCT_BATCH_BY_ID = `api/POSProductBatch/batch`;
  private POST_PRODUCT_BATCH = `api/POSProductBatch/batch/create`;
  private UPDATE_PRODUCT_BATCH = `api/POSProductBatch/batch/update`;
  private DELETE_PRODUCT_BATCH = `api/POSProductBatch/batch/delete`;

  constructor(
    private genericHttpService: GenericHttpService<any>
  ) {
    this.companyId = sessionStorage.getItem('__companyId__');
    this.userId = sessionStorage.getItem('__useId__');
  }

  // =========================
  // Get All Product Batches
  // =========================
  getProductBatches(): Observable<any> {
    return this.genericHttpService
      .getAll<any>(`${this.GET_PRODUCT_BATCHES}?companyId=${this.companyId}`)
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
  // Create Product Batch
  // =========================
  createProductBatch(postData: any): Observable<any> {
    return this.genericHttpService
      .create(this.POST_PRODUCT_BATCH, postData)
      .pipe(
        catchError((error) => {
          console.error(
            'Error occurred while creating Product Batch:',
            error
          );

          const errorMessage =
            error?.error?.message ||
            'Failed to create product batch. Please try again.';

          Swal.fire({
            icon: 'error',
            title: 'Submission Failed',
            text: errorMessage
          });

          return throwError(
            () => new Error('Failed to create product batch')
          );
        })
      );
  }

  // =========================
  // Get Product Batch By ID
  // =========================
  getProductBatchById(id: any): Observable<any> {
    return this.genericHttpService
      .getById<any>(
        this.GET_PRODUCT_BATCH_BY_ID,
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
  // Update Product Batch
  // =========================
  updateProductBatch(
    postData: any,
    id: any
  ): Observable<any> {

    const url =
      `${this.UPDATE_PRODUCT_BATCH}/${id}`;

    return this.genericHttpService
      .update(
        url,
        postData
      )
      .pipe(
        catchError((error) => {
          console.error(
            'Error occurred while updating Product Batch:',
            error
          );

          const errorMessage =
            error?.error?.message ||
            'Failed to update product batch. Please try again.';

          Swal.fire({
            icon: 'error',
            title: 'Update Failed',
            text: errorMessage
          });

          return throwError(
            () => new Error('Failed to update product batch')
          );
        })
      );
  }

  // =========================
  // Delete Product Batch
  // =========================
  deleteProductBatch(id: any): Observable<any> {

    const url =
      `${this.DELETE_PRODUCT_BATCH}/${id}` +
      `?userId=${this.userId}`;

    return this.genericHttpService
      .genericdelete(url)
      .pipe(
        catchError((error) => {
          console.error(
            'Error occurred while deleting Product Batch:',
            error
          );

          const errorMessage =
            error?.error?.message ||
            'Failed to delete product batch. Please try again.';

          Swal.fire({
            icon: 'error',
            title: 'Delete Failed',
            text: errorMessage
          });

          return throwError(
            () => new Error('Failed to delete product batch')
          );
        })
      );
  }
}
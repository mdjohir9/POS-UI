import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { GenericHttpService } from './generic-http.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private companyId: string | null;
  private userId: string | null;

  private GET_PRODUCTS = `api/POSProduct/products`;
  private GET_PRODUCT_BY_ID = `api/POSProduct/product/`;
  private GET_PRODUCT_BY_BARCODE = `api/POSProduct/product/barcode`;
  private POST_PRODUCT = `api/POSProduct/create`;
  private UPDATE_PRODUCT = `api/POSProduct/update`;
  private DELETE_PRODUCT = `api/POSProduct/delete`;

  constructor(
    private genericHttpService: GenericHttpService<any>
  ) {
    this.companyId = sessionStorage.getItem('__companyId__');
    this.userId = sessionStorage.getItem('__useId__');
  }

  // =========================
  // Get All Products
  // =========================
  getProducts(): Observable<any> {

    return this.genericHttpService
      .getAll<any>(this.GET_PRODUCTS)
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
  // Get Product By ID
  // =========================
  getProductById(id: any): Observable<any> {

    return this.genericHttpService
      .getById<any>(
        this.GET_PRODUCT_BY_ID,
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
  // Get Product By Barcode
  // =========================
  getProductByBarcode(
    barcode: string
  ): Observable<any> {

    const url =
      `${this.GET_PRODUCT_BY_BARCODE}` +
      `?companyId=${this.companyId}` +
      `&barcode=${encodeURIComponent(barcode)}`;

    return this.genericHttpService
      .getAll<any>(url)
      .pipe(
        map((response: any) => {

          if (
            response &&
            response.statusCode === 200 &&
            response.data
          ) {
            return response;
          }

          return {
            statusCode: 404,
            message: 'Product not found',
            data: null
          };
        })
      );
  }

  // =========================
  // Create Product
  // =========================
  saveProduct(postData: any): Observable<any> {

    return this.genericHttpService
      .create(
        this.POST_PRODUCT,
        postData
      )
      .pipe(
        catchError((error) => {

          console.error(
            'Error occurred while saving Product:',
            error
          );

          const errorMessage =
            error?.error?.message ||
            'Failed to save product. Please try again.';

          Swal.fire({
            icon: 'error',
            title: 'Submission Failed',
            text: errorMessage
          });

          return throwError(
            () => new Error('Failed to save product')
          );
        })
      );
  }

  // =========================
  // Update Product
  // =========================
  updateProduct(
    postData: any,
    id: any
  ): Observable<any> {

    const url =
      `${this.UPDATE_PRODUCT}/${id}`;

    return this.genericHttpService
      .update(
        url,
        postData
      )
      .pipe(
        catchError((error) => {

          console.error(
            'Error occurred while updating Product:',
            error
          );

          const errorMessage =
            error?.error?.message ||
            'Failed to update product. Please try again.';

          Swal.fire({
            icon: 'error',
            title: 'Update Failed',
            text: errorMessage
          });

          return throwError(
            () => new Error('Failed to update product')
          );
        })
      );
  }

  // =========================
  // Delete Product
  // =========================
  deleteProduct(id: any): Observable<any> {

    const url =
      `${this.DELETE_PRODUCT}/${id}` +
      `?userId=${this.userId}`;

    return this.genericHttpService
      .genericdelete(url)
      .pipe(
        catchError((error) => {

          console.error(
            'Error occurred while deleting Product:',
            error
          );

          const errorMessage =
            error?.error?.message ||
            'Failed to delete product. Please try again.';

          Swal.fire({
            icon: 'error',
            title: 'Delete Failed',
            text: errorMessage
          });

          return throwError(
            () => new Error('Failed to delete product')
          );
        })
      );
  }
}
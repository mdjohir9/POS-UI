import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import Swal from 'sweetalert2';

import { GenericHttpService } from './generic-http.service';

@Injectable({
  providedIn: 'root'
})
export class PosBrandService {

  private companyId: string | null;
  private userId: string | null;
  private GET_BRANDS = 'api/POSBrand/brands';
  private GET_BRAND_BY_ID = 'api/POSBrand/brand';
  private POST_BRAND = 'api/POSBrand/brand/create';
  private UPDATE_BRAND = 'api/POSBrand/brand/update';
  private DELETE_BRAND ='api/POSBrand/brand/delete';

  constructor(
    private genericHttpService: GenericHttpService<any>
  ) {

    this.companyId =
      sessionStorage.getItem('__companyId__');

    this.userId =
      sessionStorage.getItem('__useId__');
  }

  getBrands(): Observable<any> {

    return this.genericHttpService
      .getAll<any>(
        `${this.GET_BRANDS}?companyId=${this.companyId}`
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
            'Error occurred while loading Brands:',
            error
          );

          return throwError(
            () => error
          );

        })

      );
  }

  getBrandById(id: number): Observable<any> {

    return this.genericHttpService
      .getById<any>(
        this.GET_BRAND_BY_ID,
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
            'Error occurred while loading Brand:',
            error
          );

          return throwError(
            () => error
          );

        })

      );
  }

  saveBrand(postData: any): Observable<any> {

    return this.genericHttpService
      .create(
        this.POST_BRAND,
        postData
      )
      .pipe(
        catchError((error) => {
          console.error(
            'Error occurred while saving Brand:',
            error
          );
          const errorMessage =
            error?.error?.message ||
            'Failed to save brand. Please try again.';
          Swal.fire({
            icon: 'error',
            title: 'Submission Failed',
            text: errorMessage
          });
          return throwError(
            () => new Error(
              'Failed to save brand'
            )
          );

        })

      );
  }

  updateBrand(
    postData: any,
    id: number
  ): Observable<any> {

    const url = `${this.UPDATE_BRAND}/${id}`;

    return this.genericHttpService
      .update(
        url,
        postData
      )
      .pipe(

        catchError((error) => {

          console.error(
            'Error occurred while updating Brand:',
            error
          );

          const errorMessage =
            error?.error?.message ||
            'Failed to update brand. Please try again.';

          Swal.fire({
            icon: 'error',
            title: 'Update Failed',
            text: errorMessage
          });

          return throwError(
            () => new Error(
              'Failed to update brand'
            )
          );

        })

      );
  }


  // =========================
  // Delete Brand
  // =========================

  deleteBrand(id: number): Observable<any> {

    const url =
      `${this.DELETE_BRAND}/${id}` +
      `?userId=${this.userId}`;

    return this.genericHttpService
      .genericdelete(url)
      .pipe(

        catchError((error) => {

          console.error(
            'Error occurred while deleting Brand:',
            error
          );

          const errorMessage =
            error?.error?.message ||
            'Failed to delete brand. Please try again.';

          Swal.fire({
            icon: 'error',
            title: 'Delete Failed',
            text: errorMessage
          });

          return throwError(
            () => new Error(
              'Failed to delete brand'
            )
          );

        })

      );
  }

}
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { GenericHttpService } from './generic-http.service';

@Injectable({
  providedIn: 'root'
})
export class PosCategoryService {

  private GET_CATEGORIES = 'api/POSCategory/categories';
  private GET_CATEGORY_BY_ID = 'api/POSCategory/category';
  private POST_CATEGORY = 'api/POSCategory/category/create';
  private UPDATE_CATEGORY = 'api/POSCategory/category/update';
  private DELETE_CATEGORY = 'api/POSCategory/category/delete';

  constructor(
    private genericHttpService: GenericHttpService<any>
  ) {}

  private get companyId(): string {
    return sessionStorage.getItem('__companyId__') || localStorage.getItem('__companyId__') || sessionStorage.getItem('_companyId') || '';
  }

  private get userId(): string {
    return sessionStorage.getItem('__userId__') || localStorage.getItem('__userId__') || sessionStorage.getItem('_userId') || '';
  }

  getCategories(): Observable<any> {
    const compId = this.companyId;
    return this.genericHttpService
      .getAll<any>(`${this.GET_CATEGORIES}?companyId=${compId}`)
      .pipe(
        map((response: any) => {
          if (
            response &&
            (response.statusCode === 200 || response.statusCode === 201) &&
            Array.isArray(response.data)
          ) {
            return response;
          }
          return {
            statusCode: response?.statusCode || 500,
            message: response?.message || 'Invalid response',
            data: []
          };
        }),
        catchError((error) => {
          console.error('Error occurred while loading Categories:', error);
          return throwError(() => error);
        })
      );
  }

  getCategoryById(id: number): Observable<any> {
    return this.genericHttpService
      .getById<any>(this.GET_CATEGORY_BY_ID, id)
      .pipe(
        map((response: any) => response || { statusCode: 500, message: 'Invalid response', data: null }),
        catchError((error) => throwError(() => error))
      );
  }

  saveCategory(postData: any): Observable<any> {
    const payload = {
      ...postData,
      companyId: this.companyId,
      createdBy: this.userId
    };

    return this.genericHttpService
      .create(this.POST_CATEGORY, payload)
      .pipe(
        catchError((error) => {
          const errorMessage = error?.error?.message || 'Failed to save category.';
          Swal.fire({ icon: 'error', title: 'Submission Failed', text: errorMessage });
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  updateCategory(postData: any, id: number): Observable<any> {
    const url = `${this.UPDATE_CATEGORY}/${id}`;
    const payload = {
      ...postData,
      id: id,
      companyId: this.companyId,
      updatedBy: this.userId
    };

    return this.genericHttpService
      .update(url, payload)
      .pipe(
        catchError((error) => {
          const errorMessage = error?.error?.message || 'Failed to update category.';
          Swal.fire({ icon: 'error', title: 'Update Failed', text: errorMessage });
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  deleteCategory(id: number): Observable<any> {
    const url = `${this.DELETE_CATEGORY}/${id}?userId=${this.userId}`;

    return this.genericHttpService
      .genericdelete(url)
      .pipe(
        catchError((error) => {
          const errorMessage = error?.error?.message || 'Failed to delete category.';
          Swal.fire({ icon: 'error', title: 'Delete Failed', text: errorMessage });
          return throwError(() => new Error(errorMessage));
        })
      );
  }
}
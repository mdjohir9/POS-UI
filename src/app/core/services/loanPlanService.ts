
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, delay, map, Observable, of, throwError } from 'rxjs';
import { IPaginatedResponse } from '../models/interfaces/Ipaginated-response';
import { response } from 'express';
import { GenericHttpService } from './generic-http.service';
import { IApiResponse } from '../models/interfaces/IApiResponse';
import { ICustomerIDName } from '../models/interfaces/ICustomerIDName';
import { ILoanApplication } from '../models/interfaces/ILoanApplication';
import Swal from 'sweetalert2';
@Injectable({
    providedIn: 'root'
  })
export class LoanPlanService {

    private companyId: string | null;
    private customerId: string | null;
    private userId: string | null;
    private GET_LOAN_PLANS = `api/LoanPlan/plans`;
    private POST_LOAN_PLANS = `api/LoanPlan/create`;
    private UPDATE_LOAN_PLANS = `api/LoanPlan/update`;
    private GET_LOAN_PLANS_BYE_ID = `api/LoanPlan/plan`;
    private DELETE_PLAN_BY_ID = `api/LoanPlan/delete`;


    constructor(private genericHttpService: GenericHttpService<any>) {
        this.companyId = sessionStorage.getItem('__companyId__');
        this.customerId = sessionStorage.getItem('__customerID__');
        this.userId = sessionStorage.getItem('__useId__');

    }
    getLoanPlanById(id:any): Observable<any> {
      return this.genericHttpService.getById<any>(this.GET_LOAN_PLANS_BYE_ID, id).pipe(
          map((response: any) => {
              if (response) {
                  return response;
              } else {
                  return { statusCode: 500, message: 'Invalid response', data: [] };
              }
          })
      );
  }
    getLaonPlans(): Observable<any> {
        return this.genericHttpService.getAll<any>(`${this.GET_LOAN_PLANS}`).pipe(
            map((response: any) => {
                if (response && response.statusCode === 200 && Array.isArray(response.data)) {
                    return response;
                } else {
                    return { statusCode: 500, message: 'Invalid response', data: [] };
                }
            })
        );
    }

    saveLoanPlan(postData: any): Observable<any> {
      const url = `${this.POST_LOAN_PLANS}`; // Use template literal for better readability
      return this.genericHttpService.create(url, postData).pipe(
        catchError((error) => {
          console.error('Error occurred while saving Loan Loan Plan:', error);
          const errorMessage = error?.error?.message || 'Failed to submit loan. Please try again.';
             console.log(errorMessage);
             Swal.fire({
               icon: 'error',
               title: 'Submission Failed',
               text: errorMessage
             });
          return throwError(() => new Error('Failed to save Loan Plan'));
        })
      );
    }

    UpdateLoanPlan(postData: any,id : any): Observable<any> {
      const url = `${this.UPDATE_LOAN_PLANS}/${id}`; // Use template literal for better readability
      return this.genericHttpService.update(url, postData).pipe(
        catchError((error) => {
          console.error('Error occurred while saving Loan Loan Plan:', error);
          const errorMessage = error?.error?.message || 'Failed to submit loan. Please try again.';
             console.log(errorMessage);
             Swal.fire({
               icon: 'error',
               title: 'Submission Failed',
               text: errorMessage
             });
          return throwError(() => new Error('Failed to save Loan Plan'));
        })
      );
    }
    DeletePlanByeId(id: any): Observable<any> {
      return this.genericHttpService.genericdelete(`${this.DELETE_PLAN_BY_ID}/${id}?userId=${this.userId}`);
    }
  
}
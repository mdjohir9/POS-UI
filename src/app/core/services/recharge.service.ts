
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
export class RechargeService {

    private userId: string | null;
    private customerId: string | null;
    private GET_RECHARGE_REQUEST = `api/Recharge/recharge-requerts`;
    private GET_REQUEST_BYE_CUSTOMER = `api/Recharge/requerts-ByeCustomerId`;
    private POST_RECHARGE_REQUEST = `api/Recharge/create`;
    private PUR_RECHARGE_REQUEST = `api/Recharge/update`;
    private PUT_RECHARGE_APPROVE = `api/Recharge/approve`;
    private GET_RECHARGE_BYE_ID = `api/Recharge/recharge`;

    constructor(private genericHttpService: GenericHttpService<any>) { 
      this.userId = sessionStorage.getItem('__useId__');
      this.customerId = sessionStorage.getItem('__customerID__');

    }
    getRechargeListById(id:any): Observable<any> {
      return this.genericHttpService.getById<any>(this.GET_RECHARGE_BYE_ID, id).pipe(
          map((response: any) => {
              if (response) {
                  return response;
              } else {
                  return { statusCode: 500, message: 'Invalid response', data: [] };
              }
          })
      );
  }
    getRechargeList(): Observable<any> {
      return this.genericHttpService.getAll<any>(`${this.GET_RECHARGE_REQUEST}`).pipe(
        map((response: any) => {
          if (response && response.statusCode === 200 && Array.isArray(response.data)) {
            return response;
          } else {
            return { statusCode: 500, message: 'Invalid response', data: [] };
          }
        })
      );
    }
    getRechargeListByeCustomer(): Observable<any> {
      return this.genericHttpService.getAll<any>(`${this.GET_REQUEST_BYE_CUSTOMER}?customerId=${this.customerId}`).pipe(
        map((response: any) => {
          if (response && response.statusCode === 200 && Array.isArray(response.data)) {
            return response;
          } else {
            return { statusCode: 500, message: 'Invalid response', data: [] };
          }
        })
      );
    }

    saveRechargeRequest(postData: any): Observable<any> {
      const url = `${this.POST_RECHARGE_REQUEST}`; // Use template literal for better readability
      return this.genericHttpService.create(url, postData).pipe(
        catchError((error) => {
          console.error('Error occurred while saving Loan application:', error);
          const errorMessage = error?.error?.message || 'Failed to submit loan. Please try again.';
             console.log(errorMessage);
             Swal.fire({
               icon: 'error',
               title: 'Submission Failed',
               text: errorMessage
             });
          return throwError(() => new Error('Failed to save Loan application'));
        })
      );
    }
    UpdateRechargeRequest(postData: any,id:any): Observable<any> {
      const url = `${this.PUR_RECHARGE_REQUEST}/${id}`; // Use template literal for better readability
      return this.genericHttpService.update(url, postData).pipe(
        catchError((error) => {
          console.error('Error occurred while saving Loan application:', error);
          const errorMessage = error?.error|| 'Failed to submit loan. Please try again.';
             console.log(errorMessage);
             Swal.fire({
               icon: 'warning',
               title: 'Submission Failed',
               text: errorMessage
             });
          return throwError(() => new Error('Failed to save Loan application'));
        })
      );
    }



    approveRechargeApplication(postData: any): Observable<any> {
      const url = `${this.PUT_RECHARGE_APPROVE}/${postData.rechargeID}?IsApproved=${postData.approval_status}&userId=${this.userId}`;
      return this.genericHttpService.updateOrdering(url).pipe(
        catchError((error) => {
          console.error('Error occurred while saving leave application:', error);

          const errorMessage = error?.error?.message || 'Failed to submit loan. Please try again.';
          console.log(errorMessage);
          Swal.fire({
            icon: 'error',
            title: 'Approve Failed',
            text: errorMessage
          });
          return throwError(() => new Error('Failed to save recharge request application'));
        })
      );
    }

}
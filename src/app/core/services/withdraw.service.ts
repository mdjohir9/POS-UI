
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
export class WithdrawService {

    private companyId: string | null;
    private customerId: string | null;
    private userId: string | null;
    private GET_WITHDRAW_REQUEST = `api/Withdraw/withdraw-requests`;
    private GET_REQUEST_BYE_CUSTOMER = `api/Withdraw/withdraw-requests-by-customerId`;
    private POST_WITHDRAW_REQUEST = `api/Withdraw/create`;
    private PUR_WITHDRAW_REQUEST = `api/Withdraw/update`;
    private PUT_WITHDRAW_APPROVE = `api/Withdraw/approve`;
    private GET_WITHDRAW_REQUEST_BY_ID = `api/Withdraw/withdraw`;
    private PUT_WITHDRAW_REJECT = `api/Withdraw/reject`;

    constructor(private genericHttpService: GenericHttpService<any>) { 
      this.companyId = sessionStorage.getItem('__companyId__');
      this.customerId = sessionStorage.getItem('__customerID__');
      this.userId = sessionStorage.getItem('__useId__');

    }
    getWithdrawtById(id:any): Observable<any> {
      return this.genericHttpService.getById<any>(this.GET_WITHDRAW_REQUEST_BY_ID, id).pipe(
          map((response: any) => {
              if (response) {
                  return response;
              } else {
                  return { statusCode: 500, message: 'Invalid response', data: [] };
              }
          })
      );
  }
    getWithdrawList(): Observable<any> {
      return this.genericHttpService.getAll<any>(`${this.GET_WITHDRAW_REQUEST}`).pipe(
        map((response: any) => {
          if (response && response.statusCode === 200 && Array.isArray(response.data)) {
            return response;
          } else {
            return { statusCode: 500, message: 'Invalid response', data: [] };
          }
        })
      );
    }
    getWithdrawListByeCustomer(): Observable<any> {
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

    saveWithdrawRequest(postData: any): Observable<any> {
      const url = `${this.POST_WITHDRAW_REQUEST}`;
      
      return this.genericHttpService.create(url, postData).pipe(
        catchError((error) => {
          console.error('Error occurred while saving withdraw request:', error);
    
          const apiMessage = error?.error?.message || 'Failed to submit withdraw request. Please try again.';
    
          Swal.fire({
            icon: 'error',
            title: 'Withdraw Request Failed',
            text: apiMessage,   // Show API message properly
            confirmButtonColor: '#3085d6' // Optional: Nice blue button
          });
    
          return throwError(() => new Error(apiMessage));
        })
      );
    }
  UpdateWithdrawRequest(postData: any, id: any): Observable<any> {
    const url = `${this.PUR_WITHDRAW_REQUEST}/${id}`; // Use template literal for better readability
    return this.genericHttpService.update(url, postData).pipe(
      catchError((error) => {
        console.error('Error occurred while saving Loan application:', error);
        const errorMessage = error?.error || 'Failed to submit loan. Please try again.';
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

    approveWithdrawApplication(postData: any): Observable<any> {
      const url = `${this.PUT_WITHDRAW_APPROVE}/${postData.withdrawaID}?userId=${this.userId}&transctionId=${postData.transactionID}`;
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

    rejectWithdrawApplication(postData: any): Observable<any> {
      const url = `${this.PUT_WITHDRAW_REJECT}/${postData.withdrawaID}?userId=${this.userId}&remarks=${postData.remarks}`;
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

    getWithdrawById(id: number): Observable<any> {
      return this.genericHttpService.getById<any>(this.GET_WITHDRAW_REQUEST_BY_ID, id).pipe(
        map((response: any) => {
          if (response && response.statusCode === 200 && response.data) {
            return response;  // Return the response if it's valid
          } else {
            return { statusCode: 500, message: 'Invalid response', data: null };  // Handle invalid responses
          }
        })
      );
    }
    
}
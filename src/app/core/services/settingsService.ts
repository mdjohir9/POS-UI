
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
export class SettingsService {

    private companyId: string | null;
    private customerId: string | null;
    private GET_PAYMENT_METHOD  = `api/PaymentMethod/paymentMetdods`;
    private GET_PAYMENT_METHOD_BY_ID = `api/PaymentMethod/paymentMetdod`;
    private POST_PAYMENT_METHOD = `api/PaymentMethod/create`;
    private UPDATE_PAYMENT_METHOD = `api/PaymentMethod/update`;
    private DELETE_PAYMENT_METHOD = `api/PaymentMethod/delete`;
    //recharge account start
    private GET_RECHARGE_ACCOUNTS = `api/RechargeAccount/rechargeAccounts`;
    private GET_RECHARGE_ACCOUNT_BY_ID = `api/RechargeAccount/rechargeAccount`;
    private POST_RECHARGE_ACCOUNTS = `api/RechargeAccount/create`;
    private UPDATE_RECHARGE_ACCOUNTS = `api/RechargeAccount/update`;
    private DELETE_RECHARGE_ACCOUNTS = `api/RechargeAccount/delete`;
    constructor(private genericHttpService: GenericHttpService<any>) { 
      this.companyId = sessionStorage.getItem('__companyId__');
      this.customerId = sessionStorage.getItem('__customerID__');

    }
    getPaymentMethodById(id: number): Observable<any> {
      return this.genericHttpService.getById<any>(this.GET_PAYMENT_METHOD_BY_ID, id).pipe(
        map((response: any) => {
          if (response && response.statusCode === 200 && response.data) {
            return response;  // Return the response if it's valid
          } else {
            return { statusCode: 500, message: 'Invalid response', data: null };  // Handle invalid responses
          }
        })
      );
    }

 savePaymentMethod(postData: any): Observable<any> {
      const url = `${this.POST_PAYMENT_METHOD}`;
      
      return this.genericHttpService.create(url, postData).pipe(
        catchError((error) => {
          console.error('Error occurred while saving withdraw request:', error);
    
          const apiMessage = error?.error?.message || 'Failed to submit request. Please try again.';
    
          Swal.fire({
            icon: 'error',
            title: 'Request Failed',
            text: apiMessage,   // Show API message properly
            confirmButtonColor: '#3085d6' // Optional: Nice blue button
          });
    
          return throwError(() => new Error(apiMessage));
        })
      );
    }

     updatePaymentMethod(postData: any, id :any): Observable<any> {
      const url = `${this.UPDATE_PAYMENT_METHOD}/${id}`;
      
      return this.genericHttpService.update(url, postData).pipe(
        catchError((error) => {
          console.error('Error occurred while saving withdraw request:', error);
    
          const apiMessage = error?.error?.message || 'Failed to submit request. Please try again.';
    
          Swal.fire({
            icon: 'error',
            title: 'Request Failed',
            text: apiMessage,   // Show API message properly
            confirmButtonColor: '#3085d6' // Optional: Nice blue button
          });
    
          return throwError(() => new Error(apiMessage));
        })
      );
    }
    getPaymentMethodList(): Observable<any> {
        return this.genericHttpService.getAll<any>(`${this.GET_PAYMENT_METHOD}`).pipe(
            map((response: any) => {
                if (response && response.statusCode === 200 && Array.isArray(response.data)) {
                    return response;
                } else {
                    return { statusCode: 500, message: 'Invalid response', data: [] };
                }
            })
        );
    }

    DeletePlanByeId(id: any): Observable<any> {
      return this.genericHttpService.genericdelete(`${this.DELETE_PAYMENT_METHOD}/${id}`);
    }
  
///Recharge Account Start

    getRechargeAccountList(): Observable<any> {
        return this.genericHttpService.getAll<any>(`${this.GET_RECHARGE_ACCOUNTS}`).pipe(
            map((response: any) => {
                if (response && response.statusCode === 200 && Array.isArray(response.data)) {
                    return response;
                } else {
                    return { statusCode: 500, message: 'Invalid response', data: [] };
                }
            })
        );
    }


    getRechargeAccountById(id: number): Observable<any> {
      return this.genericHttpService.getById<any>(this.GET_RECHARGE_ACCOUNT_BY_ID, id).pipe(
        map((response: any) => {
          if (response && response.statusCode === 200 && response.data) {
            return response;  // Return the response if it's valid
          } else {
            return { statusCode: 500, message: 'Invalid response', data: null };  // Handle invalid responses
          }
        })
      );
    }

 saveRechargeAccount(postData: any): Observable<any> {
      const url = `${this.POST_RECHARGE_ACCOUNTS}`;
      
      return this.genericHttpService.create(url, postData).pipe(
        catchError((error) => {
          console.error('Error occurred while saving withdraw request:', error);
    
          const apiMessage = error?.error?.message || 'Failed to submit request. Please try again.';
    
          Swal.fire({
            icon: 'error',
            title: 'Request Failed',
            text: apiMessage,   // Show API message properly
            confirmButtonColor: '#3085d6' // Optional: Nice blue button
          });
    
          return throwError(() => new Error(apiMessage));
        })
      );
    }

     updateRechargeAccount(postData: any, id :any): Observable<any> {
      const url = `${this.UPDATE_RECHARGE_ACCOUNTS}/${id}`;
      
      return this.genericHttpService.update(url, postData).pipe(
        catchError((error) => {
          console.error('Error occurred while saving withdraw request:', error);
    
          const apiMessage = error?.error?.message || 'Failed to submit request. Please try again.';
    
          Swal.fire({
            icon: 'error',
            title: 'Request Failed',
            text: apiMessage,   // Show API message properly
            confirmButtonColor: '#3085d6' // Optional: Nice blue button
          });
    
          return throwError(() => new Error(apiMessage));
        })
      );
    }

    DeleteRechargeAccountByeId(id: any): Observable<any> {
      return this.genericHttpService.genericdelete(`${this.DELETE_RECHARGE_ACCOUNTS}/${id}`);
    }
  
}
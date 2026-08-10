
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
export class DashboardService {
    private companyId: string | null;
    private customerId: string | null;
    private GET_COMPANY_API_CALL_Url: string;
    private GET_LOAN_BALANCE = `api/Loan/balance`;
    private GET_TRANSCTION_BYE_ID = `api/Transction/transactions`;
    private GET_ADMIN_BALANCE = `api/Dashboard/admin-balance`;
    private GET_RECOVERD_DISBURSED_SUMMARY = `api/Dashboard/repayment-disbursed`;
    private GET_RECHARGE_WITHDRAW_SUMMARY = `api/Dashboard/recharge-withdraw`;


    constructor(private genericHttpService: GenericHttpService<any>) { 
      this.companyId = sessionStorage.getItem('__companyId__');
      this.customerId = sessionStorage.getItem('__customerID__');

    }

    getLoanBalanceById(customerId: number): Observable<any> {
        return this.genericHttpService.getById<any>(this.GET_LOAN_BALANCE, customerId).pipe(
          map((response: any) => {
            if (response && response.statusCode === 200 && response.data) {
              return response;  // Return the response if it's valid
            } else {
              return { statusCode: 500, message: 'Invalid response', data: null };  // Handle invalid responses
            }
          })
        );
      } 
    getAdminBalance(): Observable<any> {
        return this.genericHttpService.getAll<any>(this.GET_ADMIN_BALANCE).pipe(
          map((response: any) => {
            if (response && response.statusCode === 200 && response.data) {
              return response;  // Return the response if it's valid
            } else {
              return { statusCode: 500, message: 'Invalid response', data: null };  // Handle invalid responses
            }
          })
        );
      }

      getRecoverdAndDisbursedSummary(year:any): Observable<any> {
        return this.genericHttpService.getAll<any>(`${this.GET_RECOVERD_DISBURSED_SUMMARY}/${year}`).pipe(
          map((response: any) => {
            if (response && response.statusCode === 200 && response.data) {
              return response;  // Return the response if it's valid
            } else {
              return { statusCode: 500, message: 'Invalid response', data: null };  // Handle invalid responses
            }
          })
        );
      }

      getRechargeAndWithdrawSummary(date: any): Observable<any> {
        return this.genericHttpService.getAll<any>(`${this.GET_RECHARGE_WITHDRAW_SUMMARY}/${date}`).pipe(
          map((response: any) => {
            if (response && response.statusCode === 200 && response.data) {
              return response.data;  // ✅ Return just the `data` object
            } else {
              return {
                labels: [],
                recharge: { data: [], total: 0 },
                withdraw: { data: [], total: 0 }
              }; // Return empty fallback structure
            }
          })
        );
      }


      getTransctionByeCustomerIdAndDateRange(customerId : any, fromDate :any, todate:any): Observable<any> {
        const url = `${this.GET_TRANSCTION_BYE_ID}?customerId=${customerId}&fromDate=${fromDate}&toDate=${todate}`; 
        return this.genericHttpService.getAll<any>(url).pipe(
          map((response: any) => {
            if (response && response.statusCode === 200 && Array.isArray(response.data)) {
              return response; // Return valid response
            } else {
              return { statusCode: 500, message: "Invalid response", data: [] };
            }
          })
        );
      }
}
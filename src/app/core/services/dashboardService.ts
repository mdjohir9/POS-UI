
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
import { DateTimeFormat } from 'intl';
@Injectable({
    providedIn: 'root'
  })
export class DashboardService {
    private companyId: string | null;
    private customerId: string | null;
    private GET_COMPANY_API_CALL_Url: string;
    private GET_LOAN_BALANCE = `api/Loan/balance`;
    private GET_TRANSCTION_BYE_ID = `api/Transction/transactions`;
    private GET_ADMIN_BALANCE = `api/POSSales/dashboard/summary`;
    private GET_SALES_PURCHASE_SUMMARY = `api/POSSales/sales-purchase-summary`;
    private GET_STOCK_IN_OUT_SUMMARY = `api/POSSales/stock-in-out-summary`;


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
    getAdminBalance(companyId : number, selectedDate : string): Observable<any> {
        return this.genericHttpService.getAll<any>(`${this.GET_ADMIN_BALANCE}?CompanyId=${companyId}&Date=${selectedDate}`).pipe(
          map((response: any) => {
            if (response && response.statusCode === 200 && response.data) {
              return response;  // Return the response if it's valid
            } else {
              return { statusCode: 500, message: 'Invalid response', data: null };  // Handle invalid responses
            }
          })
        );
      }

      getSalesPurchaseSummary(year:any): Observable<any> {
        return this.genericHttpService.getAll<any>(`${this.GET_SALES_PURCHASE_SUMMARY}?companyId=${this.companyId}&year=${year}`).pipe(
          map((response: any) => {
            if (response && response.statusCode === 200 && response.data) {
              return response;  // Return the response if it's valid
            } else {
              return { statusCode: 500, message: 'Invalid response', data: null };  // Handle invalid responses
            }
          })
        );
      }

     getStockInOutSummary(date: any): Observable<any> {
  return this.genericHttpService
    .getAll<any>(`${this.GET_STOCK_IN_OUT_SUMMARY}?companyId=${this.companyId}&date=${date}`)
    .pipe(
      map((response: any) => {
        if (response && response.statusCode === 200 && response.data) {
          return response.data;
        }

        return {
          labels: [],
          stockInTotal: 0,
          stockOutTotal: 0,
          stockInData: [],
          stockOutData: []
        };
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
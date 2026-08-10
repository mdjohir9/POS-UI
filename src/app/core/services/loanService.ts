
import { HttpClient,HttpEvent,HttpEventType,HttpHeaders  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, delay, EMPTY, map, mergeMap, Observable, of, throwError } from 'rxjs';
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
export class LoanService {

    private companyId: string | null;
    private userId: string | null;
    private customerId: string | null;
    private GET_COMPANY_API_CALL_Url: string;
    private GET_ALL_LOAN_APPLICATIONS = `api/LoanApplication/applications`;
    private GET_ALL_LOANS = `api/Loan/loans`;
    private GET_LOANS_BY_CUSTOMER = `api/Loan/loans`;
    private GET_LOAN_INSTALMENTS= `api/LoanInstalment/instalment`;
    private GET_LOAN_INSTALMENTS_BY_MONTH= `api/LoanInstalment/instalments-by-month`;
    private GET_ALL_CUSTOMMER_ID_NAME = `api/Custommer/custommerSummary`;
    private GET_PAYMENT_METHODS_URL = `api/PaymentMethod/activePaymentMetdods`;
    private GET_REACHARGE_ACCOUNT_BY_PAYMENTTYPE_URL = `api/RechargeAccount/rechargeAccountByPaymentType`;
    private GET_RECHARGE_ACCOUNT_BY_ID = `api/RechargeAccount/rechargeAccount`;
    private GET_LOAN_APPLICATION_BY_ID = `api/LoanApplication/application`;
    private POST_LOAN_APPLICATION = `api/LoanApplication/create`;
    private POST_LOAN_APPLICATION_APPROVE = `api/LoanApplication/approve`;
    private PUT_LOAN_APPLICATION_REJECT = `api/LoanApplication/reject`;
    private PAID_INSTALMENT = `api/LoanInstalment/paid`;
    private GET_LOAN_EMI_DETAILES = `api/LoanApplication/calculate-emi`;
    private GET_LOAN_STATEMENT_BY_ID = `api/Loan/loan`;
    private GET_ALL_LOAN_APPLICATIONS_BY_CUSTOMER = `api/LoanApplication/applications`;
    private POST_SIGNATURE = `api/Loan/signature/create`;
    constructor(private genericHttpService: GenericHttpService<any>) { 
      this.companyId = sessionStorage.getItem('__companyId__');
      this.customerId = sessionStorage.getItem('__customerID__');
      this.userId = sessionStorage.getItem('__useId__');

    }


    getPaymentMethods(): Observable<IApiResponse<{ id: number, name: string, isActive: boolean }[]>> {
      const url = `${this.GET_PAYMENT_METHODS_URL}`;
    
      return this.genericHttpService.getAll<IApiResponse<{ id: number, name: string, isActive: boolean }[]>>(url).pipe(
        map(response => {
          // Ensure the response is not an array
          if (Array.isArray(response)) {
            return response[0]; // Take the first item if it somehow returns an array
          }
          return response;
        })
      );
    }
    getRechargeAccountsByPaymentType(paymentMethodId: number): Observable<IApiResponse<any[]>> {
      const url = `${this.GET_REACHARGE_ACCOUNT_BY_PAYMENTTYPE_URL}/${paymentMethodId}`;
    
      return this.genericHttpService.getAll<IApiResponse<any[]>>(url).pipe(
        map(response => {
          if (Array.isArray(response)) {
            return response[0];
          }
          return response;
        })
      );
    }
    getBankAccountNo(paymentMethodId: number): Observable<IApiResponse<any[]>> {
      const url = `${this.GET_RECHARGE_ACCOUNT_BY_ID}/${paymentMethodId}`;
    
      return this.genericHttpService.getAll<IApiResponse<any[]>>(url).pipe(
        map(response => {
          if (Array.isArray(response)) {
            return response[0];
          }
          return response;
        })
      );
    }
    getLoanEMIDetailes(Suburl :string): Observable<IApiResponse<any[]>> {
      const url = `${this.GET_LOAN_EMI_DETAILES}?${Suburl}`;
    
      return this.genericHttpService.getAll<IApiResponse<any[]>>(url).pipe(
        map(response => {
          if (Array.isArray(response)) {
            return response[0];
          }
          return response;
        })
      );
    }
  getCustommerIdName(): Observable<IApiResponse<ICustomerIDName[]>> {

    const url = `${this.GET_ALL_CUSTOMMER_ID_NAME}?customerId=${this.customerId}`;

    return this.genericHttpService.getAll<IApiResponse<ICustomerIDName[]>>(url).pipe(
      map(response => {
        // Ensure the response is not an array
        if (Array.isArray(response)) {
          return response[0]; // Take the first response if it's an array
        }
        return response;
      })
    );
  }
    getAllLaonApplications(): Observable<any> {
      return this.genericHttpService.getAll<any>(this.GET_ALL_LOAN_APPLICATIONS).pipe(
        map((response: any) => {  
          if (response && response.statusCode === 200 && Array.isArray(response.data)) {
            return response; // Return valid response
          } else {
            return { statusCode: 500, message: "Invalid response", data: [] };
          }
        })
      );
    }
     getLaonApplicationByCustomer(): Observable<any> {
      return this.genericHttpService.getById<any>(this.GET_ALL_LOAN_APPLICATIONS_BY_CUSTOMER,this.customerId).pipe(
        map((response: any) => {  
          if (response && response.statusCode === 200 && Array.isArray(response.data)) {
            return response; // Return valid response
          } else {
            return { statusCode: 500, message: "Invalid response", data: [] };
          }
        })
      );
    } 
    getAllLaons(): Observable<any> {
      return this.genericHttpService.getAll<any>(this.GET_ALL_LOANS).pipe(
        map((response: any) => {  
          if (response && response.statusCode === 200 && Array.isArray(response.data)) {
            return response; // Return valid response
          } else {
            return { statusCode: 500, message: "Invalid response", data: [] };
          }
        })
      );
    }
     getLaonsByCustomer(): Observable<any> {
      return this.genericHttpService.getAll<any>(`${this.GET_ALL_LOANS}/${this.customerId}`).pipe(
        map((response: any) => {  
          if (response && response.statusCode === 200 && Array.isArray(response.data)) {
            return response; // Return valid response
          } else {
            return { statusCode: 500, message: "Invalid response", data: [] };
          }
        })
      );
    }
    getLaonInstalments(loanId :any): Observable<any> {
      const url = `${this.GET_LOAN_INSTALMENTS}/${loanId}`; 
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

    getLaonInstalmentsByMonth(date :any): Observable<any> {
      const url = `${this.GET_LOAN_INSTALMENTS_BY_MONTH}?date=${date}`; 
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
      getLoanApplicationByeId(id: number): Observable<ILoanApplication | null> {
        return this.genericHttpService.getById<IApiResponse<ILoanApplication>>(this.GET_LOAN_APPLICATION_BY_ID, id).pipe(
          map((response: IApiResponse<ILoanApplication>) => {
            if (response && response.data) {
              return response.data; 
            }
            return null; 
          })
        );
      }
  saveCustommerSignature(any): Observable<any> {
    const url = `${this.POST_SIGNATURE}`;
    return this.genericHttpService.create(url, any).pipe(
      catchError((error) => {
        console.error('Error occurred while saving personnel info:', error);
        return throwError(() => new Error('Failed to save personnel info'));
      })
    );
  }
    saveLoanApplication(postData: any): Observable<any> {
      const url = `${this.POST_LOAN_APPLICATION}`; // Use template literal for better readability
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

    approveLoanApplication(applicationId :string,postData: any): Observable<any> {
      const url = `${this.POST_LOAN_APPLICATION_APPROVE}/${applicationId}`; // Use template literal for better readability
      return this.genericHttpService.update(url, postData).pipe(
        catchError((error) => {
          console.error('Error occurred while saving Loan application:', error);
          return throwError(() => new Error('Failed to save Loan application'));
        })
      );
    }
    rejectLoanApplication(applicationId: string): Observable<any> {
      const url = `${this.PUT_LOAN_APPLICATION_REJECT}/${applicationId}?userId=${this.userId}`;
      return this.genericHttpService.updateOrdering(url).pipe(
        catchError((error) => {
          console.error('Error occurred while rejecting Loan application:', error);
          return throwError(() => error); // Only rethrow, no Swal here
        })
      );
    }


    paidInstalment(instalmentID: string, lateCharge: any): Observable<any> {
      const url = `${this.PAID_INSTALMENT}/${instalmentID}?lateCharge=${lateCharge}`;
    
      return this.genericHttpService.updateOrdering(url).pipe(
        catchError((error) => {
          const errorMessage = error?.error?.message || 'Unable to mark the instalment as paid. Please try again later.';
          console.error('Error occurred during instalment approval:', error);
    
          Swal.fire({
            icon: 'error',
            title: 'Instalment Payment Failed',
            text: errorMessage,
            confirmButtonText: 'OK'
          });
    
          return throwError(() => new Error(errorMessage));
        })
      );
    }
    
    
    getLoanStatementById(id: number): Observable<any> {
      return this.genericHttpService.getById<any>(this.GET_LOAN_STATEMENT_BY_ID, id).pipe(
        map((response: any) => {
          if (response && response.statusCode === 200 && response.data) {
            return response;  // Return the response if it's valid
          } else {
            return { statusCode: 500, message: 'Invalid response', data: null };  // Handle invalid responses
          }
        })
      );
    }


getLoanLimitsByPlanId(planId: string): Observable<{ minAmount: number; maxAmount: number ; minRepaymentPeriod: number;  maxRepaymentPeriod: number;}> {
  return this.genericHttpService.getWithEvents<{ minAmount: number; maxAmount: number ;minRepaymentPeriod: number;  maxRepaymentPeriod: number;}>(
    `api/LoanApplication/loan-limits/${planId}`, 
    {} // <-- empty options object
  ).pipe(
    mergeMap((event: HttpEvent<any>) => {
      // Only handle the final response
      if (event.type === HttpEventType.Response && event.body?.statusCode === 200 && event.body.data) {
        return of({
          minAmount: event.body.data.minAmount,
          maxAmount: event.body.data.maxAmount,
          minRepaymentPeriod: event.body.data.minRepaymentPeriod,
          maxRepaymentPeriod: event.body.data.maxRepaymentPeriod
        });
      } else if (event.type === HttpEventType.Response) {
        return throwError(() => new Error('Invalid response'));
      }

      // Ignore non-response events
      return EMPTY;
    })
  );
} 


/* getLoanLimitsByPlanId(planId: string): Observable<{
  minAmount: number;
  maxAmount: number;
  minRepaymentPeriod: number;
  maxRepaymentPeriod: number;
}> {
  return this.genericHttpService.getWithEvents<any>(`api/LoanApplication/loan-limits/${planId}`, {}).pipe(
    mergeMap((response) => {
      if (response?.statusCode === 200 && response.data) {
        return of({
          minAmount: response.data.minAmount,
          maxAmount: response.data.maxAmount,
          minRepaymentPeriod: response.data.minRepaymentPeriod,
          maxRepaymentPeriod: response.data.maxRepaymentPeriod
        });
      } else {
        return throwError(() => new Error('Invalid response'));
      }
    })
  );
}
 */


}
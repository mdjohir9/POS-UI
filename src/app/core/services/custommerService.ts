import { catchError, map, Observable, throwError } from "rxjs";
import { ICustommer } from "../models/interfaces/ICustommer";
import { GenericHttpService } from "./generic-http.service";
import { IApiResponse } from "../models/interfaces/IApiResponse";
import { Injectable } from "@angular/core";
import { ICustomerDetailes } from "../models/interfaces/ICustommerDetailes";
import { IContact } from "../models/interfaces/IContact";
import Swal from "sweetalert2";
@Injectable({
  providedIn: 'root'
})
export class CustommerService {
  private RootUrl = 'https://localhost:7220';
  private CompanyId: string = '1111';
  private Get_EMPLOYEE_URL = `api/Employee/employees?CompanyId=${this.CompanyId}`;
  private POST_PERSONNEL_INFO_URL = `api/Custommer/create`;
  private POST_CONTACT_INFO_URL = `api/CustommerContact/create`;
  private POST_CUSTOMER_ALL_INFO_URL = `api/Custommer/create-full`;
  private UPDATE_CUSTOMER_ALL_INFO_URL = `api/Custommer/update-full`;
  private POST_EMPLOYMENT_INFO_URL = `api/CustommerEmployment/create`;
  private POST_FINANCIAL_INFO_URL = `api/CustommerFinancial/create`;
  private POST_GUARANTOR_INFO_URL = `api/CustommerGuarantor/create`;
  private PUT_PERSONNEL_INFO_URL = `api/Custommer/update`;
  private PostEmployeeShortingUrl = `api/Employee/employee-sorting`;
  private GET_PERSONNEL_INFO = `api/Custommer/custommer`;
  private GET_PERSONNEL_DETAILES_BY_ID = `api/Custommer/custommer`;
  private GET_CUSTOMMER_DETAILES = `api/Custommer/custommerDetailes`;
  private GET_ALL_CUSTOMMER = `api/Custommer/custommers`;
  private DELETE_CUSTOMMER_BY_ID = `api/Custommer/delete`;
  private GET_COUNTRY = `api/Custommer/countries`;
 



  constructor(private genericHttpService: GenericHttpService<ICustommer>) {}

  savePersonnelInfo(postData: ICustommer): Observable<any> {
    const url = `${this.POST_PERSONNEL_INFO_URL}`;
    return this.genericHttpService.create(url, postData).pipe(
      catchError((error) => {
        console.error('Error occurred while saving personnel info:', error);
        return throwError(() => new Error('Failed to save personnel info'));
      })
    );
  }

  saveCustommerAllnfo(any): Observable<any> {
    const url = `${this.POST_CUSTOMER_ALL_INFO_URL}`;
    return this.genericHttpService.create(url, any).pipe(
      catchError((error) => {
        console.error('Error occurred while saving personnel info:', error);
        return throwError(() => new Error('Failed to save personnel info'));
      })
    );
  }


  updateCustommerAllnfo(any): Observable<any> {
    const url = `${this.UPDATE_CUSTOMER_ALL_INFO_URL}`;
    return this.genericHttpService.update(url, any).pipe(
      catchError((error) => {
        console.error('Error occurred while saving personnel info:', error);
        return throwError(() => new Error('Failed to save personnel info'));
      })
    );
  }

  saveContactInfo(any): Observable<any> {
    const url = `${this.POST_CONTACT_INFO_URL}`;
    return this.genericHttpService.create(url, any).pipe(
      catchError((error) => {
        console.error('Error occurred while saving personnel info:', error);
        return throwError(() => new Error('Failed to save personnel info'));
      })
    );
  }
  saveEmploymentInfo(any): Observable<any> {
    const url = `${this.POST_EMPLOYMENT_INFO_URL}`;
    return this.genericHttpService.create(url, any).pipe(
      catchError((error) => {
        console.error('Error occurred while saving personnel info:', error);
        return throwError(() => new Error('Failed to save personnel info'));
      })
    );
  }
  saveFinancialInfo(any): Observable<any> {
    const url = `${this.POST_FINANCIAL_INFO_URL}`;
    return this.genericHttpService.create(url, any).pipe(
      catchError((error) => {
        console.error('Error occurred while saving personnel info:', error);
        return throwError(() => new Error('Failed to save personnel info'));
      })
    );
  }
  saveGuarantorInfo(any): Observable<any> {
    const url = `${this.POST_GUARANTOR_INFO_URL}`;
    return this.genericHttpService.create(url, any).pipe(
      catchError((error) => {
        console.error('Error occurred while saving personnel info:', error);
        return throwError(() => new Error('Failed to save personnel info'));
      })
    );
  }
  updatePersonnelInfo(postData: ICustommer , id): Observable<any> {
    const url = `${this.PUT_PERSONNEL_INFO_URL}/${id}`; // Assuming you want to update the record based on its ID
    return this.genericHttpService.update(url, postData).pipe(
      catchError((error) => {
        console.error('Error occurred while saving Loan application:', error);
        const errorMessage = error?.error?.message || 'Failed to submit loan. Please try again.';
        console.log(errorMessage);
        Swal.fire({
          icon: 'error',
          title: 'Submission Failed',
          text: errorMessage
        });

        console.error('Error occurred while updating personnel info:', error);
        return throwError(() => new Error('Failed to update personnel info'));
      })
    );
  }
  
  getPersonnelInfoByeId(id: number): Observable<ICustommer | null> {
    return this.genericHttpService.getById<IApiResponse<ICustommer>>(this.GET_PERSONNEL_INFO, id).pipe(
      map((response: IApiResponse<ICustommer>) => {
        if (response && response.data) {
          return response.data; 
        }
        return null; 
      })
    );
  }
  
  getCustommerInfo(id: any): Observable<ICustomerDetailes[] | null> {
    return this.genericHttpService.getById<IApiResponse<ICustomerDetailes[]>>(this.GET_CUSTOMMER_DETAILES, id).pipe(
      map((response: IApiResponse<ICustomerDetailes[]>) => {
        if (response && Array.isArray(response.data) && response.data.length > 0) {
          return response.data; 
        }
        return null; 
      })
    );
  }
  getAllCustommerInfo(): Observable<IApiResponse<ICustomerDetailes[]>> {
    return this.genericHttpService.getAll<IApiResponse<ICustomerDetailes[]>>(this.GET_ALL_CUSTOMMER).pipe(
      map(response => {
        if (Array.isArray(response)) {
          return response[0];
        }
        return response;
      })
    );
  }

  saveEmployeeShorting(empId: string, customOrdering: number): Observable<any> {
    if (!empId || isNaN(customOrdering)) {
      return throwError(() => new Error('Invalid employee ID or ordering value.'));
    }

    const url = `${this.PostEmployeeShortingUrl}?EmpId=${empId}&Ordering=${customOrdering}`;
    return this.genericHttpService.updateOrdering(url).pipe(
      catchError((error) => {
        console.error('Error occurred while updating sorting:', error);
        return throwError(() => new Error('Failed to update employee sorting'));
      })
    );
  }

  DeleteCustomerByeId(id: number): Observable<any> {
    return this.genericHttpService.delete(this.DELETE_CUSTOMMER_BY_ID,id);
  }


  getCountry(): Observable<any> {
    return this.genericHttpService.getAll<any>(this.GET_COUNTRY).pipe(
      map((response: any) => {
        if (response && response.statusCode === 200 && Array.isArray(response.data)) {
          return response;
        } else {
          return { statusCode: 500, message: 'Invalid response', data: [] };
        }
      })
    );
  }
  
}


import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, delay, map, Observable, of, throwError } from 'rxjs';
import { IPaginatedResponse } from '../models/interfaces/Ipaginated-response';
import { response } from 'express';
import { GenericHttpService } from './generic-http.service';
import { IApiResponse } from '../models/interfaces/IApiResponse';
import { S } from '@fullcalendar/core/internal-common';
@Injectable({
    providedIn: 'root'
  })
export class commonTaskService {

    private companyId: string | null;
    private DataAccessLevel : string |null;
    private GET_COMPANY_API_CALL_Url: string;
    private GET_DEPARTMENT_API_CALL_Url: string;
    private GET_SHIFT_API_CALL_Url: string;
    private GET_DESIGNATION_API_CALL_Url: string;
    private GET_GROUP_API_CALL_Url: string;
    private GET_EMP_CARD_NO_API_CALL_Url: string;
    private GET_DYNAMIC_MENU_API_CALL_Url: string;

    constructor(private genericHttpService: GenericHttpService<any>) { 
      this.companyId = sessionStorage.getItem('__companyId__');
      this.DataAccessLevel = sessionStorage.getItem('__DataAccessLevel__');
      this.GET_COMPANY_API_CALL_Url = `api/Company/GetDropdownCompanies?IsAdministrator=false&CompanyId=${this.companyId}`;
      this.GET_SHIFT_API_CALL_Url = `api/Shift/basicInfo?CompanyId=${this.companyId}`;
      this.GET_DEPARTMENT_API_CALL_Url = `api/Department/basicInfo/${this.companyId}`;
      this.GET_GROUP_API_CALL_Url = `api/Group/basicInfo?CompanyId=${this.companyId}`;
      this.GET_DESIGNATION_API_CALL_Url = `api/Designation/basicInfo?CompanyId=${this.companyId}`;
      this.GET_EMP_CARD_NO_API_CALL_Url = `api/Employee/cardNo?CompanyId=${this.companyId}`;
      this.GET_DYNAMIC_MENU_API_CALL_Url = `api/User/dynamicMenu?userId=10&DataAccessLevel=${this.DataAccessLevel}`;
    }
   
    getCompaniesApiCall(): Observable<any> {
      return this.genericHttpService.getAll<any>(this.GET_COMPANY_API_CALL_Url).pipe(
        map((response: any) => {
          console.log('API Response:', response);
  
          if (response && response.statusCode === 200 && Array.isArray(response.data)) {
            return response; // Return valid response
          } else {
            return { statusCode: 500, message: "Invalid response", data: [] };
          }
        })
      );
    }

    getDepartmentApiCall(): Observable<any> {
        return this.genericHttpService.getAll<any>(this.GET_DEPARTMENT_API_CALL_Url).pipe(
          map((response: any) => {
            console.log('API Response:', response);
    
            if (response && response.statusCode === 200 && Array.isArray(response.data)) {
              return response; // Return valid response
            } else {
              return { statusCode: 500, message: "Invalid response", data: [] };
            }
          })
        );
      }

      getShiftApiCall(dptId : string): Observable<any> {
        return this.genericHttpService.getAll<any>(`${this.GET_SHIFT_API_CALL_Url}&DptId=${dptId}`).pipe(
          map((response: any) => {
            console.log('API Response:', response);
    
            if (response && response.statusCode === 200 && Array.isArray(response.data)) {
              return response; // Return valid response
            } else {
              return { statusCode: 500, message: "Invalid response", data: [] };
            }
          })
        );
      }

      getDesignationsApiCall(dptId : string): Observable<any> {
        return this.genericHttpService.getAll<any>(`${this.GET_DESIGNATION_API_CALL_Url}&DptId=${dptId}`).pipe(
          map((response: any) => {
            console.log('API Response:', response);
    
            if (response && response.statusCode === 200 && Array.isArray(response.data)) {
              return response; // Return valid response
            } else {
              return { statusCode: 500, message: "Invalid response", data: [] };
            }
          })
        );
      }

      getGroupsApiCall(dptId : string): Observable<any> {
        return this.genericHttpService.getAll<any>(`${this.GET_GROUP_API_CALL_Url}&DptId=${dptId}`).pipe(
          map((response: any) => {
            console.log('API Response:', response);
    
            if (response && response.statusCode === 200 && Array.isArray(response.data)) {
              return response; // Return valid response
            } else {
              return { statusCode: 500, message: "Invalid response", data: [] };
            }
          })
        );
      }

      getEmpCardNoApiCall(dptId : any): Observable<any> {
        return this.genericHttpService.getAll<any>(`${this.GET_EMP_CARD_NO_API_CALL_Url}&DptId=${dptId}`).pipe(
          map((response: any) => {
            console.log('API Response:', response);
    
            if (response && response.statusCode === 200 && Array.isArray(response.data)) {
              return response; // Return valid response
            } else {
              return { statusCode: 500, message: "Invalid response", data: [] };
            }
          })
        );
      }

      
      getDynamicMenuApiCall(): Observable<any> {
        return this.genericHttpService.getAll<any>(`${this.GET_DYNAMIC_MENU_API_CALL_Url}`).pipe(
          map((response: any) => {
            console.log('API Response:', response);
    
            if (response && response.statusCode === 200 && Array.isArray(response.data)) {
              return response; // Return valid response
            } else {
              return { statusCode: 500, message: "Invalid response", data: [] };
            }
          })
        );
      }

      formatDate(date: Date): string {
        if (!(date instanceof Date)) date = new Date(date);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
}

import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, delay, map, Observable, of, throwError } from 'rxjs';
import { IPaginatedResponse } from '../models/interfaces/Ipaginated-response';
import { response } from 'express';
import { GenericHttpService } from './generic-http.service';
import { IApiResponse } from '../models/interfaces/IApiResponse';
@Injectable({
    providedIn: 'root'
  })
export class CompanyService {

    private companyId: string | null;
    private GET_COMPANY_API_CALL_Url: string;
  
    constructor(private genericHttpService: GenericHttpService<any>) { 
      this.companyId = sessionStorage.getItem('__companyId__');
      this.GET_COMPANY_API_CALL_Url = `api/Company/GetDropdownCompanies?IsAdministrator=false&CompanyId=${this.companyId}`;
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
      
}
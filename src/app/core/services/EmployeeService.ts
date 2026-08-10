
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, delay, map, Observable, of, throwError } from 'rxjs';
import { response } from 'express';
import { IEmployee } from '../models/interfaces/IEmployee';
import { GenericHttpService } from './generic-http.service';
import { IApiResponse } from '../models/interfaces/IApiResponse';
@Injectable({
  providedIn: 'root'
})
export class EmployeeService  {
    private RootUrl = 'https://localhost:7220';
    private CompanyId: string = '1111';
    private Get_EMPLOYEE_URL = `api/Employee/employees?CompanyId=${this.CompanyId}`;
    private PostEmployeeUrl = `api/Employee/employees/creatoparetion`;
    private PostEmployeeShortingUrl = `api/Employee/employee-sorting`;
  
    constructor(private genericHttpService: GenericHttpService <IEmployee>) { }

    getEmployeesApiCall(selectedDepartmentIds: string[] = []): Observable<IApiResponse<IEmployee[]>> {
        const departmentParams = selectedDepartmentIds.map(id => `DptIds=${id}`).join('&');
        const url = `${this.Get_EMPLOYEE_URL}${departmentParams ? `?${departmentParams}` : ''}`;
    
        return this.genericHttpService.getAll<IApiResponse<IEmployee[]>>(url).pipe(
            map(response => {
                // Ensure the response is not an array
                if (Array.isArray(response)) {
                    return response[0]; // Take the first response if it's an array
                }
                return response;
            })
        );
    }
    
      
    saveEmployee(postData: any): Observable<any> {
        const url = `${this.PostEmployeeUrl}`; // Use template literal for better readability
        return this.genericHttpService.create(url, postData).pipe(
          catchError((error) => {
            console.error('Error occurred while saving leave application:', error);
            return throwError(() => new Error('Failed to save leave application'));
          })
        );
      }

      saveEmployeeShorting(empId: string, customOrdering: number): Observable<any> {
        if (!empId || isNaN(customOrdering)) {
          return throwError(() => new Error('Invalid employee ID or ordering value.'));
        }
      
        // Ensure customOrdering is a valid number and not a string
        const url = `${this.PostEmployeeShortingUrl}?EmpId=${empId}&Ordering=${customOrdering}`;
      
        return this.genericHttpService.updateOrdering(url).pipe(
          catchError((error) => {
            console.error('Error occurred while updating sorting:', error);
            return throwError(() => new Error('Failed to update employee sorting'));
          })
        );
      }
      
      
      
      
  }
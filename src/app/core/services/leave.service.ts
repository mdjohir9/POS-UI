import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, delay, map, Observable, of, throwError } from 'rxjs';
import {  ILeaveData } from '../models/interfaces/ILeave-data';
import { IPaginatedResponse } from '../models/interfaces/Ipaginated-response';
import { response } from 'express';
import { IEmployee } from '../models/interfaces/IEmployee';
import { IAuthority } from '../models/interfaces/IAuthority';
import { GenericHttpService } from './generic-http.service';
import { IApiResponse } from '../models/interfaces/IApiResponse';
import { ILeaveType } from '../models/interfaces/ILeaveTyp';
import { ILeaveApprove } from '../models/interfaces/ILeaveApprove';
@Injectable({
  providedIn: 'root'
})
export class LeaveService {

  private RootUrl='https://localhost:7220'
  private userId: string = '90'; //masudrana
 /*  private userId: string = '86';  *///abul kalam azad
  private CompanyId : string ='1';
  private EmpId : string = '00000005'
  private GetLeaveTypeUrl = `api/Leave/LeaveType/${this.CompanyId}`;
  

  private GetEmployeeUrl = `api/Employee/EmployeeName?CompanyId=${this.CompanyId}`;
  private GetLeavesUrl = `api/Leave/lvApplications/${this.CompanyId}?EmpId=${this.EmpId}`;
  private GetLeaveApproveUrl = `api/Leave/lvApplicationForApprove/${this.CompanyId}?UserId=${this.userId}`;
  private PostLeaveUrl = `api/Leave/create/${this.userId}`;
  
  private ApproveLeaveUrl = `api/Leave/approval?companyID=${this.CompanyId}`;
  private GetLvAuthority = `api/User/authority?companyId=${this.CompanyId}`;
  private DeleteLeaveUrl = `api/Leave/delete`;


  //constructor(private http: HttpClient) {}

  constructor(private genericHttpService: GenericHttpService <ILeaveData>) { }

      getLeavesApiCall(): Observable<IApiResponse<ILeaveData[]>> {
          return this.genericHttpService.getAll<IApiResponse<ILeaveData[]>>(this.GetLeavesUrl).pipe(
              map(response => {
                  if (Array.isArray(response)) {
                      return response[0]; 
                  }
                  return response;
              })
          );
      }

      getLeaveTypeApiCall(): Observable<IApiResponse<ILeaveType[]>> {
        const url = `${this.GetLeaveTypeUrl}`;
    
        return this.genericHttpService.getAll<IApiResponse<ILeaveType[]>>(url).pipe(
            map(response => {
                // Ensure the response is not an array
                if (Array.isArray(response)) {
                    return response[0]; // Take the first response if it's an array
                }
                return response;
            })
        );
    }
    
    saveLeaveApplication(postData: any): Observable<any> {
      const url = `${this.PostLeaveUrl}`; // Use template literal for better readability
      return this.genericHttpService.create(url, postData).pipe(
        catchError((error) => {
          console.error('Error occurred while saving leave application:', error);
          return throwError(() => new Error('Failed to save leave application'));
        })
      );
    }
      
  deleteLeave(leaveId: number): Observable<any> {
    const url = `${this.DeleteLeaveUrl}`;
    return this.genericHttpService.delete(url, leaveId).pipe(
      catchError((error) => {
        console.error('Error occurred while Delete leave application:', error);
        return throwError(() => new Error('Failed to save leave application'));
      })
    );
  }

  approveApplication(postData: any): Observable<any> {
    const url = `${this.ApproveLeaveUrl}`;
    return this.genericHttpService.update(url, postData).pipe(
      catchError((error) => {
        console.error('Error occurred while saving leave application:', error);
        return throwError(() => new Error('Failed to save leave application'));
      })
    );
  }


/*   getEmployeesApiCall(selectedDepartmentIds: any[] = []):Observable<IEmployee[]> {
    return this.http.get<any>(this.RootUrl+this.GetEmployeeUrl+`&${selectedDepartmentIds.map(id => `DptIds=${id}`).join('&')}`).pipe(
      map(response=>{
        console.log('Employee response',response);
        return response.data || [];
      })
    )
  } */

    getLvApprovalListApiCall(): Observable<IApiResponse<ILeaveApprove[]>> {
      return this.genericHttpService.getAll<IApiResponse<ILeaveApprove[]>>(this.GetLeaveApproveUrl).pipe(
          map(response => {
              if (Array.isArray(response)) {
                  return response[0]; 
              }
              return response;
          })
      );
  }





   
}

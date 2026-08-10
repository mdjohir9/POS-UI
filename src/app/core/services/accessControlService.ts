import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, delay, map, Observable, of, throwError } from 'rxjs';
import { IPaginatedResponse } from '../models/interfaces/Ipaginated-response';
import { response } from 'express';
import { GenericHttpService } from './generic-http.service';
import { IApiResponse } from '../models/interfaces/IApiResponse';
import { ILeaveData } from '../models/interfaces/ILeave-data';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class accessControlService {

    //private RootUrl='https://localhost:7220'
    private userId: string | null; //masudrana
    private companyId: string | null;
    private dataAccessLevel : string | null;
    private POST_ROLES_API_CALL_Url = `api/UserRoles/create`;
    private GET_USER_ROLES =`api/UserRoles/userRoles?companyId=1111&IsAdministrator=true`;
    private GET_USERS =`api/User/users?companyId=1111&IsAdministrator=false`;
    private GET_USER_NAME_ID =`api/User/UserNameAndId`;
    private GET_USER_ROLES_ID_NAME =`api/UserRoles/userRolesWithGuestUser?IsGuestUser=false&CompanyId=1111`;
    private CREATE_USER_API_URL =`api/User/users/create`;
    private REGISTRATION_USER_API_URL =`api/LogIn/registration`;

    
    private DETETE_USER_ROLES = `api/UserRoles/delete`;
    private DETETE_USER = `api/User/users/delete`;
  constructor(private genericHttpService: GenericHttpService <ILeaveData>) {
    this.companyId = sessionStorage.getItem('__companyId__');
    this.userId = sessionStorage.getItem('__useId__');
    this.dataAccessLevel = sessionStorage.getItem('__DataAccessLevel__');
   }

  getUserRoles(): Observable<any> {
    return this.genericHttpService.getAll<any>(`${this.GET_USER_ROLES}`).pipe(
      map((response: any) => {
        if (response && response.statusCode === 200 && Array.isArray(response.data)) {
          return response;
        } else {
          return { statusCode: 500, message: 'Invalid response', data: [] };
        }
      })
    );
  }
  
  getUsers(): Observable<any> {
    return this.genericHttpService.getAll<any>(`${this.GET_USERS}`).pipe(
      map((response: any) => {
        if (response && response.statusCode === 200 && Array.isArray(response.data)) {
          return response;
        } else {
          return { statusCode: 500, message: 'Invalid response', data: [] };
        }
      })
    );
  }

  getUserNameId(): Observable<any> {
    return this.genericHttpService.getAll<any>(`${this.GET_USER_NAME_ID}?companyId=${this.companyId}&userId=${this.userId}&dataAccessLevel=${this.dataAccessLevel}`).pipe(
      map((response: any) => {
        if (response && response.statusCode === 200 && Array.isArray(response.data)) {
          return response;
        } else {
          return { statusCode: 500, message: 'Invalid response', data: [] };
        }
      })
    );
  }



saveRolesApplication(postData: any): Observable<any> {
  const url = `${this.POST_ROLES_API_CALL_Url}`; // Use template literal for better readability
  return this.genericHttpService.create(url, postData).pipe(
    catchError((error) => {
      console.error('Error occurred while saving leave application:', error);

      console.error('Error occurred while saving leave application:', error);

      const errorMessage = error?.error?.message || 'Failed to submit loan. Please try again.';
      console.log(errorMessage);
      Swal.fire({
        icon: 'error',
        title: 'Approve Failed',
        text: errorMessage
      });
      return throwError(() => new Error('Failed to save leave application'));
    })
  );
}

SaveUser(postData: any): Observable<any> {
  const url = `${this.CREATE_USER_API_URL}`; // Replace with your actual endpoint URL
  return this.genericHttpService.create(url, postData).pipe(
    catchError((error) => {
      console.error('Error occurred while creating user:', error);

      const errorMessage = error?.error?.message || 'Failed to create user. Please try again.';
      Swal.fire({
        icon: 'error',
        title: 'User Creation Failed',
        text: errorMessage
      });

      return throwError(() => new Error('Failed to create user'));
    })
  );
}
RegistrationUser(postData: any): Observable<any> {
  const url = `${this.REGISTRATION_USER_API_URL}`; // Replace with your actual endpoint URL
  return this.genericHttpService.create(url, postData).pipe(
    catchError((error) => {
      console.error('Error occurred while creating user:', error);

      const errorMessage = error?.error?.message || 'Failed to create user. Please try again.';
      Swal.fire({
        icon: 'error',
        title: 'User Creation Failed',
        text: errorMessage
      });

      return throwError(() => new Error('Failed to create user'));
    })
  );
}

deleteUserRole(id: number): Observable<any> {
  return this.genericHttpService.delete(this.DETETE_USER_ROLES , id).pipe(
    map((response: any) => {
      if (response && response.statusCode === 200) {
        return response;
      } else {
        return { statusCode: 500, message: 'Failed to delete user role', data: null };
      }
    })
  );
}

deleteUser(id: number): Observable<any> {
  return this.genericHttpService.delete(this.DETETE_USER , id).pipe(
    map((response: any) => {
      if (response && response.statusCode === 200) {
        return response;
      } else {
        return { statusCode: 500, message: 'Failed to delete user role', data: null };
      }
    })
  );
}

getRolesNameId(): Observable<IApiResponse<{ rolesID: number, roleName: string }[]>> {
  const url = `${this.GET_USER_ROLES_ID_NAME}`;

  return this.genericHttpService.getAll<IApiResponse<{ rolesID: number, roleName: string }[]>>(url).pipe(
    map(response => {
      // Just like before, ensure it's not mistakenly wrapped in an array
      if (Array.isArray(response)) {
        return response[0]; // fallback
      }
      return response;
    })
  );
}


}
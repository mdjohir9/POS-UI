import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Route } from '@angular/router';
import { Router } from '@angular/router';
import { BehaviorSubject , catchError, Observable, throwError} from 'rxjs';
import Swal from 'sweetalert2';
import { GenericHttpService } from './generic-http.service';

interface LoginResponse {
  statusCode: number;
  message: string;
  accessToken: string;
  data: UserData;
}

interface UserData {
  companyId : string;
  userId: number;
  name: string;
  userName: string;
  userPassword: string;
  userImage: string;
  firstName: string;
  lastName: string;
  userRoleID: number;
  createdAt: string;
  createdBy: number;
  updatedAt: string;
  updatedBy: number;
  email: string;
  isGuestUser: boolean;
  customerID: string;
  deleted: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
  additionalPermissions: string;
  removedPermissions: string;
  roleId: string | null;
  roleName: string | null;
  dataAccessLevel: string | null;
  loanId: string | null;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private apiUrl = 'api/LogIn/Login'; // API Endpoint
  private isAuthenticated = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.isAuthenticated.asObservable();

  private currentUserSubject: BehaviorSubject<LoginResponse | null>;
  public currentUser: Observable<LoginResponse | null>;

  constructor(private http: HttpClient, private router: Router, private genericHttpService: GenericHttpService<any>) {
    // Initialize BehaviorSubject with stored user data if available
    const storedUser = sessionStorage.getItem('userData');
    this.currentUserSubject = new BehaviorSubject<LoginResponse | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  // Check if a token exists in sessionStorage
  private hasToken(): boolean {
    return !!sessionStorage.getItem('token');
  }

  loginUser(credentials: { userName: string; userPassword: string }): void {
  
    this.genericHttpService.create(this.apiUrl, credentials).pipe(
      catchError((error) => {
        const errorMessage = error?.error?.message || 'Login failed: Invalid username or password.';
        console.error('Login failed:', errorMessage);
  
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: errorMessage,
          confirmButtonText: 'OK'
        });
  
        return throwError(() => new Error(errorMessage));
      })
    ).subscribe((response) => {
      console.log('Login successful:', response.message);
  
      if (response.accessToken) {
        // Store token & user data
        sessionStorage.setItem('token', response.accessToken);
        sessionStorage.setItem('userData', JSON.stringify(response.data));
        sessionStorage.setItem('__useId__', response.data.userId.toString());
        sessionStorage.setItem('__userName__', response.data.userName);
        sessionStorage.setItem('__customerID__', response.data.customerID);
        sessionStorage.setItem('__companyId__', response.data.companyId || '');
        sessionStorage.setItem('__DataAccessLevel__', response.data.dataAccessLevel || '');
        sessionStorage.setItem('__LoanId__', response.data.loanId || '');
  
        this.currentUserSubject.next(response);
        this.isAuthenticated.next(true);
  
        // Navigate to Dashboard & Reload
        this.router.navigate(['/dashboard']).then(() => {
          window.location.reload();
        });
      }
    });
  }
  
  // Login user and store authentication details
 /*  loginUser(credentials: { userName: string; userPassword: string }): void {


    
    this.http.post<LoginResponse>(this.apiUrl, credentials).subscribe(
      (response) => {
        console.log('Login successful:', response.message);

        if (response.accessToken) {
          // Store token & user data
          sessionStorage.setItem('token', response.accessToken);
          sessionStorage.setItem('userData', JSON.stringify(response.data));
          sessionStorage.setItem('__useId__', response.data.userId.toString());
          sessionStorage.setItem('userName', response.data.userName);
          sessionStorage.setItem('__customerID__',response.data.customerID );
          console.log('companyId',response.data.companyId);
          sessionStorage.setItem('__companyId__', response.data.companyId || '');
          sessionStorage.setItem('__DataAccessLevel__', response.data.dataAccessLevel || '');
          sessionStorage.setItem('__LoanId__', response.data.loanId || '');


          this.currentUserSubject.next(response);
          this.isAuthenticated.next(true);

          // Navigate to Dashboard & Reload
          this.router.navigate(['/dashboard']).then(() => {
            window.location.reload();
          });
        }
      },
      (error) => {
        console.error('Login failed:', error);
                  Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: 'Login failed: Invalid username or password. please trye again',
                    confirmButtonText: 'OK'
                  });
      }
    );
  }  */

  // Logout user
  logout(): void {
    sessionStorage.clear(); // Clear all stored data
    this.currentUserSubject.next(null);
    this.isAuthenticated.next(false);
    this.router.navigate(['/login']);
  }

  // Get the current user value safely
  public get currentUserValue(): LoginResponse | null {
    return this.currentUserSubject.value;
  }



}

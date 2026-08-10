import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';



const USER_AUTH_API_URL = 'https://localhost:7220/api/LogIn/Login';
interface User {
  statusCode: number;
  message: string;
  accessToken: string;
  data: UserData;
}

interface UserData {
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
  empId: string;
  deleted: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
  additionalPermissions: string;
  removedPermissions: string;
  dptId: string | null;
  dptName: string | null;
  dsgName: string | null;
  dsgId: string | null;
  roleId: string | null;
  roleName: string | null;
  gId: string | null;
  sftId: string | null;
  dataAccessLevel: string | null;
}
@Injectable()
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(username: string, password: string) {
        return this.http.post<any>(USER_AUTH_API_URL, { username, password })
        .pipe(map(user => {
            if (user && user.token) {
                localStorage.setItem('currentUser', JSON.stringify(user.userData));
                this.currentUserSubject.next(user);
            }
            return user;
        }));
    }

    logout() {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}
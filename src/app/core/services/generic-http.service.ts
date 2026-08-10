import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GenericHttpService<T> {
  constructor(private http: HttpClient) {}
  private RootUrl='https://localhost:7007';
  //private RootUrl='https://upstartloan-api.codehosting.xyz';
  getAll<T>(apiUrl: string): Observable<T[]> {
    return this.http.get<T[]>(`${this.RootUrl}/${apiUrl}`);  // No need to manually set headers
  }
  
  getById<T>(apiUrl: string, id: any | string): Observable<T> {
    return this.http.get<T>(`${this.RootUrl}/${apiUrl}/${id}`);
  }
  
  create(apiUrl: string, entity: T): Observable<T> {
    return this.http.post<T>(`${this.RootUrl}/${apiUrl}`, entity);
  }

  update(apiUrl: string, entity: T): Observable<T> {
    return this.http.put<T>(`${this.RootUrl}/${apiUrl}`, entity);
  }

  delete(apiUrl: string, id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.RootUrl}/${apiUrl}/${id}`);
  }
  genericdelete(apiUrl: string): Observable<void> {
    return this.http.delete<void>(`${this.RootUrl}/${apiUrl}`);
  }

  updateOrdering<T>(apiUrl: string): Observable<T> {
    return this.http.put<T>(`${this.RootUrl}/${apiUrl}`, null);
  }

  getWithEvents<T>(apiUrl: string, options: any): Observable<HttpEvent<T>> {
    return this.http.get<T>(`${this.RootUrl}/${apiUrl}`, { ...options, observe: 'events' });
  }

}


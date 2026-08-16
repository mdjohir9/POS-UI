import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IApiResponse } from '../models/interfaces/IApiResponse';

@Injectable({
  providedIn: 'root'
})
export class PosBrandService {
  
  private apiUrl = 'https://localhost:7007/api/POSBrand'; 

  constructor(private http: HttpClient) {}

  getBrands(companyId: string = '1'): Observable<IApiResponse<any[]>> {
    return this.http.get<IApiResponse<any[]>>(`${this.apiUrl}/brands?companyId=${companyId}`);
  }

  createBrand(brandData: { name: string; isActive: boolean }): Observable<IApiResponse<any>> {
    return this.http.post<IApiResponse<any>>(`${this.apiUrl}/brand/create`, brandData);
  }

  updateBrand(id: number, brandData: { name: string; isActive: boolean }): Observable<IApiResponse<any>> {
    return this.http.put<IApiResponse<any>>(`${this.apiUrl}/brand/update?Id=${id}`, brandData);
  }

  deleteBrand(id: number): Observable<IApiResponse<any>> {
    return this.http.delete<IApiResponse<any>>(`${this.apiUrl}/Brand/delete/${id}`);
  }
}
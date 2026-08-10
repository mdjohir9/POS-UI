import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, delay, map, Observable, of, throwError } from 'rxjs';

import { IPaginatedResponse } from '../models/interfaces/Ipaginated-response';
import { response } from 'express';
import { IAuthority } from '../models/interfaces/IAuthority';
import { GenericHttpService } from './generic-http.service';
import { IApiResponse } from '../models/interfaces/IApiResponse';
import { IGrade } from '../models/interfaces/IGrade';

@Injectable({
  providedIn: 'root'
})
export class GradeService {


  private userId: string = '90'; 
  private CompanyId : string ='0001';
  private EmpId : string = '00000005'  

  private GRADE_API_URL = `api/Grade/grades?CompanyId=${this.CompanyId}`;
  constructor(private genericHttpService: GenericHttpService <IGrade>) { }


    getGradeApiCall(): Observable<IApiResponse<IGrade[]>> {
        return this.genericHttpService.getAll<IApiResponse<IGrade[]>>(this.GRADE_API_URL).pipe(
            map(response => {
                if (Array.isArray(response)) {
                    return response[0];
                }
                return response;
            })
        );
    }

}
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LeaveService } from 'src/app/core/services/leave.service';
import { ILoanApplication } from 'src/app/core/models/interfaces/ILoanApplication';
import { IApiResponse } from 'src/app/core/models/interfaces/IApiResponse';
import Swal from 'sweetalert2';
import { LoanService } from 'src/app/core/services/LoanService';
import { ILeaveData } from 'src/app/core/models/interfaces/ILeave-data';
import { Router } from '@angular/router';
import { ILoanDetailes } from 'src/app/core/models/interfaces/ILoanDetailes';
import * as html2pdf from 'html2pdf.js';
@Component({
  selector: 'app-loan-list-customer',
  standalone: false,
  templateUrl: './loan-request-list-customer.component.html',
  styleUrl: './loan-request-list-customer.component.css'
})

export class LoanRequestListCustomerComponent {

  isLoading = true;
  showContent = true;
  value = '';
  statusFilter = 'All'; 
  searchAny = '';
  dataType: string = 'allDatas';
 
  allDatas: any[] = []; // Store original data
  datas: any[] = [];// Store filtered data


  constructor(private router: Router , private loanService: LoanService) {}
  ngOnInit(): void {

    this.getLoanRequestByCustomer();
   const accessLevel = sessionStorage.getItem('__DataAccessLevel__');
  }



     getLoanRequestByCustomer(): void {
      this.isLoading = true;
      this.showContent = false; // Hide content during loading
    
      setTimeout(() => {
        this.loanService.getLaonApplicationByCustomer().subscribe(
          (response: IApiResponse<ILoanApplication[]>) => {
            this.isLoading = false;
            this.showContent = true;
    
            if (response.statusCode === 200) {
              this.allDatas = response.data || [];
            } else {
              this.allDatas = [];
              console.error('Error fetching loan applications:', response.message);
            }
          },
          error => {
            this.isLoading = false;
            this.showContent = true;
            this.allDatas = [];
            this.datas = [];
            console.error('API Error:', error);
          }
        );
      });
    }
       listOfCurrentPageData: readonly ILoanApplication[] = [];
    
      onCurrentPageDataChange(listOfCurrentPageData: readonly ILoanApplication[]): void {
        this.listOfCurrentPageData = listOfCurrentPageData;
    
        console.log(listOfCurrentPageData);
      }
    
      filterByAnyMetchingData() {
        const searchTerm = this.searchAny.toLowerCase().trim();
      
        if (!searchTerm) {
          this.datas = [...this.allDatas]; // Reset
          this.dataType = 'allDatas'; // Show full list
          return;
        }
      
        this.datas = this.allDatas.filter(custommer =>
          Object.values(custommer).some(value =>
            value?.toString().toLowerCase().includes(searchTerm)
          )
        );
      
        this.dataType = 'datas'; // Show filtered result
      }
      
}

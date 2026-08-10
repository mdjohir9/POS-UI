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
  templateUrl: './loan-list-customer.component.html',
  styleUrl: './loan-list-customer.component.css'
})
export class LoanListCustomerComponent  implements OnInit {
 isLoading = true;
  showContent = false;
  value = '';
  statusFilter = 'All'; 
  searchAny = '';
  dataType: string = 'allDatas';
 
  allDatas: ILoanDetailes[] = []; // Store original data
  datas: ILoanDetailes[] = []; // Store filtered data

   listOfCurrentPageData: readonly ILoanDetailes[] = [];

  constructor(private router: Router , private loanService: LoanService) {}

  ngOnInit(): void {
    // this.loadData();
    this.getLoanList();
  }

/*   loadData() {
    setTimeout(() => {
      this.isLoading = false;
      this.showContent = true;
    }, 500);
  }
 */
  getLoanList(): void {
    this.isLoading = true;
    this.showContent = false; // Hide content initially
  
    setTimeout(() => {
      this.loanService.getLaonsByCustomer().subscribe(
        (response: IApiResponse<ILoanDetailes[]>) => {
          this.isLoading = false;
          this.showContent = true;
  
          if (response.statusCode === 200) {
            this.allDatas = response.data || [];
          } else {
            this.allDatas = [];
            console.error('Error fetching loans:', response.message);
          }
        },
        error => {
          this.isLoading = false;
          this.showContent = true;
          this.allDatas = [];
          console.error('API Error:', error);
        }
      );
    }, 5); // ⏱ 5 milliseconds delay
  }
  
  
    onCurrentPageDataChange(listOfCurrentPageData: readonly ILoanDetailes[]): void {
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

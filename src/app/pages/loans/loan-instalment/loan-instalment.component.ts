import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LeaveService } from 'src/app/core/services/leave.service';
import { ILoanApplication } from 'src/app/core/models/interfaces/ILoanApplication';
import { IApiResponse } from 'src/app/core/models/interfaces/IApiResponse';
import Swal from 'sweetalert2';
import { LoanService } from 'src/app/core/services/LoanService';
import { ILeaveData } from 'src/app/core/models/interfaces/ILeave-data';
import { ActivatedRoute, Router } from '@angular/router';
import { ILoanInstalmentDetails } from 'src/app/core/models/interfaces/ILoanInstalmentDetails';
@Component({
  selector: 'app-loan-instalment',
  standalone: false,
  templateUrl: './loan-instalment.component.html',
  styleUrl: './loan-instalment.component.css'
})
export class LoanInstalmentComponent implements OnInit{
  isLoading = true;
  showContent = false;
  value = '';
  statusFilter = 'All'; 
  searchAny = '';
  dataType: string = 'allDatas';
  loanId: string | null = null; 
  allDatas: ILoanInstalmentDetails[] = []; // Store original data
  datas: ILoanInstalmentDetails[] = []; // Store filtered data

   listOfCurrentPageData: readonly ILoanInstalmentDetails[] = [];

  constructor(private router: Router , private loanService: LoanService ,private route: ActivatedRoute) {}

  ngOnInit(): void {
    // this.loadData();

    this.route.paramMap.subscribe(params => {
      const urloanId = params.get('id'); // Get from URL
  
      if (urloanId) {
        this.loanId = urloanId; // Use URL ID
        this.getLoanInstalments(this.loanId);
      } else {
        this.loanId = sessionStorage.getItem('__LoanId__'); // Use session ID if URL ID is missing
        this.getLoanInstalments(this.loanId);
      }

 
  })
  }
/*   loadData() {
    setTimeout(() => {
      this.isLoading = false;
      this.showContent = true;
    }, 500);
  }
 */


  
  getLoanInstalments(loanid: any): void {
    this.isLoading = true;
    this.showContent = false; // Hide content during loading
    setTimeout(() => {
      this.loanService.getLaonInstalments(loanid).subscribe(
        (response: IApiResponse<ILoanInstalmentDetails[]>) => {
          this.isLoading = false;
          this.showContent = true;
  
          if (response.statusCode === 200) {
            this.allDatas = response.data || [];
          } else {
            this.allDatas = [];
            console.error('Error fetching loan instalments:', response.message);
          }
        },
        error => {
          this.isLoading = false;
          this.showContent = true;
          this.allDatas = [];
          console.error('API Error:', error);
        }
      );
    }, 5); // ⏱ Adjust delay here if needed
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
  

  filterByStatus() {
    if (this.statusFilter === 'All') {
      this.datas = [...this.allDatas]; // Reset to original list
      return;
    }

    this.datas = this.allDatas.filter(data => {
      const statusLabel =  data.status === null ? 'Pending' :
      data.status === 0 ? 'Due' :
      data.status === 1 ? 'Paid' :
      data.status === 2 ? 'Waive' : 'NA' ;

      this.dataType = 'datas'
      return statusLabel === this.statusFilter;
    });
  }

  edit(ApplicationID: any) {
    console.log("Edit Leave clicked", ApplicationID);
    // Open a modal or navigate to the edit leave page with leave details

    this.router.navigate([`/loan/approve`, ApplicationID]); 
  }
  

}

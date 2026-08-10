import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LeaveService } from 'src/app/core/services/leave.service';
import { ILoanApplication } from 'src/app/core/models/interfaces/ILoanApplication';
import { IApiResponse } from 'src/app/core/models/interfaces/IApiResponse';
import Swal from 'sweetalert2';
import { LoanService } from 'src/app/core/services/LoanService';
import { ILeaveData } from 'src/app/core/models/interfaces/ILeave-data';
import { Router } from '@angular/router';
import { RechargeService } from 'src/app/core/services/recharge.service';
import { WithdrawService } from 'src/app/core/services/withdraw.service';
@Component({
  selector: 'app-withdraw-requests',
  standalone: false,
  templateUrl: './withdraw-by-customer.component.html',
  styleUrl: './withdraw-by-customer.component.css'
})
export class WithdrawByeCustomerIdComponent {
isLoading = true;
  showContent = false;
  value = '';
  statusFilter = 'All'; 
  searchAny = '';
  dataType: string = 'allDatas';
  dataAccessLevel: string | null = null;

  allDatas: any[] = []; // Store original data
  //datas: ILoanApplication[] = []; // Store filtered data
  datas: any[] = [];
   listOfCurrentPageData: readonly ILoanApplication[] = [];

  constructor(private router: Router , private withdrawService: WithdrawService) {}

  ngOnInit(): void {
    // this.loadData();
    this.dataAccessLevel = sessionStorage.getItem('__DataAccessLevel__');
    this.getWithdrawRequests();
  }

/*   loadData() {
    setTimeout(() => {
      this.isLoading = false;
      this.showContent = true;
    }, 500);
  }
 */


getWithdrawRequests(): void {
  this.withdrawService.getWithdrawListByeCustomer().subscribe({
    next: (response) => {
      if (response.statusCode === 200) {
        this.datas = response.data;
        this.showContent = true;
      }
    },
    error: (err) => {
      console.error('Failed to load recharge data:', err);
      this.showContent = true;
    }
  });
}


/*   getLeaves() {
    setTimeout(()=>{ 
      this.isLoading = true;
      this.loanService.getAllLaonApplications().subscribe(
        (response: IApiResponse<ILoanApplication[]>) => {
          this.isLoading = false;
    
          if (response.statusCode === 200) {
            this.allDatas = response.data; // Store all data
            this.showContent = true;
          } else {
            console.error('Error fetching leaves:', response.message);
          }
        },
        error => {
          this.isLoading = false;
          console.error('API Error:', error);
        }
      );})
   
  } */
  
    onCurrentPageDataChange(listOfCurrentPageData: readonly ILoanApplication[]): void {
      this.listOfCurrentPageData = listOfCurrentPageData;
  
      console.log(listOfCurrentPageData);
    }
  
  filterByAnyMetchingData() {
    const searchTerm = this.searchAny.toLowerCase().trim();
    
    if (!searchTerm) {
      this.datas = [...this.allDatas]; // Reset if search is empty
      return;
    }

    this.datas = this.allDatas.filter(leave =>
      Object.values(leave).some(value =>
        value?.toString().toLowerCase().includes(searchTerm)
      )
    );
  }

/*   filterByStatus() {
    if (this.statusFilter === 'All') {
      this.leaves = [...this.allLeaves]; // Reset to original list
      return;
    }

    this.leaves = this.allLeaves.filter(leave => {
      const statusLabel = leave.approvalStatus === null ? 'Pending' :
                          leave.approvalStatus === 0 ? 'Processing' :
                          leave.approvalStatus === 1 ? 'Approve' : // Assuming 'Approve' is 'Active'
                          leave.approvalStatus === 2 ? 'Reject' : 'NA';

      this.dataType = 'leaves'
      return statusLabel === this.statusFilter;
    });
  } */


  
}


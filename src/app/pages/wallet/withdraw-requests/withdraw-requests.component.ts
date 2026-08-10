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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
@Component({
  selector: 'app-withdraw-requests',
  standalone: false,
  templateUrl: './withdraw-requests.component.html',
  styleUrl: './withdraw-requests.component.css'
})
export class WithdrawRequestsComponent {
isLoading = true;
  showContent = false;
  value = '';
  statusFilter = 'All'; 
  searchAny = '';
  dataType: string = 'allDatas';
  dataAccessLevel: string | null = null;

  allDatas: any[] = []; 
  datas: any[] = [];
   listOfCurrentPageData: readonly ILoanApplication[] = [];

   withdrawForm!: FormGroup;

  constructor( private modal: NzModalService,private fb: FormBuilder,  private withdrawService: WithdrawService,private router: Router) {

    this.withdrawForm = this.fb.group({
      amount: [null, [Validators.required]],
      transactionID: [null, [Validators.required]],
    });

  }
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
  this.withdrawService.getWithdrawList().subscribe({
    next: (response) => {
      if (response.statusCode === 200) {
        this.allDatas = response.data;
        this.showContent = true;
      }
    },
    error: (err) => {
      console.error('Failed to load recharge data:', err);
      this.showContent = true;
    }
  });
}


isVisible = false;            // Modal visibility
selectedWithdraw: any = null;
openWithdrawDetails(id: number): void {
  this.withdrawService.getWithdrawById(id).subscribe({
    next: (response) => {
      if (response.statusCode === 200) {
        this.selectedWithdraw = response.data; // Set the fetched data to selectedWithdraw
        this.isVisible = true; // Open modal
      }
    },
    error: (error) => {
      console.error('Error fetching withdraw details:', error); // Handle error
    }
  });
}

// Close the modal
handleCancel(): void {
  this.isVisible = false;  // Close the modal
}

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

  edit(ApplicationID: any) {
    console.log("Edit Leave clicked", ApplicationID);
    // Open a modal or navigate to the edit leave page with leave details

    this.router.navigate([`/loan/approve`, ApplicationID]); 
  }

    OnEditClick(withdrawId: any) {
   
    this.router.navigate([`/wallet/withdraw-update`, withdrawId]); 
  }
  onWithdrawApproveClick( rechargeID: number): void {
    Swal.fire({
      html: `
        <div style="text-align: left;">
  
          <div style="display: flex; align-items: center;">
            <label for="TxtTransactionID" style="width: 120px; font-weight: 600;">Transaction ID</label>
            <input id="TxtTransactionID" type="text" class="swal2-input" style="flex: 1;" placeholder="Enter Transaction ID">
          </div>
        </div>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const transactionID = (document.getElementById('TxtTransactionID') as HTMLInputElement)?.value;
  
        if (!transactionID) {
          Swal.showValidationMessage('Please fill in Transaction ID!');
          return;
        }
  
        return { transactionID };
      },
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const formData = {
          withdrawaID: rechargeID,
          transactionID: result.value.transactionID
        };
  
        console.log('Submitting form data:', formData);
  
        this.withdrawService.approveWithdrawApplication(formData).subscribe({
          next: (response) => {
            console.log('Withdrawal approved successfully:', response);
            this.getWithdrawRequests(); // Refresh table
          },
          error: (error) => {
            console.error('Error approving withdrawal:', error);
          }
        });
      }
    });
  }
  
  
  
  
 onWithdrawRejectClick( rechargeID: number): void {
    Swal.fire({
      html: `
        <div style="text-align: left;">
            <div style="display: flex; align-items: center;">
            <label for="txtRemarks" style="width: 120px; font-weight: 600;">Remarks</label>
            <input id="txtRemarks" type="text" class="swal2-input" style="flex: 1;" placeholder="Enter Remarks">
          </div>
        </div>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const remarks = (document.getElementById('txtRemarks') as HTMLInputElement)?.value;
  
        if (!remarks) {
          Swal.showValidationMessage('Please fill in Remarks!');
          return;
        }
  
        return { remarks };
      },
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const formData = {
          withdrawaID: rechargeID,
          remarks: result.value.remarks
        };
  
        console.log('Submitting form data:', formData);
  
        this.withdrawService.rejectWithdrawApplication(formData).subscribe({
          next: (response) => {
            console.log('Withdrawal approved successfully:', response);
            this.getWithdrawRequests(); // Refresh table
          },
          error: (error) => {
            console.error('Error approving withdrawal:', error);
          }
        });
      }
    });
  }
  
  

}


import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LeaveService } from 'src/app/core/services/leave.service';
import { ILoanApplication } from 'src/app/core/models/interfaces/ILoanApplication';
import { IApiResponse } from 'src/app/core/models/interfaces/IApiResponse';
import Swal from 'sweetalert2';
import { LoanService } from 'src/app/core/services/LoanService';
import { ILeaveData } from 'src/app/core/models/interfaces/ILeave-data';
import { Router } from '@angular/router';
import { ILoanInstalmentDetails } from 'src/app/core/models/interfaces/ILoanInstalmentDetails';
import { DateTimeFormat } from 'intl';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-all-loan-instalment',
  standalone: false,
  templateUrl: './all-loan-instalment.component.html',
  styleUrl: './all-loan-instalment.component.css'
})
export class AllLoanInstalmentComponent implements OnInit{
isLoading = true;
  showContent = false;
  value = '';
  statusFilter = 'All'; 
  searchAny = '';
  dataType: string = 'allDatas';
 
  allDatas: ILoanInstalmentDetails[] = []; // Store original data
  datas: ILoanInstalmentDetails[] = []; // Store filtered data

   listOfCurrentPageData: readonly ILoanInstalmentDetails[] = [];

  constructor(private router: Router , private loanService: LoanService,private modal: NzModalService, private message: NzMessageService,) {}

  selectedDate: Date | null = null;

  ngOnInit(): void {
    const today = new Date();
    this.selectedDate = today;
  
    const formatted = this.formatDate(today); // 'YYYY-MM-DD'
    this.getLoanInstalments(formatted); // ✅ Only date part
  }
  
  onDateChange(date: Date | null): void {
    if (date) {
      const formatted = this.formatDate(date);
      console.log('Selected Date:', formatted);
      this.getLoanInstalments(formatted);
    }
  }
  
  // Format: YYYY-MM-DD
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
/*   loadData() {
    setTimeout(() => {
      this.isLoading = false;
      this.showContent = true;
    }, 500);
  }
 */
  getLoanInstalments(date: any): void {
    this.isLoading = true;
    this.showContent = false; // Hide content while waiting
  
    setTimeout(() => {
      this.loanService.getLaonInstalmentsByMonth(date).subscribe(
        (response: IApiResponse<ILoanInstalmentDetails[]>) => {
          this.isLoading = false;
          this.showContent = true;
  
          if (response.statusCode === 200) {
            this.allDatas = response.data || [];
            this.datas = this.allDatas;
          } else {
            this.allDatas = [];
            this.datas = [];
            console.error('Error fetching instalments:', response.message);
          }
        },
        error => {
          this.allDatas = [];
          this.datas = [];
          this.isLoading = false;
          this.showContent = true;
          console.error('API Error:', error);
        }
      );
    }, 5); // ⏳ 10 seconds delay
  }
  
  
    onCurrentPageDataChange(listOfCurrentPageData: readonly ILoanInstalmentDetails[]): void {
      this.listOfCurrentPageData = listOfCurrentPageData;
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

/*     approve(instalmentID: any) {
      this.modal.confirm({
        nzTitle: 'Are you sure you want to approve this instalment?',
        nzOkText: 'Yes',
        nzCancelText: 'No',
        nzOnOk: () => {
          this.isLoading = true;
          this.loanService.paidInstalment(instalmentID).subscribe({
            next: (response) => {
              this.isLoading = false;
              this.getLoanInstalments('2025-05-05');
              this.message.success('Instalment paid successfully!');
            },
            error: (error) => {
              this.isLoading = false;
              console.error('Error submitting loan:', error);
              this.message.error('Failed to approve loan. Please try again.');
            }
          });
        }
      });
    }
     */

    approve(instalmentID: any): void {
      Swal.fire({
        title: 'Approve Instalment',
        html: `
          <div style="text-align: left;">
            <div style="display: flex; align-items: center;">
              <label for="TxtLateCharge" style="width: 120px; font-weight: 600;">Late Charge</label>
              <input id="TxtLateCharge" type="number" min="0" class="swal2-input" style="flex: 1;" placeholder="Enter Late Charge (optional)">
            </div>
          </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Approve',
        cancelButtonText: 'Cancel',
        preConfirm: () => {
          const lateChargeStr = (document.getElementById('TxtLateCharge') as HTMLInputElement)?.value?.trim();
          const lateCharge = lateChargeStr === '' ? 0 : parseFloat(lateChargeStr);
    
          if (isNaN(lateCharge) || lateCharge < 0) {
            Swal.showValidationMessage('Please enter a valid late charge!');
            return;
          }
    
          return { lateCharge };
        }
      }).then((result) => {
        if (result.isConfirmed && result.value) {
          const lateCharge = result.value.lateCharge;
          this.isLoading = true;
    
          this.loanService.paidInstalment(instalmentID, lateCharge).subscribe({
            next: (response) => {
              this.isLoading = false;
          // ✅ Refresh using selected date
              if (this.selectedDate) {
                const formatted = this.formatDate(this.selectedDate);
                this.getLoanInstalments(formatted);
              }

          this.message.success('Instalment paid successfully!');
            },
            error: (error) => {
              this.isLoading = false;
              console.error('Error submitting loan:', error);
              this.message.error('Failed to approve instalment. Please try again.');
            }
          });
        }
      });
    }
    
    
    
}

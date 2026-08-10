import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { IApiResponse } from 'src/app/core/models/interfaces/IApiResponse';
import { ILeaveData } from 'src/app/core/models/interfaces/ILeave-data';
import { ILeaveApprove } from 'src/app/core/models/interfaces/ILeaveApprove';
import { LeaveService } from 'src/app/core/services/leave.service';
import Swal from 'sweetalert2';
interface Person {
  id: string;
  name: string;
  shipment: string;
  department: string;
  employeeCode: string;
  joinDate: string;
  status: string;
}
@Component({
  selector: 'app-leave-approve',
  templateUrl: './leave-approve.component.html',
  styleUrl: './leave-approve.component.css'
})
export class LeaveApproveComponent {
 isLoading = true;
   showContent = false;
   value = '';
   statusFilter = 'All'; 
   searchAny = '';
   dataType: string = 'allLeaves';
  
   allLeaves: ILeaveApprove[] = []; // Store original data
   leaves: ILeaveApprove[] = []; // Store filtered data
 
    listOfCurrentPageData: readonly ILeaveApprove[] = [];
 
   constructor(private leaveService: LeaveService) {}
 
   ngOnInit(): void {

     this.getLeaves();
   }
 
 
   getLeaves() {
    setTimeout(() => {
      this.isLoading = true;
      this.leaveService.getLvApprovalListApiCall().subscribe(
        (response: IApiResponse<ILeaveApprove[]>) => {
          this.isLoading = false;
    
          if (response.statusCode === 200) {
            this.allLeaves = response.data; // Store all data
            this.showContent = true;
          } else {
            console.error('Error fetching leaves:', response.message);
          }
        },
        error => {
          this.isLoading = false;
          console.error('API Error:', error);
        }
      );
    })
  
   }
   
     onCurrentPageDataChange(listOfCurrentPageData: readonly ILeaveApprove[]): void {
       this.listOfCurrentPageData = listOfCurrentPageData;
   
       console.log(listOfCurrentPageData);
     }
   
   filterByAnyMetchingData() {
     const searchTerm = this.searchAny.toLowerCase().trim();
     
     if (!searchTerm) {
       this.leaves = [...this.allLeaves]; // Reset if search is empty
       return;
     }
 
     this.leaves = this.allLeaves.filter(leave =>
       Object.values(leave).some(value =>
         value?.toString().toLowerCase().includes(searchTerm)
       )
     );
   }
 
   filterByStatus() {
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
   }
 


   
  onlvApproveClick(element: any, lvId: number, Notificationid: number): void {
    let formData = {
      id: lvId ,
      approval_status: element,
      notificationId: Notificationid
   
    };
    try {
      console.log('this data for test lv approve',formData);
      // Pass the formData object to the service method
      this.leaveService.approveApplication(formData).subscribe(
        (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Your leave approve has been successfully!',
          });
          // Uncomment this if loadData refreshes the data view
          this.getLeaves();
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'There was an error submitting your leave Approve. Please try again.',
          });
        }
      );
    } catch (error) {
      console.error('Error handling file upload:', error);
      Swal.fire({
        icon: 'error',
        title: 'File Processing Error',
        text: 'There was an issue processing your files. Please try again.',
      });
    }
  }
  


 
 

}

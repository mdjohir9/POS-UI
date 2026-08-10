import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LeaveService } from 'src/app/core/services/leave.service';
import { ILeaveData } from 'src/app/core/models/interfaces/ILeave-data';
import { IApiResponse } from 'src/app/core/models/interfaces/IApiResponse';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-leave-list',
  standalone: false,
  templateUrl: './leave-list.component.html',
  styleUrl: './leave-list.component.css'
})
export class LeaveListComponent  implements OnInit{
  isLoading = true;
  showContent = false;
  value = '';
  statusFilter = 'All'; 
  searchAny = '';
  dataType: string = 'allLeaves';
 
  allLeaves: ILeaveData[] = []; // Store original data
  leaves: ILeaveData[] = []; // Store filtered data

   listOfCurrentPageData: readonly ILeaveData[] = [];

  constructor(private leaveService: LeaveService) {}

  ngOnInit(): void {
    // this.loadData();
    this.getLeaves();
  }

/*   loadData() {
    setTimeout(() => {
      this.isLoading = false;
      this.showContent = true;
    }, 500);
  }
 */
  getLeaves() {
    setTimeout(()=>{ 
      this.isLoading = true;
      this.leaveService.getLeavesApiCall().subscribe(
        (response: IApiResponse<ILeaveData[]>) => {
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
      );})
   
  }
  
    onCurrentPageDataChange(listOfCurrentPageData: readonly ILeaveData[]): void {
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

  editLeave(leave: any) {
    console.log("Edit Leave clicked", leave);
    // Open a modal or navigate to the edit leave page with leave details
  }
  



deleteLeave(element: any) {
  const leaveId = element; // Assuming the leave ID is a property of the element

  Swal.fire({
    title: 'Are you sure?',
    text: 'Do you really want to delete this leave?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
  }).then((result) => {
    if (result.isConfirmed) {
      this.leaveService.deleteLeave(leaveId).subscribe({
        next: (response: any) => {
          // Handle different status codes in the response
          if (response.statusCode === 200) {
            Swal.fire({
              title: 'Success!',
              text: 'Leave deleted successfully.',
              icon: 'success',
              confirmButtonText: 'OK',
            }).then(() => {
              this.ngOnInit(); // Replace with your function to refresh the leave list
            });
          } else if (response.statusCode === 401) {
            Swal.fire({
              title: 'Error!',
              text: 'The leave is already being processed, so it cannot be deleted.',
              icon: 'error',
              confirmButtonText: 'OK',
            }).then(() => {
              this.ngOnInit(); // Refresh the list if needed
            });
          } else if (response.statusCode === 402) {
            Swal.fire({
              title: 'Error!',
              text: 'The leave is already approved, so it cannot be deleted.',
              icon: 'error',
              confirmButtonText: 'OK',
            }).then(() => {
              this.ngOnInit();
            });
          } else if (response.statusCode === 403) {
            Swal.fire({
              title: 'Error!',
              text: 'The leave is already rejected, so it cannot be deleted.',
              icon: 'error',
              confirmButtonText: 'OK',
            }).then(() => {
              this.ngOnInit();
            });
          }
        },
        error: (error) => {
          // Handle unexpected errors or bad request errors
          if (error.status === 400) {
            // @ts-ignore
            MessageSWT('Error', error.error.message)
            Swal.fire({
              title: 'Error!',
              text: error.error.message || 'Bad request while deleting the leave.',
              icon: 'error',
              confirmButtonText: 'OK',
            });
          } else {
            Swal.fire({
              title: 'Error!',
              text: 'An unexpected error occurred while deleting the leave.',
              icon: 'error',
              confirmButtonText: 'OK',
            });
          }
        },
      });
    }
  });
}
}
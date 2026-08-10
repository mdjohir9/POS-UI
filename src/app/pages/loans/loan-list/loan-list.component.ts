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
  selector: 'app-loan-list',
  standalone: false,
  templateUrl: './loan-list.component.html',
  styleUrl: './loan-list.component.css', 
   

})
export class LoanListComponent  implements OnInit{
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
      this.loanService.getAllLaons().subscribe(
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

    ViewInstalment(loanId: any) {
    console.log("Edit Leave clicked", loanId);
    // Open a modal or navigate to the edit leave page with leave details

    this.router.navigate([`/loan/instalment`, loanId]); 
  }
  

  isVisible = false;            // Modal visibility
  selectedWithdraw: any = null;
  openWithdrawDetails(id: number): void {
    this.loanService.getLoanStatementById(id).subscribe({
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

    isTramsVisible = false;            // Modal visibility
  openTramsandCondition(id: number): void {
   this.isTramsVisible = true; 
  }

  
  // Close the modal
  handleCancel(): void {
    this.isVisible = false;  // Close the modal
    this.isTramsVisible =false;
  }
  
  downloadPDF() {
    const element = document.getElementById('cv-content');
    if (!element) return;
  
    const images = element.querySelectorAll('img');
    const promises: Promise<void>[] = [];
  
    images.forEach((img: HTMLImageElement) => {
      const imgSrc = img.getAttribute('src');
  
      // Important: Only process if src exists
      if (!imgSrc) return;
  
      // Already Base64
      if (imgSrc.startsWith('data:')) return;
  
      promises.push(
        this.convertImgToBase64(imgSrc).then((base64) => {
          img.src = base64;
        }).catch((err) => {
          console.warn('Failed to load image:', imgSrc, err);
        })
      );
    });
  
    Promise.all(promises).then(() => {
      this.generatePDF(element);
    });
  }

    downloadPDFAggrement() {
    const element = document.getElementById('agreement-content');
    if (!element) return;
  
    const images = element.querySelectorAll('img');
    const promises: Promise<void>[] = [];
  
    images.forEach((img: HTMLImageElement) => {
      const imgSrc = img.getAttribute('src');
  
      // Important: Only process if src exists
      if (!imgSrc) return;
  
      // Already Base64
      if (imgSrc.startsWith('data:')) return;
  
      promises.push(
        this.convertImgToBase64(imgSrc).then((base64) => {
          img.src = base64;
        }).catch((err) => {
          console.warn('Failed to load image:', imgSrc, err);
        })
      );
    });
  
    Promise.all(promises).then(() => {
      this.generatePDF(element);
    });
  }
  
  
  // Helper function to fetch image and convert to Base64
  convertImgToBase64(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous'; // Important for CORS
  
      img.onload = function() {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject('Canvas context not found');
          return;
        }
        ctx.drawImage(img, 0, 0);
        try {
          const dataURL = canvas.toDataURL('image/png');
          resolve(dataURL);
        } catch (error) {
          reject(error);
        }
      };
  
      img.onerror = function(e) {
        reject('Image load failed');
      };
  
      img.src = url;
    });
  }
  
  generatePDF(element: HTMLElement) {
    html2pdf().from(element).set({
      margin: 0.5,
      filename: `CustomerProfile.pdf`,
      html2canvas: {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: true,
      },
      jsPDF: {
        unit: 'in',
        format: 'a4',
        orientation: 'portrait',
      },
    }).save();
  }
    
  
/* deleteLeave(element: any) {
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
} */
}

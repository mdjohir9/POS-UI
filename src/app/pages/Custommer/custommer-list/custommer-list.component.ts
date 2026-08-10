import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LeaveService } from 'src/app/core/services/leave.service';
import { ILeaveData } from 'src/app/core/models/interfaces/ILeave-data';
import { IApiResponse } from 'src/app/core/models/interfaces/IApiResponse';
import Swal from 'sweetalert2';
import { CustommerService } from 'src/app/core/services/custommerService';
import { ICustomerDetailes } from 'src/app/core/models/interfaces/ICustommerDetailes';
import { Router, Routes } from '@angular/router';
import { CustommerAddComponent } from '../Add-custommer/Custommer-Add.component';
@Component({
  selector: 'app-custommer-list',
  standalone: false,
  templateUrl: './custommer-list.component.html',
  styleUrl: './custommer-list.component.css'
})
export class CustommerListComponent {
 isLoading = true;
  showContent = false;
  value = '';
  statusFilter = 'All'; 
  searchAny = '';
  dataType: string = 'allCustommer';
 
  allCustommer: ICustomerDetailes [] = [];
  custommers: ICustomerDetailes[] = []; 
   listOfCurrentPageData: readonly ICustomerDetailes[] = [];

  constructor(private router: Router,private Custommer: CustommerService) {}

  ngOnInit(): void {

    this.getCustommerList();
    
  }

/*   loadData() {
    setTimeout(() => {
      this.isLoading = false;
      this.showContent = true;
    }, 500);
  }
 */

  getCustommerList() {
    setTimeout(()=>{ 
      this.isLoading = true;
      this.Custommer.getAllCustommerInfo().subscribe(
        (response: IApiResponse<ICustomerDetailes[]>) => {
          this.isLoading = false;
    
          if (response.statusCode === 200) {
            this.allCustommer = response.data; // Store all data
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

  
    onCurrentPageDataChange(listOfCurrentPageData: readonly ICustomerDetailes[]): void {
      this.listOfCurrentPageData = listOfCurrentPageData;
  
      console.log(listOfCurrentPageData);
    }
  
    filterByAnyMetchingData() {
      const searchTerm = this.searchAny.toLowerCase().trim();
    
      if (!searchTerm) {
        this.custommers = [...this.allCustommer]; // Reset
        this.dataType = 'allCustommer'; // Show full list
        return;
      }
    
      this.custommers = this.allCustommer.filter(custommer =>
        Object.values(custommer).some(value =>
          value?.toString().toLowerCase().includes(searchTerm)
        )
      );
    
      this.dataType = 'custommers'; // Show filtered result
    }
    



  editcustommer(customerId: any) {
    console.log("Edit Customer clicked", customerId);
    this.router.navigate([`/custommer/update`, customerId]);  // Adjusted to match lazy-loaded route
  }

  ViewcProfile(customerId: any) {
    console.log("Edit Customer clicked", customerId);
    this.router.navigate([`/custommer/profile/`, customerId]);  // Adjusted to match lazy-loaded route
  }


  deletecustommer(customerId: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this customer?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.Custommer.DeleteCustomerByeId(customerId).subscribe({
          next: (response: any) => {
            if (response?.statusCode === 200) {
              Swal.fire({
                title: 'Deleted!',
                text: 'Customer deleted successfully.',
                icon: 'success',
                confirmButtonText: 'OK',
              }).then(() => {
                this.ngOnInit(); // Refresh your customer list or data view
              });
            } else {
              Swal.fire({
                title: 'Error!',
                text: response?.message || 'Unexpected response while deleting customer.',
                icon: 'error',
                confirmButtonText: 'OK',
              });
            }
          },
          error: (error) => {
            if (error.status === 400) {
              Swal.fire({
                title: 'Error!',
                text: error.error?.message || 'Bad request while deleting the customer.',
                icon: 'error',
                confirmButtonText: 'OK',
              });
            } else {
              Swal.fire({
                title: 'Error!',
                text: 'An unexpected error occurred while deleting the customer.',
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
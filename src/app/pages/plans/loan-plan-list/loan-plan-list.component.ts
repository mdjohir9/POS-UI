import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, Routes } from '@angular/router';
import { NzFormTooltipIcon } from 'ng-zorro-antd/form';
import { LoanPlanService } from 'src/app/core/services/loanPlanService';
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
  selector: 'app-loan-plan-list',
  standalone: false,
  templateUrl: './loan-plan-list.component.html',
  styleUrl: './loan-plan-list.component.css'
})
export class LoanPlanListComponent {
  isLoading = true;
  showContent = true;
  value = '';
  statusFilter = 'All'; 
  searchAny = '';
  dataType: string = 'allDatas';
 
  allDatas: any[] = []; 
  datas: any[] = []; 
  constructor(private fb: UntypedFormBuilder,private http: HttpClient, private loanPlan: LoanPlanService ,private router: Router) {}

  ngOnInit(): void {
    this.getRechargeRequests();
  }

  
    loadData() {
      setTimeout(() => {
        this.isLoading = false;
        this.showContent = true;
      }, 500);
    }

    getRechargeRequests(): void {
      this.loanPlan.getLaonPlans().subscribe({
        next: (response) => {
          if (response.statusCode === 200) {
            this.allDatas = response.data;
            this.isLoading = false;
            this.showContent = true;
          }
        },
        error: (err) => {
          console.error('Failed to load recharge data:', err);
          this.allDatas = [];
          this.datas = [];
          this.isLoading = false;
          this.showContent = true;
        }
      });
    }
  
  
  

  

    editcustommer(planId: any) {
      console.log("Edit Customer clicked", planId);
      this.router.navigate([`/plans/update`, planId]);  // Adjusted to match lazy-loaded route
    }
  
  
    

  deletecustommer(customerId: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this plan?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loanPlan.DeletePlanByeId(customerId).subscribe({
          next: (response: any) => {
            if (response?.statusCode === 200) {
              Swal.fire({
                title: 'Deleted!',
                text: 'Paln deleted successfully.',
                icon: 'success',
                confirmButtonText: 'OK',
              }).then(() => {
                this.ngOnInit(); // Refresh your customer list or data view
              });
            } else {
              Swal.fire({
                title: 'Error!',
                text: response?.message || 'Unexpected response while deleting Paln.',
                icon: 'error',
                confirmButtonText: 'OK',
              });
            }
          },
          error: (error) => {
            if (error.status === 400) {
              Swal.fire({
                title: 'Error!',
                text: error.error?.message || 'Bad request while deleting the Paln.',
                icon: 'error',
                confirmButtonText: 'OK',
              });
            } else {
              Swal.fire({
                title: 'Error!',
                text: 'An unexpected error occurred while deleting the Paln.',
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

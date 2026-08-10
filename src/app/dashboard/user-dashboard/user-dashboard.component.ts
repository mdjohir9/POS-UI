import { Component } from '@angular/core'
import { ActivatedRoute } from '@angular/router';
import { IApiResponse } from 'src/app/core/models/interfaces/IApiResponse';
import { ILoanInstalmentDetails } from 'src/app/core/models/interfaces/ILoanInstalmentDetails';
import { ITransctioDetailes } from 'src/app/core/models/interfaces/ITransctioDetailes';
import { DashboardService } from 'src/app/core/services/dashboardService';
import { LoanService } from 'src/app/core/services/LoanService';

@Component({
    templateUrl: './user-dashboard.component.html'
})

export class UserDashboardComponent {
  isLoading = true;
  showContent = false;

  customerId: string | null = null; 
  dataType: string = 'allDatas';
  loanId: string | null = null; 
  allDatas: ILoanInstalmentDetails[] = []; // Store original data
  datas: ILoanInstalmentDetails[] = []; 

  allTransactions  : ITransctioDetailes [] =[];
  filteredTransactions   : ITransctioDetailes [] =[];

  constructor(private dashboardService: DashboardService, private route: ActivatedRoute, private loanService: LoanService) {}

  ngOnInit() {

    this.route.paramMap.subscribe(params => {
      const urlCustomerId = params.get('id'); // Get from URL
      const urloanId = params.get('id'); // Get from URL

  
      if (urlCustomerId) {
        this.customerId = urlCustomerId; // Use URL ID
        this.getLoanBalance(this.customerId);
      } else {
        this.customerId = sessionStorage.getItem('__customerID__'); // Use session ID if URL ID is missing
        this.loanId = sessionStorage.getItem('__LoanId__'); // Use session ID if URL ID is missing
        this.getLoanBalance(this.customerId);
        this.getLoanInstalments(this.loanId);
      }
  
      console.log("Current Customer ID:", this.customerId);
    });



    const today = new Date();

    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  
    this.fromDate = this.formatDate(firstDay);
    this.toDate = this.formatDate(lastDay);
  
    this.filterByDate();
 


  }
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0]; // returns 'YYYY-MM-DD'
  }
  
  loadData() {
    // Simulate an asynchronous data loading operation
    setTimeout(() => {
      this.isLoading = false;
      this.showContent = true;
    }, 500);
  }

  blanceAmount = {
    balanceAmount: 0,
    loanAmount: 0,
    dueAmount: 0,
    monthlyInstallment: 0
  };
  
  getLoanBalance(id: string | null): void {
    if (!id) return;
  
    this.isLoading = true;
    this.showContent = false;
    this.dashboardService.getLoanBalanceById(+id).subscribe({
      next: (response) => {
            this.isLoading = false;
          this.showContent = true;
  
        if (response.statusCode === 200 && response.data) {
          this.blanceAmount = response.data;
          this.isLoading = false;
          this.showContent = true;
        }
        else{

            console.error('Error fetching loan instalments:', response.message);
        }
      },
      error: (error) => {
          this.isLoading = false;
          this.showContent = true;
   
          console.error('API Error:', error);
      }
    });
  }


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
            this.datas = this.allDatas;
          } else {
            this.allDatas = [];
            this.datas = [];
            console.error('Error fetching loan instalments:', response.message);
          }
        },
        error => {
          this.isLoading = false;
          this.showContent = true;
          this.allDatas = [];
          this.datas = [];
          console.error('API Error:', error);
        }
      );
    }); // ⏱ Adjust delay here if needed
  }

  fromDate: string = ''; // Bound to the input
  toDate: string = '';   // Bound to the input
  
  filterByDate(): void {
    if (!this.fromDate || !this.toDate) {
      console.warn('Both fromDate and toDate are required.');
      return;
    }
  
    this.isLoading = true;
  
    setTimeout(() => {
      this.dashboardService.getTransctionByeCustomerIdAndDateRange(this.customerId, this.fromDate, this.toDate).subscribe(
        (response: IApiResponse<ITransctioDetailes[]>) => {
          this.isLoading = false;  
          if (response.statusCode === 200) {
            this.allTransactions  = response.data || [];
            this.filteredTransactions  = this.allTransactions;
          } else {
            this.allTransactions = [];
            this.filteredTransactions = [];
            console.error('Transaction fetch failed:', response.message);
          }
        },
        error => {
          this.isLoading = false;
          this.showContent = true;
          this.allTransactions = [];
          this.filteredTransactions = [];
          console.error('API Error:', error);
        }
      );
    },);
  }
  
  
  
}

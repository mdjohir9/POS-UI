import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DashboardService } from 'src/app/core/services/dashboardService';
import {SaleGrowthComponent} from 'src/app/container/dashboard/demoOne/salesGrowth.component';
import {SaleReportComponent} from 'src/app/container/dashboard/demoOne/salesReport.component';
import { UpcomingInstalmentComponent } from './upcoming-instalment/upcoming-instalment.component';
@Component({
  templateUrl: './admin-dashboard.component.html'
})
export class AdminDashboardComponent  {
  isLoading = true;
  showContent = false;
  
  @ViewChild(SaleGrowthComponent) 
  stockInOutComponent!: SaleGrowthComponent;

  @ViewChild (SaleReportComponent) disbursedAndRecoveredSummary !: SaleReportComponent;
  @ViewChild (UpcomingInstalmentComponent) upcomingInstalmentComponent !: UpcomingInstalmentComponent;

filterDate: string = new Date().toISOString().split('T')[0];
  constructor(private dashboardService: DashboardService, private route: ActivatedRoute) {}

  ngOnInit() {
     this.getBalance();
      this.stockInOutComponent.getStockInOutSummary(this.filterDate);
  }

  


  loadData() {
    // Simulate an asynchronous data loading operation
    setTimeout(() => {
      this.isLoading = false;
      this.showContent = true;
    }, 500);
  }
 // Initialize the variable

  OnFilterClick() {
    if (this.filterDate) {
      this.stockInOutComponent.getStockInOutSummary(this.filterDate);
    } else {
      console.warn('No date selected');
    }

  const year = this.filterDate.split('-')[0];
    this.disbursedAndRecoveredSummary.getSalesPurchaseSummary(year);

    this.upcomingInstalmentComponent.getSalesList(this.filterDate);

  }


  blanceAmount = {
    totalCustomers: 0,
    totalActiveLoan: 0,
    disbursementAmount: 0,
    repaymentAmount: 0
  };



getBalance(): void {
  this.isLoading = true;
  this.showContent = false;

  const companyId = 1;

  this.dashboardService
    .getAdminBalance(companyId, this.filterDate)
    .subscribe({
      next: (response) => {
        this.isLoading = false;

        if (response.statusCode === 200 && response.data) {
          this.blanceAmount = response.data;
          this.showContent = true;
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.showContent = false;

        console.error(
          'Error fetching dashboard summary:',
          error
        );
      }
    });
}
}

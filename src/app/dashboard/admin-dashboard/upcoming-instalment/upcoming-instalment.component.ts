import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LeaveService } from 'src/app/core/services/leave.service';
import { ILoanApplication } from 'src/app/core/models/interfaces/ILoanApplication';
import { IApiResponse } from 'src/app/core/models/interfaces/IApiResponse';
import Swal from 'sweetalert2';
import { ILeaveData } from 'src/app/core/models/interfaces/ILeave-data';
import { Router } from '@angular/router';
import { ILoanInstalmentDetails } from 'src/app/core/models/interfaces/ILoanInstalmentDetails';
import { DateTimeFormat } from 'intl';
import { SalesService } from 'src/app/core/services/sales.service';
@Component({
  selector: 'upcoming-loan-instalment',
  standalone: false,
  templateUrl: './upcoming-instalment.component.html',
  styleUrl: './upcoming-instalment.component.css'
})
export class UpcomingInstalmentComponent implements OnInit{
 isLoading = true;
  showContent = false;
  value = '';
  statusFilter = 'All'; 
  searchAny = '';
  dataType: string = 'allDatas';
 
  allDatas: ILoanInstalmentDetails[] = []; // Store original data
  datas: ILoanInstalmentDetails[] = []; // Store filtered data

   listOfCurrentPageData: readonly ILoanInstalmentDetails[] = [];
  filterDate: string = '';
  message: any;
  constructor(private router: Router , private salesService: SalesService) {}

  ngOnInit(): void {
    // this.loadData();

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // months are 0-based
    const day = String(today.getDate()).padStart(2, '0');

    this.filterDate = `${year}-${month}-${day}`;
    this.getSalesList(this.filterDate);

  }

/*   loadData() {
    setTimeout(() => {
      this.isLoading = false;
      this.showContent = true;
    }, 500);
  }
 */

    getSalesList(date: string): void {

    this.isLoading = true;

    this.salesService.getSalesList().subscribe({

      next: (response: any) => {

        if (response && response.statusCode === 200) {

          this.allDatas = response.data || [];
          this.datas = [...this.allDatas];

          this.showContent = true;
        }
        else {

          this.allDatas = [];
          this.datas = [];

          this.showContent = true;
        }

        this.isLoading = false;
      },

      error: (error) => {

        console.error(
          'Failed to load sales list:',
          error
        );

        this.allDatas = [];
        this.datas = [];

        this.showContent = true;
        this.isLoading = false;
      }
    });
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


isInvoiceModalVisible = false;
InvoiceData: any = null;

viewInvoice(salesMasterId: number): void {

  this.salesService.getSalesInvoiceById(salesMasterId).subscribe({

    next: (response: any) => {

      if (response && response.statusCode === 200 && response.data) {

        this.InvoiceData = response.data;

        this.isInvoiceModalVisible = true;
      }
      else {

        this.InvoiceData = null;

        this.message.error(
          response?.message || 'Invoice not found.'
        );
      }

    },

    error: (error) => {

      console.error('Invoice load failed:', error);

      this.InvoiceData = null;

      this.message.error(
        error?.error?.message || 'Failed to load invoice.'
      );
    }

  });
}
closeInvoiceModal(): void {
  this.isInvoiceModalVisible = false;
}
openInvoiceModal(): void {
  this.isInvoiceModalVisible = true;
}
}

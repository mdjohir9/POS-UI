import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { SalesService } from 'src/app/core/services/sales.service';

export interface SalesItem {
  salesId: number;
  invoiceNo: string;
  salesDate: string;
  customerId: number;
  customerName: string;
  productName: string;
  paymentMethod: string;
  grossAmount: number;
  discountAmount: number;
  netAmount: number;
}

@Component({
  selector: 'app-product-sales-list',
  standalone: false,
  templateUrl: './product-sales-list.component.html',
  styleUrl: './product-sales-list.component.css'
})
export class ProductSalesListComponent implements OnInit {

  isLoading = true;
  showContent = false;

  searchAny = '';
  dataType: string = 'allDatas';

  allDatas: SalesItem[] = [];
  datas: SalesItem[] = [];

  constructor(
    private fb: UntypedFormBuilder,
    private salesService: SalesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getSalesList();
  }

  // =========================
  // Get Sales List
  // =========================
  getSalesList(): void {

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

  // =========================
  // Search
  // =========================
  filterByAnyMatchingData(): void {

    if (!this.searchAny.trim()) {

      this.datas = [...this.allDatas];
      this.dataType = 'allDatas';

      return;
    }

    const query =
      this.searchAny.toLowerCase().trim();

    this.datas = this.allDatas.filter(item =>
      item.invoiceNo?.toLowerCase().includes(query) ||
      item.customerName?.toLowerCase().includes(query) ||
      item.productName?.toLowerCase().includes(query) ||
      item.paymentMethod?.toLowerCase().includes(query) ||
      item.customerId?.toString().includes(query)
    );

    this.dataType = 'datas';
  }

  // =========================
  // Edit Sales
  // =========================
  editSales(salesId: number): void {

    console.log(
      'Edit Sales:',
      salesId
    );

    this.router.navigate([
      '/sales/update',
      salesId
    ]);
  }

  // =========================
  // Delete Sales
  // =========================
  deleteSales(salesId: number, invoiceNo: string): void {

    Swal.fire({

      title: 'Are you sure?',

      text:
        `Do you really want to delete sales ${invoiceNo}?`,

      icon: 'warning',

      showCancelButton: true,

      confirmButtonColor: '#3085d6',

      cancelButtonColor: '#d33',

      confirmButtonText: 'Yes, delete it!'

    }).then((result) => {

      if (result.isConfirmed) {

        // এখানে পরে actual delete API call করবে

        console.log(
          'Delete Sales:',
          salesId
        );

      }

    });
  }

}
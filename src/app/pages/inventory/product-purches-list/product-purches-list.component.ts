import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { PurchaseService } from 'src/app/core/services/purchase.service';

interface PurchaseItem {
  id: number;
  companyId: string;
  supplierId: number;
  supplierName: string;
  purchaseNo: string;
  purchaseDate: string;
  totalAmount: number;
}

@Component({
  selector: 'app-product-purches-list',
  standalone: false,
  templateUrl: './product-purches-list.component.html',
  styleUrl: './product-purches-list.component.css'
})
export class ProductPurchesListComponent {

  isLoading = true;
  showContent = false;

  searchAny = '';
  dataType: string = 'allDatas';

  allDatas: PurchaseItem[] = [];
  datas: PurchaseItem[] = [];

  constructor(
    private purchaseService: PurchaseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getPurchesList();
  }


  // =========================
  // Get Purchase List
  // =========================
  getPurchesList(): void {

    this.isLoading = true;

    this.purchaseService.getPurchases().subscribe({

      next: (response) => {

        if (response.statusCode === 200) {

          this.allDatas = response.data || [];

          this.datas = [...this.allDatas];

        } else {

          this.allDatas = [];
          this.datas = [];

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response.message || 'Purchase not found.'
          });

        }

        this.isLoading = false;
        this.showContent = true;
      },

      error: (error) => {

        console.error(
          'Purchase List API Error:',
          error
        );

        this.allDatas = [];
        this.datas = [];

        this.isLoading = false;
        this.showContent = true;

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load purchase list.'
        });

      }

    });
  }


  // =========================
  // Search
  // =========================
  filterByAnyMatchingData(): void {

    const query = this.searchAny
      .toLowerCase()
      .trim();

    if (!query) {

      this.datas = [...this.allDatas];
      this.dataType = 'allDatas';

      return;
    }

    this.datas = this.allDatas.filter(item =>

      item.purchaseNo
        ?.toLowerCase()
        .includes(query)

      ||

      item.supplierName
        ?.toLowerCase()
        .includes(query)

    );

    this.dataType = 'datas';
  }


  // =========================
  // Edit Purchase
  // =========================
  editPurchase(id: number): void {

    console.log(
      'Edit Purchase ID:',
      id
    );

    this.router.navigate([
      '/purchase/update',
      id
    ]);
  }


  // =========================
  // Delete Purchase
  // =========================
  deletePurchase(
    id: number,
    purchaseNo: string
  ): void {

    Swal.fire({

      title: 'Are you sure?',

      text:
        `Do you really want to delete purchase record ${purchaseNo}?`,

      icon: 'warning',

      showCancelButton: true,

      confirmButtonColor: '#3085d6',

      cancelButtonColor: '#d33',

      confirmButtonText: 'Yes, delete it!',

    }).then((result) => {

      if (!result.isConfirmed) {
        return;
      }

      this.purchaseService
        .deletePurchase(id)
        .subscribe({

          next: (response) => {

            if (response.statusCode === 200) {

              Swal.fire({

                title: 'Deleted!',

                text:
                  response.message ||
                  'Purchase record deleted successfully.',

                icon: 'success',

                confirmButtonText: 'OK'

              });

              // Remove from local list
              this.allDatas =
                this.allDatas.filter(
                  item => item.id !== id
                );

              this.datas =
                this.datas.filter(
                  item => item.id !== id
                );

            } else {

              Swal.fire({

                title: 'Failed!',

                text:
                  response.message ||
                  'Failed to delete purchase.',

                icon: 'error'

              });

            }

          },

          error: (error) => {

            console.error(
              'Delete Purchase Error:',
              error
            );

            Swal.fire({

              title: 'Error!',

              text:
                error?.error?.message ||
                'Failed to delete purchase.',

              icon: 'error'

            });

          }

        });

    });
  }


  // =========================
  // Refresh
  // =========================
  refreshList(): void {
    this.searchAny = '';
    this.getPurchesList();
  }

}

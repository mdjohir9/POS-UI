import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
interface PurchaseDetail {
  productId: number;
  productName?: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface PurchaseItem {
  purchaseNo: string;
  purchaseDate: string;
  supplierId: number;
  supplierName: string;
  totalAmount: number;
  details: PurchaseDetail[];
}
@Component({
  selector: 'app-product-purches-list',
  standalone: false,
  templateUrl: './product-purches-list.component.html',
  styleUrl: './product-purches-list.component.css'
})
export class ProductPurchesListComponent {isLoading = true;
  showContent = false;
  searchAny = '';
  dataType: string = 'allDatas';

  allDatas: PurchaseItem[] = []; 
  datas: PurchaseItem[] = []; 

  constructor(
    private fb: UntypedFormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getPurchesList();
  }

  getPurchesList(): void {
    this.isLoading = true;
    
    // Demo Data matching your API schema
    setTimeout(() => {
      this.allDatas = [
        {
          purchaseNo: "PO-2026-001",
          purchaseDate: "2026-08-12T05:05:51.236Z",
          supplierId: 101,
          supplierName: "Acme Trading Co.",
          totalAmount: 1250.00,
          details: [
            { productId: 501, productName: "Cotton Yarn 30/1", quantity: 50, rate: 15, amount: 750 },
            { productId: 502, productName: "Dyeing Chemical", quantity: 10, rate: 50, amount: 500 }
          ]
        },
        {
          purchaseNo: "PO-2026-002",
          purchaseDate: "2026-08-11T09:30:00.000Z",
          supplierId: 102,
          supplierName: "Global Garments Ltd.",
          totalAmount: 2400.00,
          details: [
            { productId: 503, productName: "Knit Fabric Roll", quantity: 20, rate: 120, amount: 2400 }
          ]
        },
        {
          purchaseNo: "PO-2026-003",
          purchaseDate: "2026-08-10T14:15:20.000Z",
          supplierId: 101,
          supplierName: "Acme Trading Co.",
          totalAmount: 450.00,
          details: [
            { productId: 501, productName: "Cotton Yarn 30/1", quantity: 30, rate: 15, amount: 450 }
          ]
        }
      ];

      this.datas = [...this.allDatas];
      this.isLoading = false;
      this.showContent = true;
    }, 600);
  }

  // Filter Search Logic
  filterByAnyMatchingData(): void {
    if (!this.searchAny.trim()) {
      this.dataType = 'allDatas';
      return;
    }

    const query = this.searchAny.toLowerCase().trim();
    this.datas = this.allDatas.filter(item => 
      item.purchaseNo.toLowerCase().includes(query) ||
      item.supplierName.toLowerCase().includes(query)
    );
    this.dataType = 'datas';
  }

  // Edit Purchase
  editPurchase(purchaseNo: string): void {
    console.log("Edit Purchase clicked:", purchaseNo);
    this.router.navigate([`/purchase/update`, purchaseNo]);
  }

  // Delete Purchase
  deletePurchase(purchaseNo: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you really want to delete purchase record ${purchaseNo}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        // Mock Delete Logic
        this.allDatas = this.allDatas.filter(item => item.purchaseNo !== purchaseNo);
        this.filterByAnyMatchingData();

        Swal.fire({
          title: 'Deleted!',
          text: 'Purchase record deleted successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
        });
      }
    });
  }
  
      
}

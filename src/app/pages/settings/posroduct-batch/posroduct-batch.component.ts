import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ProductService } from 'src/app/core/services/product.service';
import { ProductBatchService } from 'src/app/core/services/ProductBatchService ';
import Swal from 'sweetalert2';


interface ProductBatch {
  id: number;
  productId: number;
  companyId: number;
  batchNo: string;
  lotNo: string;
  manufacturingDate: string;
  expiryDate: string;
  purchasePrice: number;
  sellingPrice: number;
  receiveQty: number;
  availableQty: number;
  isActive: boolean;
}


@Component({
  selector: 'app-posroduct-batch',
  templateUrl: './posroduct-batch.component.html',
  styleUrls: ['./posroduct-batch.component.css']
})
export class PosroductBatchComponent implements OnInit {
 batchForm!: FormGroup;
  productBatches: ProductBatch[] = [];
  products: any[] = [];

  companyId: number = 0;
  isBatchModalVisible = false;
  isBatchEditMode = false;
  selectedBatchId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private productBatchService: ProductBatchService,
    private productService: ProductService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.companyId = Number(sessionStorage.getItem('__companyId__')) || 0;
    this.initBatchForm();
    this.getProducts();
    this.getProductBatches();
  }

  initBatchForm(): void {
    this.batchForm = this.fb.group({
      productId: [null, [Validators.required]],
      companyId: [this.companyId, [Validators.required]],
      batchNo: ['', [Validators.required, Validators.maxLength(100)]],
      lotNo: ['', [Validators.maxLength(100)]],
      manufacturingDate: [null],
      expiryDate: [null],
      purchasePrice: [0, [Validators.required, Validators.min(0)]],
      sellingPrice: [0, [Validators.required, Validators.min(0)]],
      receiveQty: [0, [Validators.required, Validators.min(0)]],
      availableQty: [0],
      isActive: [true]
    });
  }

  getProducts(): void {
    this.productService.getProducts().subscribe({
      next: (response) => {
        if (response.statusCode === 200) {
          this.products = response.data || [];
        } else {
          this.products = [];
          this.message.error(response.message || 'Product not found.');
        }
      },
      error: (error) => {
        console.error('Product API Error:', error);
        this.products = [];
        this.message.error('Failed to load products.');
      }
    });
  }

  getProductBatches(): void {
    this.productBatchService.getProductBatches().subscribe({
      next: (response) => {
        if (response.statusCode === 200) {
          this.productBatches = response.data || [];
        } else {
          this.productBatches = [];
          this.message.error(response.message || 'Product batch not found.');
        }
      },
      error: (error) => {
        console.error('Product Batch API Error:', error);
        this.productBatches = [];
        this.message.error('Failed to load product batches.');
      }
    });
  }

  showAddBatch(): void {
    this.isBatchEditMode = false;
    this.selectedBatchId = null;

    this.batchForm.reset({
      productId: null,
      companyId: this.companyId,
      batchNo: '',
      lotNo: '',
      manufacturingDate: null,
      expiryDate: null,
      purchasePrice: 0,
      sellingPrice: 0,
      receiveQty: 0,
      availableQty: 0,
      isActive: true
    });

    this.isBatchModalVisible = true;
  }

  editBatch(id: number): void {
    this.productBatchService.getProductBatchById(id).subscribe({
      next: (response) => {
        if (response.statusCode === 200) {
          const batch = response.data;

          this.isBatchEditMode = true;
          this.selectedBatchId = id;

          this.batchForm.patchValue({
            productId: batch.productId,
            companyId: batch.companyId || this.companyId,
            batchNo: batch.batchNo,
            lotNo: batch.lotNo,
            manufacturingDate: batch.manufacturingDate ? new Date(batch.manufacturingDate) : null,
            expiryDate: batch.expiryDate ? new Date(batch.expiryDate) : null,
            purchasePrice: batch.purchasePrice,
            sellingPrice: batch.sellingPrice,
            receiveQty: batch.receiveQty,
            availableQty: batch.availableQty,
            isActive: batch.isActive
          });

          this.isBatchModalVisible = true;
        } else {
          this.message.error(response.message || 'Unable to load product batch.');
        }
      },
      error: (error) => {
        console.error('Get Product Batch Error:', error);
        this.message.error('Failed to load product batch.');
      }
    });
  }

  onBatchSubmit(): void {
    if (this.batchForm.invalid) {
      Object.values(this.batchForm.controls).forEach(control => {
        control.markAsDirty();
        control.updateValueAndValidity();
      });
      return;
    }

    const formValue = this.batchForm.getRawValue();

    const payload = {
      productId: Number(formValue.productId),
      companyId: this.companyId,
      batchNo: formValue.batchNo,
      lotNo: formValue.lotNo || '',
      manufacturingDate: formValue.manufacturingDate ? new Date(formValue.manufacturingDate).toISOString() : null,
      expiryDate: formValue.expiryDate ? new Date(formValue.expiryDate).toISOString() : null,
      purchasePrice: Number(formValue.purchasePrice),
      sellingPrice: Number(formValue.sellingPrice),
      receiveQty: Number(formValue.receiveQty),
      availableQty: this.isBatchEditMode ? Number(formValue.availableQty) : Number(formValue.receiveQty),
      isActive: formValue.isActive
    };

    if (this.isBatchEditMode && this.selectedBatchId !== null) {
      this.productBatchService.updateProductBatch(payload, this.selectedBatchId).subscribe({
        next: (response) => {
          if (response.statusCode === 200) {
            this.message.success(response.message || 'Product batch updated successfully.');
            this.isBatchModalVisible = false;
            this.resetBatchForm();
            this.getProductBatches();
          } else {
            this.message.error(response.message || 'Failed to update product batch.');
          }
        },
        error: (error) => {
          console.error('Update Product Batch Error:', error);
          this.message.error('Failed to update product batch.');
        }
      });
      return;
    }

    this.productBatchService.createProductBatch(payload).subscribe({
      next: (response) => {
        if (response.statusCode === 200) {
          this.message.success(response.message || 'Product batch created successfully.');
          this.isBatchModalVisible = false;
          this.resetBatchForm();
          this.getProductBatches();
        } else {
          this.message.error(response.message || 'Failed to create product batch.');
        }
      },
      error: (error) => {
        console.error('Create Product Batch Error:', error);
        this.message.error('Failed to create product batch.');
      }
    });
  }

  deleteBatch(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this product batch?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productBatchService.deleteProductBatch(id).subscribe({
          next: (response) => {
            if (response.statusCode === 200) {
              this.message.success(response.message || 'Product batch deleted successfully.');
              this.getProductBatches();
            } else {
              this.message.error(response.message || 'Failed to delete product batch.');
            }
          },
          error: (error) => {
            console.error('Delete Product Batch Error:', error);
            this.message.error('Failed to delete product batch.');
          }
        });
      }
    });
  }

  handleBatchCancel(): void {
    this.isBatchModalVisible = false;
    this.resetBatchForm();
  }

  resetBatchForm(): void {
    this.batchForm.reset({
      productId: null,
      companyId: this.companyId,
      batchNo: '',
      lotNo: '',
      manufacturingDate: null,
      expiryDate: null,
      purchasePrice: 0,
      sellingPrice: 0,
      receiveQty: 0,
      availableQty: 0,
      isActive: true
    });

    this.selectedBatchId = null;
    this.isBatchEditMode = false;
  }

  getProductName(productId: number): string {
    const product = this.products.find(x => x.id === productId);
    return product ? product.productName : '';
  }
}
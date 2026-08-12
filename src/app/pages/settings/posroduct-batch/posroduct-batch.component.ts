import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
interface BatchModel {
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
  standalone: false,
  templateUrl: './posroduct-batch.component.html',
  styleUrl: './posroduct-batch.component.css'
})
export class PosroductBatchComponent {
private fb = inject(FormBuilder);

  batchForm!: FormGroup;
  isEditMode = false;
  searchQuery = '';

  isProductModalOpen = false;
  newProductName = '';

  isCompanyModalOpen = false;
  newCompanyName = '';

  products = [
    { productId: 101, productName: 'Cotton Yarn 30/1' },
    { productId: 102, productName: 'Dyeing Chemical (Blue)' }
  ];

  companies = [
    { companyId: 1, companyName: 'Square Textiles Ltd.' },
    { companyId: 2, companyName: 'Beximco Synthetics' }
  ];

  batches: BatchModel[] = [
    {
      productId: 101,
      companyId: 1,
      batchNo: 'BAT-2026-01',
      lotNo: 'LOT-998',
      manufacturingDate: '2026-01-10T00:00:00.000Z',
      expiryDate: '2028-01-10T00:00:00.000Z',
      purchasePrice: 15.00,
      sellingPrice: 22.00,
      receiveQty: 500,
      availableQty: 320,
      isActive: true
    }
  ];

  filteredBatches: BatchModel[] = [];

  ngOnInit(): void {
    this.initForm();
    this.filteredBatches = [...this.batches];
  }

  initForm(): void {
    this.batchForm = this.fb.group({
      productId: [null, [Validators.required]],
      companyId: [null, [Validators.required]],
      batchNo: [`BAT-${Date.now().toString().slice(-4)}`, [Validators.required]],
      lotNo: [`LOT-${Date.now().toString().slice(-4)}`, [Validators.required]],
      manufacturingDate: [new Date(), [Validators.required]],
      expiryDate: [null, [Validators.required]],
      purchasePrice: [0, [Validators.required, Validators.min(0)]],
      sellingPrice: [0, [Validators.required, Validators.min(0)]],
      receiveQty: [0, [Validators.required, Validators.min(1)]],
      availableQty: [{ value: 0, disabled: true }],
      isActive: [true]
    });
  }

  syncAvailableQty(): void {
    if (!this.isEditMode) {
      const rec = this.batchForm.get('receiveQty')?.value || 0;
      this.batchForm.get('availableQty')?.setValue(rec);
    }
  }

  getProductName(id: number): string {
    return this.products.find(p => p.productId === id)?.productName || 'N/A';
  }

  getCompanyName(id: number): string {
    return this.companies.find(c => c.companyId === id)?.companyName || 'N/A';
  }

  openProductModal(): void { this.isProductModalOpen = true; }
  saveNewProduct(): void {
    if (this.newProductName.trim()) {
      const id = Date.now();
      this.products.push({ productId: id, productName: this.newProductName });
      this.batchForm.get('productId')?.setValue(id);
      this.newProductName = '';
      this.isProductModalOpen = false;
    }
  }

  openCompanyModal(): void { this.isCompanyModalOpen = true; }
  saveNewCompany(): void {
    if (this.newCompanyName.trim()) {
      const id = Date.now();
      this.companies.push({ companyId: id, companyName: this.newCompanyName });
      this.batchForm.get('companyId')?.setValue(id);
      this.newCompanyName = '';
      this.isCompanyModalOpen = false;
    }
  }

  filterData(): void {
    const q = this.searchQuery.toLowerCase().trim();
    if (!q) {
      this.filteredBatches = [...this.batches];
      return;
    }
    this.filteredBatches = this.batches.filter(b =>
      b.batchNo.toLowerCase().includes(q) ||
      b.lotNo.toLowerCase().includes(q)
    );
  }

  editBatch(batch: BatchModel): void {
    this.isEditMode = true;
    this.batchForm.patchValue({
      ...batch,
      manufacturingDate: new Date(batch.manufacturingDate),
      expiryDate: new Date(batch.expiryDate)
    });
  }

  deleteBatch(batchNo: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete batch ${batchNo}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0B3B60',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, Delete'
    }).then((result) => {
      if (result.isConfirmed) {
        this.batches = this.batches.filter(b => b.batchNo !== batchNo);
        this.filterData();
        Swal.fire('Deleted!', 'Batch record removed successfully.', 'success');
      }
    });
  }

  resetForm(): void {
    this.isEditMode = false;
    this.batchForm.reset();
    this.initForm();
  }

  onSubmit(): void {
    if (this.batchForm.valid) {
      const raw = this.batchForm.getRawValue();
      const payload: BatchModel = {
        ...raw,
        manufacturingDate: new Date(raw.manufacturingDate).toISOString(),
        expiryDate: new Date(raw.expiryDate).toISOString()
      };

      if (this.isEditMode) {
        const idx = this.batches.findIndex(b => b.batchNo === payload.batchNo);
        if (idx !== -1) this.batches[idx] = payload;
        Swal.fire('Updated!', 'Batch updated successfully.', 'success');
      } else {
        this.batches.unshift(payload);
        Swal.fire('Saved!', 'Batch stock added successfully.', 'success');
      }

      console.log('Batch API Payload:', payload);
      this.filterData();
      this.resetForm();
    }
  }
}

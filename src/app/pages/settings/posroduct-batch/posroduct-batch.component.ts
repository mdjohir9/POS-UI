import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface Batch {
  id?: number;
  batchNo: string;
  productName: string;
  quantity: number;
  expiryDate?: Date | null;
  isActive: boolean;
}

@Component({
  selector: 'app-posroduct-batch',
  templateUrl: './posroduct-batch.component.html',
  styleUrls: ['./posroduct-batch.component.css']
})
export class PosroductBatchComponent implements OnInit {
  batchForm!: FormGroup;
  editingId: number | null = null;

  // Sample Data List
  batchList: Batch[] = [
    { id: 1, batchNo: 'BATCH-2026-01', productName: 'Wireless Mouse', quantity: 150, expiryDate: new Date('2028-12-31'), isActive: true },
    { id: 2, batchNo: 'BATCH-2026-02', productName: 'Cotton T-Shirt', quantity: 300, expiryDate: null, isActive: true }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.batchForm = this.fb.group({
      batchNo: ['', [Validators.required]],
      productName: ['', [Validators.required]],
      quantity: [null, [Validators.required]],
      expiryDate: [null],
      isActive: [true]
    });
  }

  onSubmit(): void {
    if (this.batchForm.valid) {
      if (this.editingId !== null) {
        const index = this.batchList.findIndex(b => b.id === this.editingId);
        if (index !== -1) {
          this.batchList[index] = {
            id: this.editingId,
            ...this.batchForm.value
          };
        }
        this.editingId = null;
      } else {
        const newBatch: Batch = {
          id: this.batchList.length + 1,
          ...this.batchForm.value
        };
        this.batchList = [...this.batchList, newBatch];
      }
      this.resetForm();
    } else {
      Object.values(this.batchForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  editBatch(batch: Batch): void {
    if (batch.id) {
      this.editingId = batch.id;
      this.batchForm.patchValue({
        batchNo: batch.batchNo,
        productName: batch.productName,
        quantity: batch.quantity,
        expiryDate: batch.expiryDate,
        isActive: batch.isActive
      });
    }
  }

  deleteBatch(id?: number): void {
    if (id) {
      this.batchList = this.batchList.filter(b => b.id !== id);
    }
  }

  resetForm(): void {
    this.batchForm.reset({
      batchNo: '',
      productName: '',
      quantity: null,
      expiryDate: null,
      isActive: true
    });
    this.editingId = null;
  }
}
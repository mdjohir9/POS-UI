import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { commonTaskService } from 'src/app/core/services/commonTaskService';
import { ProductService } from 'src/app/core/services/product.service';
interface Supplier {
  supplierId: number;
  supplierName: string;
}

interface Product {
  id: number;
  productName: string;
  purchasePrice: number;
  salesPrice: number;
  vatPercent: number;
  isBatchRequired: boolean;
  barcode: string;
}
@Component({
  selector: 'app-product-purchase',
  standalone: false,
  templateUrl: './product-purchase.component.html',
  styleUrl: './product-purchase.component.css'
})
export class ProductPurchaseComponent {
private fb = inject(FormBuilder);
constructor(
  private commonTask: commonTaskService,
  private productService : ProductService,
  private message: NzMessageService
) {}

  purchaseForm!: FormGroup;
  isModalVisible = false;
  newSupplierName = '';

  suppliers: Supplier[] = []; 

  products: Product[] = [];
  customers: any;
  paymentMethods: any;
  salesForm: any;
  subTotal: any;

  ngOnInit(): void {
    this.initForm();
    this.addItem(); // Add initial row
    this.getSuppliers(); // Fetch suppliers from API
    this.getProducts();
  }

  initForm(): void {
    this.purchaseForm = this.fb.group({
      purchaseNo: [`PO-${Date.now().toString().slice(-5)}`, [Validators.required]],
      purchaseDate: [new Date(), [Validators.required]],
      supplierId: [null, [Validators.required]],
      details: this.fb.array([])
    });
  }

  getProducts(): void {
  this.productService.getProducts().subscribe({
    next: (response) => {
      if (response.statusCode === 200) {
        this.products = response.data;
      } else {
        this.products = [];
        this.message.error(
          response.message || 'Product not found.'
        );
      }
    },
    error: (error) => {
      console.error('Product API Error:', error);
      this.products = [];
      this.message.error('Failed to load products.');
    }
  });
}
getSuppliers(): void {
  this.commonTask.getSuppliers().subscribe({
    next: (response) => {
      if (response.statusCode === 200) {
        this.suppliers = response.data;
      } else {
        this.suppliers = [];
        this.message.error(
          response.message || 'Supplier not found.'
        );
      }
    },
    error: (error) => {
      console.error('Supplier API Error:', error);
      this.suppliers = [];
      this.message.error('Failed to load suppliers.');
    }
  });
}
  get details(): FormArray {
    return this.purchaseForm.get('details') as FormArray;
  }

  createItemRow(): FormGroup {
    return this.fb.group({
      productId: [null, [Validators.required]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      rate: [0, [Validators.required, Validators.min(0)]],
      amount: [{ value: 0, disabled: true }]
    });
  }

  addItem(): void {
    this.details.push(this.createItemRow());
  }

  removeItem(index: number): void {
    if (this.details.length > 1) {
      this.details.removeAt(index);
    }
  }

onProductSelect(productId: number, index: number): void {

  const selectedProduct = this.products.find(
    p => p.id === productId
  );

  if (!selectedProduct) {
    return;
  }

  const row = this.details.at(index);

  row.patchValue({
    rate: selectedProduct.purchasePrice
  });

  this.calculateRowAmount(index);
}


  calculateRowAmount(index: number): void {
    const row = this.details.at(index);
    const qty = row.get('quantity')?.value || 0;
    const rate = row.get('rate')?.value || 0;
    const amount = qty * rate;
    row.get('amount')?.setValue(amount);
  }

  get grandTotal(): number {
    return this.details.controls.reduce((sum, row) => {
      return sum + (row.get('amount')?.value || 0);
    }, 0);
  }

  // Modal Controls for Supplier
  showSupplierModal(): void { this.isModalVisible = true; }
  handleCancel(): void { this.isModalVisible = false; }

  addSupplier(): void {
    if (this.newSupplierName.trim()) {
      const newId = Date.now();
      const newSup = { supplierId: newId, supplierName: this.newSupplierName };
      this.suppliers.push(newSup);
      this.purchaseForm.get('supplierId')?.setValue(newId);
      this.newSupplierName = '';
      this.isModalVisible = false;
    }
  }
//product save and invoice
savedInvoiceData: any = null;

// Helper Methods
getCustomerName(id: number): string {
  return this.customers.find(c => c.customerId === id)?.customerName || 'N/A';
}

getProductName(id: number): string {
  return this.products.find(p => p.id === id)?.productName || 'N/A';
}

getPaymentMethodName(id: number): string {
  return this.paymentMethods.find(m => m.id === id)?.methodName || 'N/A';
}

// Print & Modal Handlers
printInvoice(): void {
  window.print();
}

closeInvoiceModal(): void {
  this.salesForm.reset();
  this.initForm(); // Form reset and re-initialize
}

onSubmit(): void {

  if (this.purchaseForm.invalid) {

    Object.values(this.purchaseForm.controls)
      .forEach(control => {
        control.markAsDirty();
        control.updateValueAndValidity();
      });

    return;
  }

  const rawValue = this.purchaseForm.getRawValue();

  const payload = {
    purchaseNo: rawValue.purchaseNo,

    purchaseDate:
      new Date(rawValue.purchaseDate).toISOString(),

    supplierId: rawValue.supplierId,

    details: rawValue.details.map((item: any) => ({
      productId: item.productId,
      quantity: Number(item.quantity),
      rate: Number(item.rate),
      amount: Number(item.quantity) * Number(item.rate)
    }))
  };

  console.log('Purchase Payload:', payload);

  this.productService.savePurchase(payload).subscribe({
    next: (response) => {

      if (response.statusCode === 200) {

        this.message.success(
          response.message || 'Purchase saved successfully.'
        );

        console.log(
          'Purchase Saved:',
          response.data
        );

        this.resetPurchaseForm();

      } else {

        this.message.error(
          response.message || 'Failed to save purchase.'
        );
      }
    },

    error: (error) => {

      console.error(
        'Purchase Save Error:',
        error
      );

      this.message.error(
        'Failed to save purchase.'
      );
    }
  });
}

resetPurchaseForm(): void {

  this.purchaseForm.reset();
  this.purchaseForm.patchValue({
    purchaseNo:
      `PO-${Date.now().toString().slice(-5)}`,

    purchaseDate: new Date(),

    supplierId: null
  });

  this.details.clear();

  this.addItem();
}
}

import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
interface Supplier {
  supplierId: number;
  supplierName: string;
}

interface Product {
  productId: number;
  productName: string;
  defaultRate: number;
}
@Component({
  selector: 'app-product-purchase',
  standalone: false,
  templateUrl: './product-purchase.component.html',
  styleUrl: './product-purchase.component.css'
})
export class ProductPurchaseComponent {
private fb = inject(FormBuilder);

  purchaseForm!: FormGroup;
  isModalVisible = false;
  newSupplierName = '';

  suppliers: Supplier[] = [
    { supplierId: 101, supplierName: 'Acme Trading Co.' },
    { supplierId: 102, supplierName: 'Global Garments Ltd.' }
  ];

  products: Product[] = [
    { productId: 501, productName: 'Cotton Yarn 30/1', defaultRate: 15.50 },
    { productId: 502, productName: 'Dyeing Chemical - Blue', defaultRate: 45.00 },
    { productId: 503, productName: 'Knit Fabric Roll', defaultRate: 120.00 }
  ];
  customers: any;
  paymentMethods: any;
  salesForm: any;
  subTotal: any;

  ngOnInit(): void {
    this.initForm();
    this.addItem(); // Add initial row
  }

  initForm(): void {
    this.purchaseForm = this.fb.group({
      purchaseNo: [`PO-${Date.now().toString().slice(-5)}`, [Validators.required]],
      purchaseDate: [new Date(), [Validators.required]],
      supplierId: [null, [Validators.required]],
      details: this.fb.array([])
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
    const selectedProd = this.products.find(p => p.productId === productId);
    if (selectedProd) {
      const row = this.details.at(index);
      row.patchValue({ rate: selectedProd.defaultRate });
      this.calculateRowAmount(index);
    }
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
isInvoiceModalVisible = true;
savedInvoiceData: any = null;

// Helper Methods
getCustomerName(id: number): string {
  return this.customers.find(c => c.customerId === id)?.customerName || 'N/A';
}

getProductName(id: number): string {
  return this.products.find(p => p.productId === id)?.productName || 'N/A';
}

getPaymentMethodName(id: number): string {
  return this.paymentMethods.find(m => m.methodId === id)?.methodName || 'N/A';
}

// Print & Modal Handlers
printInvoice(): void {
  window.print();
}

closeInvoiceModal(): void {
  this.isInvoiceModalVisible = false;
  this.salesForm.reset();
  this.initForm(); // Form reset and re-initialize
}

onSubmit(): void {
  if (this.salesForm.valid) {
    const rawValue = this.salesForm.getRawValue();
    
    const payload = {
      invoiceNo: rawValue.invoiceNo,
      salesDate: new Date(rawValue.salesDate).toISOString(),
      customerId: rawValue.customerId,
      discountAmount: rawValue.discountAmount || 0,
      details: rawValue.details.map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity,
        rate: item.rate,
        amount: item.quantity * item.rate
      })),
      payments: rawValue.payments.map((pay: any) => ({
        paymentMethodId: pay.paymentMethodId,
        amount: pay.amount
      }))
    };

    console.log('Saved Sales API Payload:', payload);

    // Save complete information for printing
    this.savedInvoiceData = {
      ...payload,
      subTotal: this.subTotal,
      grandTotal: this.grandTotal
    };

    // Open Print Preview Modal
    this.isInvoiceModalVisible = true;
  }
}
}

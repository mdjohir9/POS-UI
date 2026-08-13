import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-product-sales',
  standalone: false,
  templateUrl: './product-sales.component.html',
  styleUrl: './product-sales.component.css'
})
export class ProductSalesComponent {
private fb = inject(FormBuilder);
  private message = inject(NzMessageService); 
  @ViewChild('barcodeInput') barcodeInputRef!: ElementRef; 

  barcodeControl = new FormControl('');
  
  salesForm!: FormGroup;
  isModalVisible = false;
  newCustomerName = '';

  subTotal = 0;
  totalPaid = 0;
  grandTotal = 0;

  customers = [
    { customerId: 201, customerName: 'Rahim Apparel Ltd.' },
    { customerId: 202, customerName: 'Fashion Warehouse' }
  ];

  products = [
      { productId: 501, productName: 'Cotton Fabric Roll', barcode: 'bar-1001', defaultRate: 200.00 },
      { productId: 502, productName: 'Sewing Thread Box', barcode: 'bar-1002', defaultRate: 35.00 }
    ];
    
  paymentMethods = [
    { methodId: 1, methodName: 'Cash' },
    { methodId: 2, methodName: 'Bank Transfer' },
    { methodId: 3, methodName: 'Mobile Banking (BKash/Nagad)' }
  ];

  ngOnInit(): void {
    this.initForm();
    this.addItem();
    this.addPayment();
  }

  initForm(): void {
    this.salesForm = this.fb.group({
      invoiceNo: [`INV-${Date.now().toString().slice(-5)}`, [Validators.required]],
      salesDate: [new Date(), [Validators.required]],
      customerId: [null, [Validators.required]],
      discountAmount: [0, [Validators.min(0)]],
      details: this.fb.array([]),
      payments: this.fb.array([])
    });
  }

  get details(): FormArray {
    return this.salesForm.get('details') as FormArray;
  }

  get payments(): FormArray {
    return this.salesForm.get('payments') as FormArray;
  }

  createItemRow(): FormGroup {
    return this.fb.group({
      productId: [null, [Validators.required]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      rate: [0, [Validators.required, Validators.min(0)]],
      amount: [{ value: 0, disabled: true }]
    });
  }

  createPaymentRow(): FormGroup {
    return this.fb.group({
      paymentMethodId: [null, [Validators.required]],
      amount: [0, [Validators.required, Validators.min(0)]]
    });
  }

  addItem(): void { this.details.push(this.createItemRow()); }
  removeItem(index: number): void {
    if (this.details.length > 1) {
      this.details.removeAt(index);
      this.calculateTotals();
    }
  }

  addPayment(): void { this.payments.push(this.createPaymentRow()); }
  removePayment(index: number): void {
    if (this.payments.length > 1) {
      this.payments.removeAt(index);
      this.calculateTotals();
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
    row.get('amount')?.setValue(qty * rate);
    this.calculateTotals();
  }

  calculateTotals(): void {
    this.subTotal = this.details.controls.reduce((sum, row) => sum + (row.get('amount')?.value || 0), 0);
    const discount = this.salesForm.get('discountAmount')?.value || 0;
    this.grandTotal = Math.max(0, this.subTotal - discount);
    this.totalPaid = this.payments.controls.reduce((sum, row) => sum + (row.get('amount')?.value || 0), 0);
  }

  showCustomerModal(): void { this.isModalVisible = true; }
  handleCancel(): void { this.isModalVisible = false; }

  addCustomer(): void {
    if (this.newCustomerName.trim()) {
      const newId = Date.now();
      this.customers.push({ customerId: newId, customerName: this.newCustomerName });
      this.salesForm.get('customerId')?.setValue(newId);
      this.newCustomerName = '';
      this.isModalVisible = false;
    }
  }
  addProductToDetails(product: any): void {
  const firstRow = this.details.at(0);
  const isFirstRowEmpty = this.details.length === 1 && !firstRow?.get('productId')?.value;

  if (isFirstRowEmpty) {
    firstRow.patchValue({
      productId: product.productId,
      quantity: 1,
      rate: product.defaultRate
    });

    this.calculateRowAmount(0);
  } else {
    const newRow = this.createItemRow();
        newRow.patchValue({
      productId: product.productId,
      quantity: 1,
      rate: product.defaultRate
    });
    this.details.push(newRow);
    this.calculateRowAmount(this.details.length - 1);
  }
}
onBarcodeScan(event: Event): void {
  event.preventDefault();
  const barcode = this.barcodeControl.value?.trim();

  if (!barcode) return;

  const matchedProduct = this.products.find(
    p => p.barcode && p.barcode.toLowerCase() === barcode.toLowerCase()
  );

  if (matchedProduct) {
    const existingRowIndex = this.details.controls.findIndex(
      row => row.get('productId')?.value === matchedProduct.productId
    );

    if (existingRowIndex !== -1) {
      const existingRow = this.details.at(existingRowIndex);
      const currentQty = existingRow.get('quantity')?.value || 0;
      existingRow.get('quantity')?.setValue(currentQty + 1);
      
      this.calculateRowAmount(existingRowIndex);
    } else {
      this.addProductToDetails(matchedProduct);
    }

    this.barcodeControl.setValue('');
    this.focusBarcodeInput();
  } else {
    alert('Product not found!');
    this.barcodeControl.setValue('');
    this.focusBarcodeInput();
  }
}



  focusBarcodeInput(): void {
    setTimeout(() => {
      this.barcodeInputRef?.nativeElement?.focus();
    }, 100);
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

      console.log('Final Payload matching Sales API:', payload);
    }
  }
}

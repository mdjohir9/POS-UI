import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ProductService } from 'src/app/core/services/product.service';
import {CustommerService} from 'src/app/core/services/custommerService';
import { PaymentMethodService } from 'src/app/core/services/paymentMethod.service';
import { SalesService } from 'src/app/core/services/sales.service';
@Component({
  selector: 'app-product-sales',
  standalone: false,
  templateUrl: './product-sales.component.html',
  styleUrl: './product-sales.component.css'
})
export class ProductSalesComponent {
private fb = inject(FormBuilder);
  @ViewChild('barcodeInput') barcodeInputRef!: ElementRef; 
constructor(
  private productService: ProductService,
  private customerService: CustommerService,  
  private paymentMethodService: PaymentMethodService,
  private salesService: SalesService,
  private message: NzMessageService
) {}
  barcodeControl = new FormControl('');
  paymentMethods: any[] = [];
  salesForm!: FormGroup;
  isModalVisible = false;
  newCustomerName = '';

  subTotal = 0;
  totalPaid = 0;
  grandTotal = 0;

  customers = [];

  products = [];
    
  ngOnInit(): void {
    this.initForm();
    this.addItem();
    this.addPayment();
    this.getCustomers();
    this.getPaymentMethods();
  }
  getCustomers(): void {

  this.customerService.getCustomers().subscribe({
    next: (response) => {
      if (response.statusCode === 200) {
        this.customers = response.data;
      } else {
        this.customers = [];
        this.message.error(
          response.message || 'Customer not found.'
        );
      }
    },
    error: (error) => {
      console.error('Customer API Error:', error);
      this.customers = [];
      this.message.error('Failed to load customers.');
    }
  });
}
getPaymentMethods(): void {
  this.paymentMethodService.getPaymentMethods().subscribe({
    next: (response) => {

      if (response.statusCode === 200) {
        this.paymentMethods = response.data;
      } else {
        this.paymentMethods = [];
        this.message.error(
          response.message || 'Payment methods not found.'
        );
      }
    },

    error: (error) => {

      console.error(
        'Payment Method API Error:',
        error
      );

      this.paymentMethods = [];

      this.message.error(
        'Failed to load payment methods.'
      );
    }
  });
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
    productName: [''],
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

  const isFirstRowEmpty =
    this.details.length === 1 &&
    !firstRow?.get('productId')?.value;

  if (isFirstRowEmpty) {

    firstRow.patchValue({
      productId: product.productId,
      productName: product.productName,
      quantity: 1,
      rate: product.defaultRate
    });

    this.calculateRowAmount(0);

  } else {

    const newRow = this.createItemRow();

    newRow.patchValue({
      productId: product.productId,
      productName: product.productName,
      quantity: 1,
      rate: product.defaultRate
    });

    this.details.push(newRow);

    this.calculateRowAmount(
      this.details.length - 1
    );
  }
}
onBarcodeScan(event: Event): void {

  event.preventDefault();
  event.stopPropagation();

  const barcode = this.barcodeControl.value?.trim();

  if (!barcode) {
    return;
  }

  this.productService.getProductByBarcode(barcode).subscribe({
    next: (response) => {

      if (response.statusCode === 200 && response.data) {

        const product = response.data;

        const existingRowIndex =
          this.details.controls.findIndex(
            row => row.get('productId')?.value === product.id
          );

        if (existingRowIndex !== -1) {

          const row = this.details.at(existingRowIndex);

          const currentQty =
            row.get('quantity')?.value || 0;

          row.get('quantity')?.setValue(currentQty + 1);

          this.calculateRowAmount(existingRowIndex);

        } else {

          this.addProductToDetails({
            productId: product.id,
            productName: product.productName,
            barcode: product.barcode,
            defaultRate: product.salesPrice
          });
        }

        this.barcodeControl.setValue('');
        this.focusBarcodeInput();

      } else {

        this.message.error(
          response.message || 'Product not found.'
        );

        this.barcodeControl.setValue('');
        this.focusBarcodeInput();
      }
    },

    error: (error) => {

      console.error('Barcode Product Error:', error);

      this.message.error(
        error?.error?.message || 'Product not found.'
      );

      this.barcodeControl.setValue('');
      this.focusBarcodeInput();
    }
  });
}



  focusBarcodeInput(): void {
    setTimeout(() => {
      this.barcodeInputRef?.nativeElement?.focus();
    }, 100);
  }
isInvoiceModalVisible = false;
savedInvoiceData: any = null;

onSubmit(): void {
  if (this.salesForm.invalid) {
    this.salesForm.markAllAsTouched();
    return;
  }

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

  console.log('Sales API Payload:', payload);

  this.salesService.saveSales(payload).subscribe({
    next: (response: any) => {

      console.log('Sales API Response:', response);

      // Save data for invoice preview
      this.savedInvoiceData = {
        ...payload,

        // If API generates/returns invoice number,
        // use API invoice number here
        invoiceNo: response?.invoiceNo || payload.invoiceNo,

        subTotal: this.subTotal,
        grandTotal: this.grandTotal,

        details: payload.details,
        payments: payload.payments
      };

      // Open invoice preview
      this.isInvoiceModalVisible = true;
    },

    error: (error) => {
      console.error('Sales save failed:', error);

      // Your notification
      // this.message.error('Failed to save sale');
    }
  });
}

openInvoiceModal(): void {
  this.isInvoiceModalVisible = true;
}

closeInvoiceModal(): void {
  this.isInvoiceModalVisible = false;
}
}

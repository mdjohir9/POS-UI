import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { IApiResponse } from 'src/app/core/models/interfaces/IApiResponse';
import { LoanService } from 'src/app/core/services/LoanService';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam, NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { RechargeService } from 'src/app/core/services/recharge.service';
import { ICustomerIDName } from 'src/app/core/models/interfaces/ICustomerIDName';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reachrage',
  standalone: false,

  templateUrl: './reachrage.component.html',
  styleUrl: './reachrage.component.css'
})
export class ReachrageComponent implements OnInit {
  validateForm!: FormGroup;
  paymentMethods: { id: number, name: string }[] = [];
  rechargeAccounts: any[] = [];
  selectRechargeAccount: number = 0;
  fileList: NzUploadFile[] = [];
  allFilesBase64: { name: string; base64: string }[] = [];
  constructor(private fb: FormBuilder, private rechargeService: RechargeService,private loanService: LoanService,  private message: NzMessageService) {}

  ngOnInit(): void {
    // Load payment methods
    this.getCustommer();
    this.getPaymentMethods();

    // Initialize the form group
    this.validateForm = this.fb.group({
      ddlCustommer:[null , [Validators.required]],
      ddlPaymentMethod: [null, [Validators.required]],
      ddlBank: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      transactionId: [null, [Validators.required]],
      transferTime: [null] // optional
    });

    // Subscribe to value changes of the Payment Method dropdown
    this.validateForm.get('ddlPaymentMethod')?.valueChanges.subscribe(
      (paymentMethodId) => {
        this.onPaymentMethodChange(paymentMethodId);
      }
    );


    this.validateForm.get('ddlBank')?.valueChanges.subscribe(
      (paymentMethodId) => {
        this.onBankChange(paymentMethodId);
      }
    );
  }

  // Get the list of payment methods from the service
  getPaymentMethods() {
    this.loanService.getPaymentMethods().subscribe((res) => {
      if (res.statusCode === 200) {
        this.paymentMethods = res.data;
      }
    });
  }
  bankDetails: any = {
    accountName: '',
    accountNumber: ''
  };
  
  onBankChange(paymentMethodId: number): void {
    if (paymentMethodId) {
      this.loanService.getBankAccountNo(paymentMethodId).subscribe(
        (response: any) => {
          if (response.statusCode === 200 && response.data && response.data.isActive) {
            this.bankDetails = {
              accountName: response.data.accountName,
              accountNumber: response.data.accountNumber
            };
          } else {
            console.error('Error fetching recharge accounts:', response.message);
          }
        },
        (error) => {
          console.error('API Error:', error);
        }
      );
    } else {
      this.bankDetails = {
        accountName: '',
        accountNumber: ''
      };
    }
  }
  
  // Handle changes to the Payment Method selection
  onPaymentMethodChange(paymentMethodId: number): void {
    if (paymentMethodId) {
      this.loanService.getRechargeAccountsByPaymentType(paymentMethodId).subscribe(
        (response: any) => {
          if (response.statusCode === 200) {
            const activeAccounts = response.data.filter((acc) => acc.isActive);
            this.rechargeAccounts = [
              { id: null, bankOrWalletName: '---Select---' },
              ...activeAccounts,
            ];
            this.validateForm.get('ddlBank')?.setValue(null); // Reset bank selection
          } else {
            console.error('Error fetching recharge accounts:', response.message);
          }
        },
        (error) => {
          console.error('API Error:', error);
          this.rechargeAccounts = [];
        }
      );
    } else {
      this.rechargeAccounts = [];
    }
  }
  CustomerIdName: { customerID: number, fullName: string }[] = [];

  selectCustomer: number = 0;
  getCustommer() {
    this.loanService.getCustommerIdName().subscribe(
      (response: IApiResponse<ICustomerIDName[]>) => {
        if (response.statusCode === 200) {

          this.CustomerIdName = [{ customerID: null, fullName: '-----Select----' }, ...response.data];
          this.selectCustomer = null;
        } else {
          console.error('Error fetching employees:', response.message);
        }
      },
      error => {
        console.error('API Error:', error);
      }
    );
  }
  
  // Handle form submission
  submitRecharge(): void {
  if (this.validateForm.valid) {
    if (!this.allFilesBase64 || this.allFilesBase64.length === 0) {
      // Show error message
      this.message.error('Recharge statement is required. Please upload the Transction statement');
      return;
    }
    const userId = Number(sessionStorage.getItem('__useId__')); // <-- Get user ID from session

    if (!userId) {
      this.message.error('User session expired. Please log in again.');
      return;
    }
    const formData = this.validateForm.value;
  
      const payload = {
        bankAccountNumber: null,
        amount: formData.amount,
        requestedDate: formData.transferTime 
          ? new Date(formData.transferTime).toISOString()
          : new Date().toISOString(),
        isApproved: false, // Set as needed
        bankTransactCode: formData.transactionId,
        adminRemarks: 'User submitted recharge request.',
        statement: this.allFilesBase64.map(f => f.base64),
        paymentMethodID: formData.ddlPaymentMethod,
        bankId: formData.ddlBank,
        custommerID:formData.ddlCustommer, 
         userId:userId,
      };
  
      console.log('Submitting Payload:', payload);
  
      this.rechargeService.saveRechargeRequest(payload).subscribe({
        next: () => {
         // this.message.success('Recharge request submitted successfully!');
          Swal.fire('Success', 'Recharge request submitted successfully!', 'success');
          this.validateForm.reset();
          this.fileList = [];
          this.allFilesBase64 = [];
        },
        error: (err) => {
          console.error('Error:', err);
          this.message.error('Failed to submit recharge request.');
        }
      }); 
  
    } else {
      this.message.error('Please complete the form before submitting.');
      this.validateForm.markAllAsTouched();
    }
  }
  

  copyAllBankDetails(): void {
    const accountName = this.bankDetails.accountName || '';
    const accountNumber = this.bankDetails.accountNumber || '';
  
    const fullText = `Account Name: ${accountName}\nAccount Number: ${accountNumber}`;
  
    navigator.clipboard.writeText(fullText).then(() => {
      this.message.success('Bank details copied to clipboard!');
    }).catch(() => {
      this.message.error('Failed to copy bank details.');
    });
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    const isAllowedType = ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type);
    const fileSizeMB = file.size / 1024 / 1024;
    const readableSize = `${fileSizeMB.toFixed(2)} MB`;

    if (!isAllowedType) {
      this.message.error(`${file.name} is not a JPG, PNG, or PDF file.`);
      return false;
    }

    if (fileSizeMB >= 2) {
      this.message.error(`${file.name} is too large (${readableSize}). Max allowed is 2 MB.`);
      return false;
    }

    return true; // allow upload
  };

  customUpload = (item: any): void => {
    const file = item.file as File;
    const reader = new FileReader();
  
    // Determine the MIME type based on file extension
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    let mimeType = '';
    
    if (fileExtension === 'jpg' || fileExtension === 'jpeg') {
      mimeType = 'image/jpeg';
    } else if (fileExtension === 'png') {
      mimeType = 'image/png';
    } else if (fileExtension === 'pdf') {
      mimeType = 'application/pdf';
    } else {
      mimeType = 'application/octet-stream'; // Default fallback
    }
  
    reader.onload = () => {
      // Construct the base64 string with the appropriate MIME type
      const base64String = `data:${mimeType};base64,${(reader.result as string).split(',')[1]}`;
  
      this.allFilesBase64.push({
        name: file.name,
        base64: base64String
      });
  
      // Mark as successful upload
      item.onSuccess({}, file);
    };
  
    reader.onerror = () => {
      this.message.error(`${file.name} failed to upload.`);
      item.onError?.(new Error('File read error'), file);
    };
  
    reader.readAsDataURL(file);
  };
  

  handleChange({ file, fileList }: NzUploadChangeParam): void {
    const status = file.status;
    const fileSizeKB = (file.size || 0) / 1024;
    const readableSize = fileSizeKB > 1024
      ? `${(fileSizeKB / 1024).toFixed(2)} MB`
      : `${fileSizeKB.toFixed(2)} KB`;

    this.fileList = fileList.filter(f => !!f.status);

    if (status === 'done') {
      this.message.success(`${file.name} (${readableSize}) uploaded successfully.`);
    } else if (status === 'error') {
      this.message.error(`${file.name} (${readableSize}) upload failed.`);
    }
  }

}
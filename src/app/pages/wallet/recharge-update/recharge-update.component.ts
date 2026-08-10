import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { IApiResponse } from 'src/app/core/models/interfaces/IApiResponse';
import { LoanService } from 'src/app/core/services/LoanService';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam, NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { RechargeService } from 'src/app/core/services/recharge.service';
import { ICustomerIDName } from 'src/app/core/models/interfaces/ICustomerIDName';
import { ActivatedRoute ,Router} from '@angular/router';
import { switchMap, timer } from 'rxjs';

@Component({
  selector: 'app-recharge-update',
  standalone: false,
  templateUrl: './recharge-update.component.html',
  styleUrl: './recharge-update.component.css'
})
export class RechargeUpdateComponent {
validateForm!: FormGroup;
  paymentMethods: { id: number, name: string }[] = [];
  rechargeAccounts: any[] = [];
  selectRechargeAccount: number = 0;
  fileList: NzUploadFile[] = [];
  allFilesBase64: { name: string; base64: string }[] = [];
  isLoading = true;
  showContent = false;
  constructor(private fb: FormBuilder, private rechargeService: RechargeService,private loanService: LoanService,  private message: NzMessageService,private router:Router,private route: ActivatedRoute) {}

  private UpdateId:any;
  ngOnInit(): void {
    // Load payment methods

    this.getCustommer();
    this.getPaymentMethods();



    // Initialize the form group
    this.validateForm = this.fb.group({
      ddlCustommer:[null,  [Validators.required]],
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

   this.route.paramMap.subscribe(params => {
    const rechargeIdParam = params.get('id'); // assuming route is like /loan-plan/:id
    const rechargeId = rechargeIdParam ? +rechargeIdParam : null;
    this.UpdateId = rechargeId;
    if (rechargeId) {
      this.getRechargeRequestById(rechargeId);
    } else {
      console.warn('Invalid or missing plan ID in route.');
    }
  });
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
            this.validateForm.get('ddlBank')?.setValue(null); 
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
          this.showContent = true;
        } else {
          console.error('Error fetching employees:', response.message);
        }
      },
      error => {
        console.error('API Error:', error);
      }
    );
  }
  
  submitRecharge(): void {
  if (this.validateForm.valid) {
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
        statement: null,
        paymentMethodID: formData.ddlPaymentMethod,
        bankId: formData.ddlBank,
        custommerID:formData.ddlCustommer, 
        userId:userId,
      };
  
      console.log('Submitting Payload:', payload);
  
      this.rechargeService.UpdateRechargeRequest(payload,this.UpdateId).subscribe({
        next: () => {
          this.message.success('Recharge request Update successfully!');
          this.validateForm.reset();
          this.fileList = [];
          this.allFilesBase64 = [];
         this.router.navigate(['/wallet/recharge-requests']);
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
  
  
getRechargeRequestById(rechargeId: number): void {
  timer(1000).pipe(
    switchMap(() => this.rechargeService.getRechargeListById(rechargeId))
  ).subscribe(
    (response) => {
      if (response && response.statusCode === 200 && response.data) {
        const RechargeInfo = response.data;
        this.populateRechargeForm(RechargeInfo);
     
      } else {
        console.warn('No loan plan data found for the provided ID.');
      }
    },
    (error) => {
      console.error('Error fetching loan plan:', error);
    }
  );
}
  
populateRechargeForm(data: any): void {
  // Patch everything except ddlBank
  this.validateForm.patchValue({
    ddlCustommer: data.custommerID,
    ddlPaymentMethod: data.paymentMethodID,
    amount: data.amount,
    transactionId: data.bankTransactCode,
    transferTime: data.requestedDate ? this.formatDateForInput(data.requestedDate) : null,
  });

  // Delay setting ddlBank after rechargeAccounts are loaded
  const checkAndSetBank = () => {
    const interval = setInterval(() => {
      const found = this.rechargeAccounts.find(x => x.id === data.bankId);
      if (found) {
        this.validateForm.get('ddlBank')?.setValue(data.bankId);
        this.onBankChange(data.bankId); // optional, if you want bank details to be filled
        clearInterval(interval);
      }
    }, 100); // check every 100ms
  };

  checkAndSetBank();

  if (data.statement) {
    this.fileList = [
      {
        uid: '-1',
        name: data.statement,
        status: 'done',
        url: `/uploaded/documents/${data.statement}`,
      }
    ];
  }
}

formatDateForInput(dateStr: string): string {
  const date = new Date(dateStr);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60000);
  return localDate.toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm
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

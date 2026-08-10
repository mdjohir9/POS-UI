import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NzFormTooltipIcon } from 'ng-zorro-antd/form';
import { IApiResponse } from 'src/app/core/models/interfaces/IApiResponse';
import { SettingsService } from 'src/app/core/services/settingsService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-department',
  templateUrl: './rechargePaymentMeths.component.html',
  styleUrl: './rechargePaymentMeths.component.css'
})
export class RechargePaymentMethsComponent {
 isLoading = true;
  showContent = false;
  allDatas: any[] = []; 
  datas: any[] = [];
  constructor(private fb: UntypedFormBuilder,private http: HttpClient, private settingsService : SettingsService ) {}

  ngOnInit(): void {
    this.getPaymentMethod();
    this.validateForm = this.fb.group({
      txtPayMethodName: [null, [Validators.required]],
      ddlIsActive: [null, [Validators.required]]
    });



  }



  loadData() {
    // Simulate an asynchronous data loading operation
    setTimeout(() => {
      this.isLoading = false;
      this.showContent = true;
    }, 500);
  }




  validateForm!: UntypedFormGroup;
  captchaTooltipIcon: NzFormTooltipIcon= {
    type: 'info-circle',
    theme: 'twotone'
  };


/* submitForm(): void {
  if (this.validateForm.valid) {
    const payload = {
      name: this.validateForm.value.txtPayMethodName,
      isActive: this.validateForm.value.ddlIsActive === '1' ? true : false
    };

    this.settingsService.savePaymentMethod(payload).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Payment Method submitted successfully', response);

        Swal.fire('Success', 'Payment Method  submitted successfully!', 'success');
        this.validateForm.reset();
        this.getPaymentMethod();
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error submitting loan:', error);
  
      }
    });

  }
}
 */
isEditMode: boolean = false;
editId: number | null = null;
submitForm(): void {
  if (this.validateForm.valid) {
    const payload = {
      name: this.validateForm.value.txtPayMethodName,
      isActive: this.validateForm.value.ddlIsActive === '1' ? true : false
    };

    this.isLoading = true;

    const request = this.isEditMode
      ? this.settingsService.updatePaymentMethod(payload ,this.editId!)
      : this.settingsService.savePaymentMethod(payload);

    request.subscribe({
      next: (response) => {
        this.isLoading = false;
        Swal.fire('Success', `Payment Method ${this.isEditMode ? 'updated' : 'created'} successfully!`, 'success');

        this.validateForm.reset();
        this.getPaymentMethod();
        this.isEditMode = false;
        this.editId = null;
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error submitting payment method:', error);
      }
    });
  }
}

editPaymentMethod(id: number): void {
  this.settingsService.getPaymentMethodById(id).subscribe({
    next: (response) => {
      if (response.statusCode === 200 && response.data) {
        const data = response.data;

        this.validateForm.patchValue({
          txtPayMethodName: data.name,
          ddlIsActive: data.isActive ? '1' : '0'
        });

        this.isEditMode = true;
        this.editId = id;
      }
    },
    error: (err) => {
      console.error('Failed to fetch payment method by ID:', err);
    }
  });
}





  getPaymentMethod(): void {
  this.settingsService.getPaymentMethodList().subscribe({
    next: (response) => {
      if (response.statusCode === 200) {
        this.allDatas = response.data;
        this.showContent = true;
      }
    },
    error: (err) => {
      console.error('Failed to load recharge data:', err);
      this.showContent = true;
    }
  });
}

deletePaymentMethod(id: number): void {
  Swal.fire({
    title: 'Are you sure?',
    text: 'This will permanently delete the payment method.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      this.settingsService.DeletePlanByeId(id).subscribe({
        next: (response) => {
          Swal.fire('Deleted!', 'The payment method has been deleted.', 'success');
          this.getPaymentMethod(); // Refresh the list
        },
        error: (error) => {
          console.error('Error deleting payment method:', error);
          Swal.fire('Error', 'Failed to delete payment method.', 'error');
        }
      });
    }
  });
}


}

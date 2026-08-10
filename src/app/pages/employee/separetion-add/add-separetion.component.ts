import { Component, ViewChild } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NzFormTooltipIcon } from 'ng-zorro-antd/form';
import { NzDemoModalBasicComponent } from '../add-employee/basic';

@Component({
  selector: 'app-add-separetion',
  templateUrl: './add-separetion.component.html',
  styleUrl: './add-separetion.component.css'
})
export class AddSeparetionComponent {
  isLoading = true;
  showContent = false;
  constructor(private fb: UntypedFormBuilder) {}

  ngOnInit(): void {
    this.loadData();
    this.validateForm = this.fb.group({
      ddlCompany: new FormControl('', Validators.required),
      ddlEmployee: new FormControl('', Validators.required),
      txtFullName: new FormControl('', Validators.required),
      txtNickName: new FormControl('', Validators.required),
      txtNameBng: new FormControl('', Validators.required),
      ddlDepartment: new FormControl('', Validators.required),
      ddlDesigation: new FormControl('', Validators.required),
      ddlGroup: new FormControl('', Validators.required),
      ddlShift: new FormControl('', Validators.required),
      ddlCardNo: new FormControl('', Validators.required),
      txtAlternetCard: new FormControl('', Validators.required),
      txtRegID: new FormControl('', Validators.required),
      txtProximityNo: new FormControl('', Validators.required),
      ddlEmpStatus: new FormControl('', Validators.required),
      ddlEmpType: new FormControl('', Validators.required),
      txtJoininfDate: new FormControl('', Validators.required),
      txtExpireDate: new FormControl('', Validators.required),
      txtOrdering: new FormControl('', Validators.required),
    });
    

    
  }
  listOfOption = [
    {label: '----Select----', value: ''},
    { label: 'Codeware Ltd', value: 'codeware-ltd' },
    { label: 'Data Soft', value: 'data-soft' }
  ];
  selectedValue = '';
  loadData() {
    // Simulate an asynchronous data loading operation
    setTimeout(() => {
      this.isLoading = false;
      this.showContent = true;
    }, 500);
  }

  OnshowModel(){
    console.log('Show Model Data Success')
  }


  validateForm!: UntypedFormGroup;
  captchaTooltipIcon: NzFormTooltipIcon = {
    type: 'info-circle',
    theme: 'twotone'
  };

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.validateForm.controls.checkPassword.updateValueAndValidity());
  }

  confirmationValidator = (control: UntypedFormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  getCaptcha(e: MouseEvent): void {
    e.preventDefault();
  }


  @ViewChild(NzDemoModalBasicComponent) childComponent!: NzDemoModalBasicComponent;

  onShowModal(): void {
    this.childComponent.showModal();
  }

  showForm = false;

  toggleForm(): void {
    this.showForm = !this.showForm; // Toggle visibility
  }

}

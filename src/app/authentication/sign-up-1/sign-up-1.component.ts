import { Component } from '@angular/core'
import { FormBuilder, FormControl, FormGroup,  Validators } from '@angular/forms';
import  socialIcons  from './../../../assets/data/pages/social-items.json';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { accessControlService } from 'src/app/core/services/accessControlService';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
    templateUrl: './sign-up-1.component.html'
})

export class SignUp1Component {
    socialMediaButtons = socialIcons.socialMediaButtons;
    signUpForm: FormGroup;
    isLoading = false;
    error = false;
    companyId='0001';
    constructor(private fb: FormBuilder,private accessControlService: accessControlService,
        private message: NzMessageService,  private router: Router,  ) {
    }
    passwordVisible = false;
    password?: string;
    ngOnInit(): void {
      this.signUpForm = this.fb.group({
        txtFirstName: [null, [Validators.required]],
        txtLastName: [null, [Validators.required]],
        txUserName: [null, [Validators.required]],
        txtPassword: [null, [Validators.required]],
        txtConfirmPassword: [null, [Validators.required]],
        agree: [false]
      }, {
        validators: this.passwordMatchValidator
      });
    }
    
    submitForm(): void {
        // Mark every form control as dirty to trigger validation messages
        for (const key in this.signUpForm.controls) {
          if (this.signUpForm.controls.hasOwnProperty(key)) {
            this.signUpForm.controls[key].markAsDirty();
            this.signUpForm.controls[key].updateValueAndValidity();
          }
        }
    
        // Check if the form is valid before proceeding
        if (this.signUpForm.valid) {
          const formValues = this.signUpForm.value;
          
          // Build the request payload. Modify or add fields as required.
          const requestData = {
            firstName: formValues.txtFirstName.trim(),
            lastName: formValues.txtLastName.trim(),
            eamilOrPhone: formValues.txUserName.trim(),
            newPassword: formValues.txtPassword.trim(),
            confirmPassword: formValues.txtConfirmPassword.trim(),
      
          };
    
          console.log('User Submit Payload:', requestData);
    
          // Call your service method to save the user
          this.accessControlService.RegistrationUser(requestData).subscribe({
            next: (response) => {
              if (response.statusCode === 200) {
                Swal.fire({
                  icon: 'success',
                  title: 'Success',
                  text: 'User signed up successfully!',
                  confirmButtonText: 'Go to Login'
                }).then(() => {
                  this.signUpForm.reset();
                  this.router.navigate(['/authentication/login']);
                });

              } else {
              
                  Swal.fire({ icon: 'warning',  title: 'Registration Failed',  text: response.message, confirmButtonText: 'Try Again' });
              }
            },
            error: (err) => {
              console.error(err);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while signing up the user.',
                confirmButtonText: 'OK'
              });
            }
          });
        } else {
          this.message.warning('Please fill out all required fields.');
        }
      }

    updateConfirmValidator(): void {
        Promise.resolve().then(() => this.signUpForm.controls.checkPassword.updateValueAndValidity());
    }

  passwordMatchValidator(formGroup: FormGroup) {
  const password = formGroup.get('txtPassword')?.value;
  const confirmPassword = formGroup.get('txtConfirmPassword')?.value;
  if (password !== confirmPassword) {
    formGroup.get('txtConfirmPassword')?.setErrors({ mismatch: true });
  } else {
    formGroup.get('txtConfirmPassword')?.setErrors(null);
  }
  return null;
}


}

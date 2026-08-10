import { Component, ViewChild, ElementRef, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import SignaturePad from 'signature_pad';
import { LoanService } from 'src/app/core/services/LoanService';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-loan-trams-and-condition',
  templateUrl: './loan-trams-and-condition.component.html',
  styleUrl: './loan-trams-and-condition.component.css'
})
export class LoanTramsAndConditionComponent implements AfterViewInit{

@Output() finalSubmit = new EventEmitter<any>();


    private customerId: string | null;
    private UserId: string | null;
@ViewChild('signatureCanvas', { static: true }) signatureCanvas!: ElementRef<HTMLCanvasElement>;
 constructor(private fb: UntypedFormBuilder,private loanService : LoanService) {
      this.customerId = sessionStorage.getItem('__customerID__');
      this.UserId = sessionStorage.getItem('__userId__');

 }

  signaturePad!: SignaturePad;
  agreed: boolean = false;

  ngAfterViewInit(): void {
    this.signaturePad = new SignaturePad(this.signatureCanvas.nativeElement);
  }

  clearSignature() {
    this.signaturePad.clear();
  }

  isSignatureEmpty(): boolean {
    return this.signaturePad.isEmpty();
  }
// In LoanTramsAndConditionComponent


submit(): Observable<any> | null {
  if (!this.agreed || this.signaturePad.isEmpty()) {
    alert("You must agree to the terms and sign before submitting.");
    return null;
  }
      const userId = Number(sessionStorage.getItem('__useId__')); // <-- Get user ID from session
      const customerId = Number(sessionStorage.getItem('__customerID__')); // <-- Get user ID from session

    if (!userId) {
            Swal.fire('warning', 'Please Login agin and try agin!', 'warning');
            return;
    }
  const dataURL = this.signaturePad.toDataURL('image/png');

  const payload = {
    customerId: customerId, 
    userid: userId,
    custommerSignature: [dataURL]
  };

  return this.loanService.saveCustommerSignature(payload);
}



}

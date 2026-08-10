import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustommerService } from 'src/app/core/services/custommerService';
import * as html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-custommer-profile',
  templateUrl: './custommer-profile.component.html',
  styleUrl: './custommer-profile.component.css'
})
export class CustommerProfileComponent {

  isLoading = true;
  showContent = true;
  customerId: string | null = null; 
  constructor(private Custommer: CustommerService,private route: ActivatedRoute) {}
  ngOnInit(): void {
    
   
    this.route.paramMap.subscribe(params => {
      const urlCustomerId = params.get('id'); // Get from URL
  
      if (urlCustomerId) {
        this.customerId = urlCustomerId; // Use URL ID
        this.getPersonnelInfo(this.customerId);
      } else {
        this.customerId = sessionStorage.getItem('__customerID__'); // Use session ID if URL ID is missing
        this.getPersonnelInfo(this.customerId);
      }
  
      console.log("Current Customer ID:", this.customerId);
    });
  }
  customerData: any = null;

  getPersonnelInfo(customerId: any): void {
    this.Custommer.getCustommerInfo(customerId).subscribe(
      (customerList) => {
        if (customerList && customerList.length > 0) {
          this.customerData = customerList[0]; 
       
        }
      },
      (error) => {
        console.error('Error fetching contact info', error);
      }
    );
  }


  
  downloadPDF() {
    const element = document.getElementById('cv-content');
    const img = document.getElementById('profile-photo') as HTMLImageElement;
  
    if (img && !img.complete) {
      // Wait until image loads
      img.onload = () => {
        this.generatePDF(element!);
      };
    } else {
      this.generatePDF(element!);
    }
  }
  
  generatePDF(element: HTMLElement) {
    html2pdf().from(element).set({
      margin: 0.5,
      filename: `${this.customerData.fullName}_Profile.pdf`,
      html2canvas: {
        scale: 2,
        useCORS: true, // Important for image loading!
      },
      jsPDF: {
        unit: 'in',
        format: 'a4',
        orientation: 'portrait',
      },
    }).save();
  }
}

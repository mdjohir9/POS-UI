export interface ILoanInstalmentDetails  {

  applicationID : number;               // Unique identifier for the customer
  custCardNo: string;     
  customerID : number;          
  loanNumber : string;      
  fullName: string;                 // Full name of the customer
  custommerImage: string | null;    // Image URL or path of the customer's image (can be null)
  gender: string;                   // Gender of the customer (e.g., "Female", "Male")
  loanAmount: number;               // Amount of the loan applied for
  dueAmount: number;               // Amount of the loan applied for
  paidAmount: number;               // Amount of the loan applied for
  totalPayableAmount: number;               // Amount of the loan applied for
  repaymentPeriod: number;          // Repayment period in months (e.g., 12 months)
  monthlyInstallments: number;      // Amount to be paid per month
  applicationDate: string;          // Date and time when the loan application was submitted
  purposeOfLoan: string;  
  lateCharge:number;          // Purpose for the loan (e.g., "personnel")
  status: number;     
  payMethodID : number;              // Status of the loan (e.g., 1 for "Approved", 0 for "Pending")
  paymentMethodName: string;   
  planID : number;
  planName: string;   
}
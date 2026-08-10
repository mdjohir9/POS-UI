export interface ICustommer {
    data: ICustommer;
    customerID: number;
    userId:number;
    custCardNo: string;
    companyId: number;
    custommerImage: string | null;
    custommerSignature: string | null;
    fullName: string;
    gender: string;
    dateOfBirth: string;
    nationality: string;
    maritalStatus: string;
    educationLevel: string | null;
    occupation: string;
    nationalIDOrPassport: string;
    taxIdentificationNumber: string;
    drivingLicenseNumber: string;
    isActive: boolean;
    createdAt: string;
    createdBy: number;
    updatedAt: string | null;
    updatedBy: number | null;
    deletedAt: string | null;
    deletedBy: number | null;
    isDeleted: boolean | null;
    custommerContact: any | null; // Define proper type if available
    custommerEmployment: any | null; // Define proper type if available
    custommerFinancialInfo: any | null; // Define proper type if available
    custommerGuarantorDetails: any | null; // Define proper type if available
}

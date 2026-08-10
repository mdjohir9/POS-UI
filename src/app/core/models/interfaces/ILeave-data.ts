export interface ILeaveData {
    id: number;
    applicationId: string;
    leaveTypeId: number;
    isHalfDayLeave: boolean;
    applyDate: string;
    leaveStartDate: string;
    leaveEndDate: string;
    totalLeaveDays: number;
    pregnantDate: string | null;
    expectedDeliveryDate: string | null;
    remarks: string;
    handedOverEmpId: string;
    lvAddress: string;
    lvContact: string;
    approvalStatus: number;
    leaveProcessingOrder: number;
    companyId: string;
    empTypeId: number;
    sftId: number;
    dptId: string;
    dsgId: string;
    gId: number;
    empId: string;
    empName: string;
    empPicture: string;
    dsgName: string;
    leaveName: string;
    handedOverEmpName: string | null;
    dataAccessPermission: any; // Adjust type if known
    dataAccessLevel: any;
}

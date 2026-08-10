export interface ILeaveApprove {
    id: number;
    applicationId: string;
    leaveStartDate: string;
    empName: string;
    dsgName: string;
    empPicture: string;
    leaveName: string;
    leaveEndDate: string;
    totalLeaveDays: number;
    leaveTypeId: number;
    approvalStatus: number | null;
    leaveProcessingOrder: number;
    empId: string;
    authorityAction: number;
    notificationId: number;
    approvalStatusDescription: string | null;
    authorityPosition: string | null;
  }
  
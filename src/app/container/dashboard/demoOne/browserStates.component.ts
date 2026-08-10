import { Component  } from '@angular/core';
import tableData  from '../../../../assets/data/pages/table-data.json';
import { FormGroup } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { WithdrawService } from 'src/app/core/services/withdraw.service';

@Component({
  selector: 'nz-browserStates',
  template: `
  <style>
    .text-Reject {
    --tw-text-opacity: 1 !important;
    color: rgb(255 15 15 / 1  ) !important;
    background-color: rgba(255, 15, 15, 0.1) !important;
}


.text-Approve {
    --tw-text-opacity: 1 !important;
    color: rgb(1 184 26 / 1 ) !important;
    background-color: rgba(1, 184, 26, 0.1) !important;
}



.text-Processing {
    --tw-text-opacity: 1 !important;
    color: rgb(126, 23, 185) !important;
    background-color: rgba(250, 139, 12, 0.1) !important;
}



.text-Pending {
    --tw-text-opacity: 1 !important;
    color: rgb(19, 143, 201) !important;
    background-color: rgba(12, 135, 250, 0.1) !important;

}


    </style>


    <div class="bg-white dark:bg-white/10 m-0 p-0 text-theme-gray dark:text-white/60 text-[15px] rounded-10 relative ">
  <div
    class="px-[25px] text-dark dark:text-white/[.87] font-medium text-[17px] flex flex-wrap items-center justify-between max-sm:flex-col max-sm:h-auto max-sm:mb-[15px]">
    <h1
      class="mb-0 inline-flex items-center py-[16px] max-sm:pb-[5px] overflow-hidden whitespace-nowrap text-ellipsis text-[18px] font-semibold text-dark dark:text-white/[.87]">
      Withdraw Requests</h1>

  </div>
  <div class="px-[25px] pt-0 pb-[25px]">
    <div>
      <div class="overflow-x-auto w-full">
      <nz-table
                #rechargeTable
                [nzData]="datas"
                nzShowPagination
                nzShowSizeChanger
                [nzLoading]="!showContent"
              >
                <thead>
                  <tr>
                    <th class="bg-regularBG px-[20px] py-[16px] text-start text-dark text-[15px] font-medium border-none before:hidden rounded-s-[10px] capitalize">SL</th>
                    <th class="bg-regularBG px-[20px] py-[16px] text-start text-dark text-[15px] font-medium border-none before:hidden capitalize">Name</th>
                    <th class="bg-regularBG px-[20px] py-[16px] text-start text-dark text-[15px] font-medium border-none before:hidden capitalize">Amount</th>
                    <th class="bg-regularBG px-[20px] py-[16px] text-start text-dark text-[15px] font-medium border-none before:hidden capitalize">Account No</th>
                    <th class="bg-regularBG px-[20px] py-[16px] text-start text-dark text-[15px] font-medium border-none before:hidden capitalize">Request Date</th>
                    <th class="bg-regularBG px-[20px] py-[16px] text-start text-dark text-[15px] font-medium border-none before:hidden capitalize">Status</th>

                  </tr>
                </thead>
                <tbody>
                  <tr class="group" *ngFor="let data of rechargeTable.data; let i = index;">
                    <td class="px-[20px] py-4 text-dark text-[15px]">{{ i + 1 }}</td>
                    <td class="px-[20px] py-4 text-dark text-[15px]">
                      <div class="flex items-center space-x-2">
                        <img [src]="data.custommerImage" class="w-10 h-10 rounded-full" alt="Customer Picture">
                        <div>
                          <span class="block font-medium">{{ data.fullName }}</span>
                          <span class="text-gray-500 text-sm">{{ data.custCardNo }}</span>
                        </div>
                      </div>
                    </td>
                    <td class="px-[20px] py-4 text-dark text-[15px]">{{ data.amount }}</td>
                    <td class="px-[20px] py-4 text-dark text-[15px]">{{ data.accountNumber }}</td>
                    <td class="px-[20px] py-4 text-dark text-[15px]">{{ data.requestedDate | date }}</td>
                    <td class="px-[20px] py-4 text-dark text-[15px]">
                      <span
                        class="inline-flex items-center justify-center min-h-[24px] px-3 text-xs font-medium rounded-[15px] capitalize"
                        [ngClass]="{
                          'text-Pending': data.isApproved === null,
                          'text-Approve': data.isApproved === true,
                          'text-Reject': data.isApproved === false
                        }"
                      >
                        {{ data.isApproved === null ? 'Pending' : data.isApproved ? 'Approved' : 'Rejected' }}
                      </span>
                    </td>

                  </tr>
                </tbody>
              </nz-table>
      </div>
    </div>
  </div>
</div>

  `
})

export class BrowserStatesComponent  {
  //Table Data
isLoading = true;
  showContent = false;
  value = '';
  statusFilter = 'All'; 
  searchAny = '';
  dataType: string = 'allDatas';
  dataAccessLevel: string | null = null;

  allDatas: any[] = []; // Store original data
  //datas: ILoanApplication[] = []; // Store filtered data
  datas: any[] = [];

   withdrawForm!: FormGroup;

  constructor( private modal: NzModalService,  private withdrawService: WithdrawService) {}



  ngOnInit(): void {
    // this.loadData();
    this.dataAccessLevel = sessionStorage.getItem('__DataAccessLevel__');
    this.getWithdrawRequests();
  }

  getWithdrawRequests(): void {
    this.withdrawService.getWithdrawList().subscribe({
      next: (response) => {
        if (response.statusCode === 200) {
          this.datas = response.data;
          this.showContent = true;
        }
      },
      error: (err) => {
        console.error('Failed to load recharge data:', err);
        this.showContent = true;
      }
    });
  }
  

}

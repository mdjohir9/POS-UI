import { Component, OnInit } from '@angular/core';
import tableData  from '../../../../assets/data/pages/table-data.json';
import { NzTableModule } from 'ng-zorro-antd/table';
import { LeaveService } from 'src/app/core/services/leave.service';

interface ItemData {
  sl: string;
  id:number;
  name: string;
  department: string;
  designation :string;
  companyAddress: string;
  companyName: string;
  gender: string;
}

@Component({
  selector: 'leave-balance',
  standalone: false,
  template: `
<style>
  .text-end {
     text-align: center !important; 
}
  </style>
<div class="bg-white dark:bg-white/10 m-0 p-0 text-theme-gray dark:text-white/60 text-[15px] rounded-10 relative ">
  <div
    class="px-[25px] text-dark dark:text-white/[.87] font-medium text-[17px] flex flex-wrap items-center justify-between max-sm:flex-col max-sm:h-auto max-sm:mb-[15px]">
    <h1
      class="mb-0 inline-flex items-center py-[16px] max-sm:pb-[5px] overflow-hidden whitespace-nowrap text-ellipsis text-[18px] font-semibold text-dark dark:text-white/[.87]">
    Transction History</h1>
    <div class="py-[16px] flex items-center gap-[15px]">
    </div>
  </div>
  <div class="px-[25px] pt-0 pb-[25px]">
    <div>
      <div class="overflow-x-auto w-full">
      <nz-table [nzFrontPagination]="false" [nzShowPagination]="false" class="text-sm rounded-[5px]" nzBordered>
    <thead>
        <!-- First Row: Main Headers -->
        <tr class="border border-gray-300 dark:border-gray-600">
            <th class="bg-[#fafafa] dark:bg-[#323440] px-4 py-2.5 text-start text-light dark:text-white/[.87] text-[12px] font-medium border border-gray-300 dark:border-gray-600 before:hidden rounded-s-[4px]" rowspan="2">SL</th>
            <th class="bg-[#fafafa] dark:bg-[#323440] px-4 py-2.5 text-light dark:text-white/[.87] text-[12px] font-medium border border-gray-300 dark:border-gray-600 before:hidden" rowspan="2">ID</th>
            <th class="bg-[#fafafa] dark:bg-[#323440] px-4 py-2.5 text-light dark:text-white/[.87] text-[12px] font-medium border border-gray-300 dark:border-gray-600 before:hidden" rowspan="2">Name</th>
            <th class="bg-[#fafafa] dark:bg-[#323440] px-4 py-2.5 text-light dark:text-white/[.87] text-[12px] font-medium border border-gray-300 dark:border-gray-600 before:hidden" rowspan="2">Designation</th>
            <th class="bg-[#fafafa] dark:bg-[#323440] px-4 py-2.5 text-end text-light dark:text-white/[.87] text-[12px] font-medium border border-gray-300 dark:border-gray-600 before:hidden rounded-e-[4px]" rowspan="2">Department</th> 
            <th class="bg-[#fafafa] dark:bg-[#323440] px-4 py-2.5 text-end text-light dark:text-white/[.87] text-[12px] font-medium border border-gray-300 dark:border-gray-600 before:hidden rounded-e-[4px]" colspan="4" style="text-align: center;">Balance</th> 
            <th class="bg-[#fafafa] dark:bg-[#323440] px-4 py-2.5 text-end text-light dark:text-white/[.87] text-[12px] font-medium border border-gray-300 dark:border-gray-600 before:hidden rounded-e-[4px]" colspan="1" style="text-align: center;">Deducted</th> 
            <th class="bg-[#fafafa] dark:bg-[#323440] px-4 py-2.5 text-end text-light dark:text-white/[.87] text-[12px] font-medium border border-gray-300 dark:border-gray-600 before:hidden rounded-e-[4px]" colspan="4" style="text-align: center;">Availed</th> 
            <th class="bg-[#fafafa] dark:bg-[#323440] px-4 py-2.5 text-end text-light dark:text-white/[.87] text-[12px] font-medium border border-gray-300 dark:border-gray-600 before:hidden rounded-e-[4px]" colspan="4" style="text-align: center;">Remaining</th> 
        </tr>

        <!-- Second Row: Sub-Headers -->
        <tr class="border border-gray-300 dark:border-gray-600">
            <th class="bg-[#fafafa] dark:bg-[#323440] px-4 py-2.5 text-end text-light dark:text-white/[.87] text-[12px] font-medium border border-gray-300 dark:border-gray-600 before:hidden rounded-e-[4px]">CL</th> 
            <th class="bg-[#fafafa] dark:bg-[#323440] px-4 py-2.5 text-end text-light dark:text-white/[.87] text-[12px] font-medium border border-gray-300 dark:border-gray-600 before:hidden rounded-e-[4px]">SL</th> 
            <th class="bg-[#fafafa] dark:bg-[#323440] px-4 py-2.5 text-end text-light dark:text-white/[.87] text-[12px] font-medium border border-gray-300 dark:border-gray-600 before:hidden rounded-e-[4px]">EL</th> 
            <th class="bg-[#fafafa] dark:bg-[#323440] px-4 py-2.5 text-end text-light dark:text-white/[.87] text-[12px] font-medium border border-gray-300 dark:border-gray-600 before:hidden rounded-e-[4px]">ML</th> 
            <th class="bg-[#fafafa] dark:bg-[#323440] px-4 py-2.5 text-end text-light dark:text-white/[.87] text-[12px] font-medium border border-gray-300 dark:border-gray-600 before:hidden rounded-e-[4px]">CL</th> 
            <th class="bg-[#fafafa] dark:bg-[#323440] px-4 py-2.5 text-end text-light dark:text-white/[.87] text-[12px] font-medium border border-gray-300 dark:border-gray-600 before:hidden rounded-e-[4px]">CL</th> 
            <th class="bg-[#fafafa] dark:bg-[#323440] px-4 py-2.5 text-end text-light dark:text-white/[.87] text-[12px] font-medium border border-gray-300 dark:border-gray-600 before:hidden rounded-e-[4px]">SL</th> 
            <th class="bg-[#fafafa] dark:bg-[#323440] px-4 py-2.5 text-end text-light dark:text-white/[.87] text-[12px] font-medium border border-gray-300 dark:border-gray-600 before:hidden rounded-e-[4px]">EL</th> 
            <th class="bg-[#fafafa] dark:bg-[#323440] px-4 py-2.5 text-end text-light dark:text-white/[.87] text-[12px] font-medium border border-gray-300 dark:border-gray-600 before:hidden rounded-e-[4px]">ML</th> 
            <th class="bg-[#fafafa] dark:bg-[#323440] px-4 py-2.5 text-end text-light dark:text-white/[.87] text-[12px] font-medium border border-gray-300 dark:border-gray-600 before:hidden rounded-e-[4px]">CL</th> 
            <th class="bg-[#fafafa] dark:bg-[#323440] px-4 py-2.5 text-end text-light dark:text-white/[.87] text-[12px] font-medium border border-gray-300 dark:border-gray-600 before:hidden rounded-e-[4px]">SL</th> 
            <th class="bg-[#fafafa] dark:bg-[#323440] px-4 py-2.5 text-end text-light dark:text-white/[.87] text-[12px] font-medium border border-gray-300 dark:border-gray-600 before:hidden rounded-e-[4px]">EL</th> 
            <th class="bg-[#fafafa] dark:bg-[#323440] px-4 py-2.5 text-end text-light dark:text-white/[.87] text-[12px] font-medium border border-gray-300 dark:border-gray-600 before:hidden rounded-e-[4px]">ML</th> 
        </tr>
    </thead>
    <tbody>
        <tr *ngFor="let data of listOfData">
            <td>{{ data.sl }}</td>
            <td>{{ data.id }}</td>
            <td>{{ data.name }}</td>
            <td>{{ data.designation }}</td>
            <td>{{ data.department }}</td>
            <td>{{ data.balance.cl }}</td>
            <td>{{ data.balance.sl }}</td>
            <td>{{ data.balance.el }}</td>
            <td>{{ data.balance.ml }}</td>
            <td>{{ data.deducted.cl }}</td>
            <td>{{ data.availed.cl }}</td>
            <td>{{ data.availed.sl }}</td>
            <td>{{ data.availed.el }}</td>
            <td>{{ data.availed.ml }}</td>
            <td>{{ data.remaining.cl }}</td>
            <td>{{ data.remaining.sl }}</td>
            <td>{{ data.remaining.el }}</td>
            <td>{{ data.remaining.ml }}</td>
        </tr>
    </tbody>
</nz-table>


      </div>
    </div>
  </div>
</div>

  `
})
export class LeaveBalanceComponent  {
  seller: any;
 
  listOfData = [
    {
      sl: 1,
      id: 'EMP001',
      name: 'John Doe',
      designation: 'Software Engineer',
      department: 'IT',
      balance: { cl: 5, sl: 2, el: 7, ml: 3 },
      deducted: { cl: 1 },
      availed: { cl: 2, sl: 1, el: 3, ml: 1 },
      remaining: { cl: 3, sl: 1, el: 4, ml: 2 }
    },
    {
      sl: 2,
      id: 'EMP002',
      name: 'Jane Smith',
      designation: 'HR Manager',
      department: 'HR',
      balance: { cl: 6, sl: 3, el: 5, ml: 2 },
      deducted: { cl: 0 },
      availed: { cl: 1, sl: 1, el: 2, ml: 0 },
      remaining: { cl: 5, sl: 2, el: 3, ml: 2 }
    }
  ];

  isLoading = true;
  showContent = false;
  value = '';
  statusFilter = 'All'; 
  searchAny = '';
  dataType: string = 'allLeaves';
 
/*   allLeaves: ILeaveData[] = []; // Store original data
  leaves: ILeaveData[] = []; // Store filtered data

   listOfCurrentPageData: readonly ILeaveData[] = [];

  constructor(private leaveService: LeaveService) {
    this.getLeaveBalance();
  } */

/*   getLeaveBalance() {
    setTimeout(()=>{ 
      this.isLoading = true;
      this.leaveService.getLeavesApiCall().subscribe(
        (response: IApiResponse<ILeaveData[]>) => {
          this.isLoading = false;
    
          if (response.statusCode === 200) {
            this.allLeaves = response.data; // Store all data
            this.showContent = true;
          } else {
            console.error('Error fetching leaves:', response.message);
          }
        },
        error => {
          this.isLoading = false;
          console.error('API Error:', error);
        }
      );})
   
  } */

}

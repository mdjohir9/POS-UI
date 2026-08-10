import { Component,OnInit,ViewChild } from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  ApexPlotOptions,
  ApexLegend,
  ApexTooltip,
  ApexStates,
  ApexOptions
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis:ApexYAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  plotOptions: ApexPlotOptions;
  legend: ApexLegend;
  tooltip: ApexTooltip;
  states: ApexStates;
};

import items from '../../../../assets/data/global/dropdown.json';
import { DashboardService } from 'src/app/core/services/dashboardService';
@Component({
  selector: 'nz-saleReport',
  template: `
    <div class="bg-white dark:bg-white/10 m-0 p-0 text-theme-gray dark:text-white/60 text-[15px] rounded-10 relative h-full">
  <div
    class="px-[25px] text-dark dark:text-white/[.87] font-medium text-[17px] flex flex-wrap items-center justify-between max-sm:flex-col max-sm:h-auto max-sm:mb-[15px]">
    <h1
      class="mb-0 inline-flex items-center py-[16px] max-sm:pb-[5px] overflow-hidden whitespace-nowrap text-ellipsis text-[18px] font-semibold text-dark dark:text-white/[.87]">
      Disbursed and Recovered Summary </h1>
      <div class="py-[16px]">
        <a nz-dropdown nzTrigger="click" [nzDropdownMenu]="menu">
          <svg-icon class=" text-light dark:text-white/60 dark:group-hover:text-white/[.87] w-[24px] h-[24px] [&>svg]:w-[24px] [&>svg]:h-[24px]" src="assets/images/svg/feather/more-horizontal.svg"></svg-icon>
        </a>
        <nz-dropdown-menu #menu="nzDropdownMenu">
          <ul class="block bg-white dark:bg-[#1b1e2b] shadow-regular dark:shadow-[0_5px_30px_rgba(1,4,19,.60)] rounded-4 capitalize" nzSelectable>
<!--             <li *ngFor="let items of appItems" class="flex items-center text-theme-gray dark:text-white/60 hover:bg-primary/10 hover:text-primary dark:hover:bg-white/10 px-3 py-1.5 text-sm dark:hover:text-white/[.87]">
              <svg-icon class="text-current w-3.5 h-3.5 me-2 [&>svg]:w-full [&>svg]:h-full" src="assets/images/svg/feather/{{items.icon}}.svg"></svg-icon>
              {{items.name}}
            </li> -->
          </ul>
        </nz-dropdown-menu>
      </div>
  </div>
  <div class="p-[25px] pt-0">
    <div class="flex items-center justify-center max-ssm:flex-col max-ssm:gap-y-[15px]">
      <div class="relative flex items-center mx-3">
          <span class="flex items-center ps-3 text-sm text-body dark:text-white/60 before:absolute before:bg-primary before:w-2 before:h-2 before:rounded-full ltr:before:left-0 rtl:before:right-0 before:top-1/2 before:-translate-y-2/4">Recovered</span>
          <span class="inline-block text-dark dark:text-white/[.87] me-1 ms-2.5 text-22 font-semibold">{{repaymentAmount}}</span>
          <span class="flex items-center text-sm text-success font-medium">
          <svg-icon class="w-[20px] h-[20px] [&>svg]:w-full [&>svg]:h-full" src="assets/images/svg/unicons-line/arrow-down.svg"></svg-icon>
           </span>
      </div>
      <div class="relative flex items-center mx-3">
          <span class="flex items-center ps-3 text-sm text-body dark:text-white/60 before:absolute before:bg-info before:w-2 before:h-2 before:rounded-full ltr:before:left-0 rtl:before:right-0 before:top-1/2 before:-translate-y-2/4">Disbursed</span>
          <span class="inline-block text-dark dark:text-white/[.87] me-1 ms-2.5 text-22 font-semibold">{{disbursementAmount}}</span>
          <span class="flex items-center text-sm text-danger font-medium">
          <svg-icon class="w-[20px] h-[20px] [&>svg]:w-full [&>svg]:h-full" src="assets/images/svg/unicons-line/arrow-up.svg"></svg-icon> </span>
      </div>
  </div>
    <div class="hexadash-chart-container" dir="ltr">
    <apx-chart
          #chart
          [series]="chartOptions.series"
          [chart]="chartOptions.chart"
          [xaxis]="chartOptions.xaxis"
          [yaxis]="chartOptions.yaxis"
          [dataLabels]="chartOptions.dataLabels"
          [grid]="chartOptions.grid"
          [stroke]="chartOptions.stroke"
          [title]="chartOptions.title"
          [plotOptions]="chartOptions.plotOptions"
          [legend]="chartOptions.legend"
          [tooltip]="chartOptions.tooltip"
          [states]="chartOptions.states"
        ></apx-chart>
    </div>
  </div>
</div>
  `,
  styles: [`
    :host ::ng-deep .apexcharts-text.apexcharts-yaxis-label {
      @apply dark:fill-white/[.60] #{!important};
    }
  `]
})
export class SaleReportComponent implements OnInit {
  blanceAmount: any = null;
  monthlyDisbursementData: number[] = [];
  monthlyRepaymentData: number[] = [];

  chartOptions: Partial<ApexOptions> = {};

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    const today = new Date();
    const currentYear = today.getFullYear().toString(); // "2025"

    this.getdisbursedAndRecoveredSummary(currentYear);

    // Initialize chart options without series
    this.chartOptions = {
      series: [],
      chart: {
        width: '100%',
        height: 245,
        type: 'line',
        toolbar: {
          show: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        curve: 'smooth',
        lineCap: 'butt',
        width: 3
      },
      grid: {
        borderColor: '#485e9029',
        strokeDashArray: 5,
        padding: {
          top: 0,
          right: 0,
          bottom: 0
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '60%',
          borderRadius: 2
        }
      },
      legend: {
        show: false
      },
      tooltip: {
        enabled: true,
        shared: true,
        intersect: false,
        style: {
          fontSize: '12px',
          fontFamily: '"Jost", sans-serif'
        }
      },
      xaxis: {
        crosshairs: {
          show: false
        },
        labels: {
          style: {
            colors: Array.from({ length: 12 }, () => '#747474'),
            fontSize: '14px',
            fontFamily: '"Jost", sans-serif',
            fontWeight: 400
          }
        },
        categories: [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ],
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      yaxis: {
        labels: {
          offsetX: -15,
          formatter: (val) => `${val}$`,
          style: {
            colors: ['#747474'],
            fontSize: '14px',
            fontFamily: '"Jost", sans-serif',
            fontWeight: 400
          }
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      }
    };
  }


    repaymentAmount: number;
    disbursementAmount: number;

  getdisbursedAndRecoveredSummary(year: string | null): void {
    if (!year) return;

    this.dashboardService.getRecoverdAndDisbursedSummary(year).subscribe({
      next: (response) => {
        if (response.statusCode === 200 && response.data) {
          this.blanceAmount = response.data;
          this.repaymentAmount=this.blanceAmount.repaymentAmount,
          this.disbursementAmount=this.blanceAmount.disbursementAmount,
          this.monthlyDisbursementData = response.data.monthlyDisbursementAmounts || [];
          this.monthlyRepaymentData = response.data.monthlyRepaymentAmounts || [];

          // Set series now that data is available
          this.chartOptions.series = [
            {
              name: 'Total Recovered ',
              data: this.monthlyRepaymentData,
              color: '#7811FF'
            },
            {
              name: 'Total Disbursed',
              data: this.monthlyDisbursementData,
              color: '#00AAFF'
            }
          ];
        }
      },
      error: (error) => {
        console.error('Error fetching balance details:', error);
      }
    });
  }
  
}

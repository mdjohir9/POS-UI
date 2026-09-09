import { Component,ViewChild, Input, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/core/services/dashboardService';
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
  ApexStates
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


@Component({
  selector: 'nz-saleGrowth',
  template: `
    <div class="bg-white dark:bg-white/10 m-0 p-0 text-theme-gray dark:text-white/60 text-[15px] rounded-10 relative ">
  <div
    class="px-[25px] text-dark dark:text-white/[.87] font-medium text-[17px] flex flex-wrap items-center justify-between max-sm:flex-col max-sm:h-auto max-sm:mb-[15px]">
    <h1
      class="mb-0 inline-flex items-center py-[16px] max-sm:pb-[5px] overflow-hidden whitespace-nowrap text-ellipsis text-[18px] font-semibold text-dark dark:text-white/[.87]">
      Stock In/Out Summary</h1>
  </div>
  <div class="p-[25px] pt-0">
    <div class="flex items-center justify-center max-ssm:flex-col max-ssm:gap-y-[15px]">
      <div class="relative flex items-center mx-3">
        <span
          class="inline-block text-dark dark:text-white/[.87] me-1 ms-2.5 text-[18px] font-semibold"><span>{{ stockInTotal | number }}</span></span>
        <span class="flex items-center text-sm font-medium text-success">
            <svg-icon class="w-[20px] h-[20px] [&>svg]:w-full [&>svg]:h-full" src="assets/images/svg/unicons-line/arrow-up.svg"></svg-icon>
          25% </span>
      </div>
      <div class="relative flex items-center mx-3">
        <span
          class="inline-block text-dark dark:text-white/[.87] me-1 ms-2.5 text-[18px] font-semibold"><span>{{ stockOutTotal | number }}</span></span>
        <span class="flex items-center text-sm font-medium text-danger">
            <svg-icon class="w-[20px] h-[20px] [&>svg]:w-full [&>svg]:h-full" src="assets/images/svg/unicons-line/arrow-down.svg"></svg-icon>
            15% </span>
      </div>
    </div>
    <div *ngIf="sellingTab === 'today'">
      <div class="hexadash-chart-container" dir="ltr">
        <apx-chart
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
</div>
  `,
  styles: [`
    :host ::ng-deep .apexcharts-text.apexcharts-yaxis-label {
      @apply dark:fill-white/[.60] #{!important};
    }
  `]
})

export class SaleGrowthComponent implements OnInit {

  @Input() componentId!: string;

  sellingTab: string = 'today';
  filterDate: string = '';

  public stockInTotal: number = 0;
  public stockOutTotal: number = 0;

  public chartOptions: Partial<ChartOptions>;
  weeklyStockIn: number[] = [];
  weeklyStockOut: number[] = [];
  constructor(private dashboardService: DashboardService) {
    this.chartOptions = {
      series: [
        {
          name: 'Stock In',
          data: this.weeklyStockIn,
          color: '#7811FF'
        },
        {
          name: 'Stock Out',
          data: this.weeklyStockOut,
          color: '#00AAFF'
        }
      ],

      chart: {
        height: 311,
        type: 'bar',
        parentHeightOffset: 0,
        toolbar: {
          show: false
        }
      },

      dataLabels: {
        enabled: false
      },

      stroke: {
        show: true,
        width: 30,
        colors: ['transparent']
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
        x: {
          show: true,
          format: 'dd MMM'
        },
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
            colors: Array.from({ length: 7 }, () => '#747474'),
            fontSize: '14px',
            fontFamily: '"Jost", sans-serif',
            fontWeight: 400,
            cssClass: 'apexcharts-yaxis-label'
          }
        },

        categories: [
          'Sat',
          'Sun',
          'Mon',
          'Tue',
          'Wed',
          'Thu',
          'Fri'
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

          formatter: (val) => {
            return val.toString();
          },

          style: {
            colors: ['#747474'],
            fontSize: '14px',
            fontFamily: '"Jost", sans-serif',
            fontWeight: 400,
            cssClass: 'apexcharts-yaxis-label'
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

  ngOnInit(): void {
    const storageKey = `sellingTab_${this.componentId}`;
    const storedTab = localStorage.getItem(storageKey);

    if (storedTab) {
      this.sellingTab = storedTab;
    }

    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    this.filterDate = `${year}-${month}-${day}`;

    this.getStockInOutSummary(this.filterDate);
  }

  handleClick(tab: string): void {
    this.sellingTab = tab;

    const storageKey = `sellingTab_${this.componentId}`;
    localStorage.setItem(storageKey, tab);
  }

getStockInOutSummary(selectedDate: string | null): void {
  if (!selectedDate) return;

  this.dashboardService.getStockInOutSummary(selectedDate).subscribe({
    next: (response) => {
      this.stockInTotal = response.stockInTotal || 0;
      this.stockOutTotal = response.stockOutTotal || 0;

      this.weeklyStockIn = response.stockInData || [];
      this.weeklyStockOut = response.stockOutData || [];

      this.chartOptions = {
        ...this.chartOptions,
        series: [
          {
            name: 'Stock In',
            data: this.weeklyStockIn,
            color: '#7811FF'
          },
          {
            name: 'Stock Out',
            data: this.weeklyStockOut,
            color: '#00AAFF'
          }
        ],
        xaxis: {
          ...this.chartOptions.xaxis,
          categories: response.labels || []
        }
      };
    },
    error: (error) => {
      console.error('Error fetching stock in/out summary:', error);
      this.stockInTotal = 0;
      this.stockOutTotal = 0;
      this.weeklyStockIn = [];
      this.weeklyStockOut = [];
    }
  });
}
}


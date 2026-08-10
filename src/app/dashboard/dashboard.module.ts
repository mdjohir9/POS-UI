import { BlogCardsComponent } from './../container/dashboard/demoFive/blog-card';
import { TimeLineComponent } from './../container/dashboard/demoFive/timeline';
import { KnowledgeBaseComponent } from './../container/dashboard/demoFive/knowledge-base.component';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { SharedModule } from '../shared/shared.module';
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common'; // Import DatePipe
import { DecimalPipe } from '@angular/common';

import { ThemeConstantService } from '../shared/services/theme-constant.service';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageModule } from 'ng-zorro-antd/message';

import { AngularSvgIconModule } from 'angular-svg-icon';
import { BaseChartDirective } from 'ng2-charts';
import { NgApexchartsModule } from "ng-apexcharts";
import { PerfectScrollbarModule } from 'ngx-om-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-om-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-om-perfect-scrollbar';
import { FullCalendarModule } from '@fullcalendar/angular';

import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { OverviewComponent } from '../container/dashboard/demoOne/overview.component';
import { SaleReportComponent } from '../container/dashboard/demoOne/salesReport.component';
import { SaleGrowthComponent } from '../container/dashboard/demoOne/salesGrowth.component';
import { TopSellingComponent } from '../container/dashboard/demoOne/topSelling.component';
import { BrowserStatesComponent } from '../container/dashboard/demoOne/browserStates.component';

import { UserStatusComponent } from '../container/dashboard/demoTwo/user-status';
import { AttendanceStatusComponent } from '../container/dashboard/demoTwo/attendance-status.component';
import { SaleLocationComponent } from '../container/dashboard/demoOne/salesLocation.component';
import { MoneyEarningComponent } from '../container/dashboard/demoThree/moneyEarning.component';
import { ProfitGrowthComponent } from '../container/dashboard/demoThree/profitGrowth.component';
import { OverviewListVerticalComponent } from '../container/dashboard/demoThree/overviewListVertical.component';
import { SalesOverviewComponent } from '../container/dashboard/demoThree/salesOverview.component';
import { TopProductComponent } from '../container/dashboard/demoThree/topProduct.component';
import { RecentDealsComponent } from '../container/dashboard/demoThree/recentDeals.component';
import { ActiveUserComponent } from '../container/dashboard/demoThree/activeUser.component';

import { DanialComponent } from '../container/dashboard/demoFour/danial.component';
import { PerformanceComponent } from '../container/dashboard/demoFour/performanceOverview.component';
import { NewsComponent } from '../container/dashboard/demoFour/news.component';
import { TaskListComponent } from '../container/dashboard/demoFour/tasklist.component';
import { MarketingCampaignsComponent } from '../container/dashboard/demoFour/marketingCampaigns.component';
import { ProfileCardComponent } from '../container/dashboard/demoFour/profileCard.component';
import { TeamListComponent } from '../container/dashboard/demoFour/teamMember.component';
import { socialMediaTrafficComponent } from '../container/dashboard/demoFour/socialMediaTraffic.component';
import { userChatComponent } from '../container/dashboard/demoFour/userChat.component';
import { DanialFullComponent } from '../container/dashboard/demoFive/danial.component';
import { UserOverviewComponent } from '../container/dashboard/demoFive/userOverview.component';
import { AppCalendarComponent } from '../container/dashboard/demoFive/calendar-mini';
import { MemberProgress } from '../container/dashboard/demoFive/member-progress';
import { UpcomingEvent } from '../container/dashboard/demoFive/upcoming-event';
import { EditModalComponent } from '../container/dashboard/demoFive/EditModalComponent';
import { MiniInboxComponent } from '../container/dashboard/demoFive/min-inbox';
import { OverviewSixComponent } from '../container/dashboard/demoSix/overviewSix.component';
import { SaleGrowthStatusComponent } from '../container/dashboard/demoSix/salesGrowthStatus.component';
import { SaleOverviewComponent } from '../container/dashboard/demoSix/salesOverview';
import { OverviewSevenComponent } from '../container/dashboard/demoSeven/overview.component';
import { SourceRevenueTable } from '../container/dashboard/demoSeven/source-revenue';
import { DanialFullComponent2 } from '../container/dashboard/demoTen/danial.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { LeaveBalanceComponent } from '../container/dashboard/demoTwo/leaveBalance.component';
 //import { AllLoanInstalmentComponent } from '../pages/loans/all-loan-instalment/all-loan-instalment.component';

 import { UpcomingInstalmentComponent } from './admin-dashboard/upcoming-instalment/upcoming-instalment.component';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

const antdModule = [

    NzLayoutModule,
    NzButtonModule,
    NzCardModule,
    NzAvatarModule,
    NzRateModule,
    NzBadgeModule,
    NzProgressModule,
    NzRadioModule,
    NzTableModule,
    NzDropDownModule,
    NzTimelineModule,
    NzTabsModule,
    NzTagModule,
    NzListModule,
    NzCalendarModule,
    NzToolTipModule,
    NzCheckboxModule,
    NzBreadCrumbModule,
    NzGridModule,
    NzSkeletonModule,
    NzSpaceModule,
    NzFormModule,
    FormsModule,
    NzSelectModule,
    NzDatePickerModule,
    NzModalModule,
    NzInputModule,
    AngularSvgIconModule.forRoot(),
    BaseChartDirective,
    NgApexchartsModule,
    PerfectScrollbarModule,
    FullCalendarModule,
    NzMessageModule,
    NzGridModule
]

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        DashboardRoutingModule,
        ...antdModule
    ],
    exports: [
      SaleLocationComponent,
      AttendanceStatusComponent,
      TopSellingComponent,
      BrowserStatesComponent,
      SaleReportComponent,
      SaleGrowthComponent,
      LeaveBalanceComponent,
      UpcomingInstalmentComponent 
    ],
    declarations: [
        AdminDashboardComponent,
        UserDashboardComponent,
        OverviewComponent,
        SaleReportComponent,
        SaleGrowthComponent,
        SaleLocationComponent,
        TopSellingComponent,
        BrowserStatesComponent,
        UserStatusComponent,
        AttendanceStatusComponent,
        MoneyEarningComponent,
        ProfitGrowthComponent,
        OverviewListVerticalComponent,
        SalesOverviewComponent,
        TopProductComponent,
        RecentDealsComponent,
        ActiveUserComponent,
        DanialComponent,
        PerformanceComponent,
        NewsComponent,
        TaskListComponent,
        MarketingCampaignsComponent,
        ProfileCardComponent,
        TeamListComponent,
        socialMediaTrafficComponent,
        userChatComponent,
        DanialFullComponent,
        DanialFullComponent2,
        UserOverviewComponent,
        AppCalendarComponent,
        MemberProgress,
        UpcomingEvent,
        EditModalComponent,
        KnowledgeBaseComponent,
        TimeLineComponent,
        MiniInboxComponent,
        BlogCardsComponent,
        OverviewSixComponent,
        SaleGrowthStatusComponent,
        SaleOverviewComponent,
        OverviewSevenComponent,
        SourceRevenueTable,
        LeaveBalanceComponent,
        UpcomingInstalmentComponent 

    ],
    providers: [
        ThemeConstantService,
        DatePipe,
        DecimalPipe,
        {
          provide: PERFECT_SCROLLBAR_CONFIG,
          useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        }
    ],
})

export class DashboardModule {

 }

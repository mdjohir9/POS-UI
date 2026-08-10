import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { DatePipe } from '@angular/common';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { ReachrageComponent } from './reachrage/reachrage.component';
import { WalletRoutingModule } from './walletRoutingModule';
import { RechargeRequestsComponent } from './recharge-requests/recharge-requests.component';
import { RequestsByeCustomerIdComponent } from './requests-ByeCustomer/requests-by-customer.component';
import { WithdrawComponent } from './withdraw/withdraw.component';
import { WithdrawRequestsComponent } from './withdraw-requests/withdraw-requests.component';
import { WithdrawByeCustomerIdComponent } from './withdraw-ByeCustomer/withdraw-by-customer.component';
import { RechargeUpdateComponent } from './recharge-update/recharge-update.component';
import { WithdrawUpdateComponent } from './withdraw-update/withdraw-update.component';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
const antdModule = [
    NzCardModule,
    NzSkeletonModule,
    NzAvatarModule,
    NzPaginationModule,
    NzDividerModule,
    NzButtonModule,
    NzListModule,
    NzTableModule,
    NzRadioModule,
    NzRateModule,
    NzTabsModule,
    NzTagModule,
    NzFormModule,
    NzDatePickerModule,
    NzSelectModule,
    NzSwitchModule,
    NzUploadModule,
    NzToolTipModule,
    NzModalModule,
    NzMessageModule,
    NzInputModule,
    NzBadgeModule,
    NzCollapseModule,
    NzBreadCrumbModule,
    AngularSvgIconModule,
    ReactiveFormsModule,
    NzMenuModule,
    NzIconModule,
    NzDropDownModule,
]

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        WalletRoutingModule,
        

        ...antdModule
    ],
    declarations: [
        ReachrageComponent,
        RechargeRequestsComponent,
        RequestsByeCustomerIdComponent,
        WithdrawComponent,
        WithdrawRequestsComponent,
        WithdrawByeCustomerIdComponent,
        RechargeUpdateComponent,
        WithdrawUpdateComponent,
    ],
    providers: [
      DatePipe
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class WalletModule {}

import { CustommerContactComponent } from './Add-custommer/Custommer-Contact';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { DashboardModule } from 'src/app/dashboard/dashboard.module';

import { AppModule } from 'src/app/app.module';

import { AngularSvgIconModule } from 'angular-svg-icon';
import { BaseChartDirective } from 'ng2-charts';
import { NgApexchartsModule } from "ng-apexcharts";
import { EditorModule } from '@tinymce/tinymce-angular';
import { GoogleMapsModule } from '@angular/google-maps';

import { CustommerRoutingModule } from './Custommer-routing.module';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzStepsModule } from 'ng-zorro-antd/steps';


import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

import { CustommerAddComponent } from './Add-custommer/Custommer-Add.component';

import { PersonnelInfoComponent } from './Add-custommer/Personnel-info';
import { CustommerEmploymentComponent } from './Add-custommer/Custommer-Employment';
import { CustommerFinancialInfoComponent } from './Add-custommer/Custommer-FinancialInfo';
import { ThemeConstantService } from 'src/app/shared/services/theme-constant.service';
import { GoogleMapsService } from 'src/app/shared/services/google-map-service';
import { CustommerGuarantorComponent } from './Add-custommer/Custommer-Guarantor';
import { CustommerListComponent } from './custommer-list/custommer-list.component';
import { UpdatePersonnelInfoComponent } from './update-custommer/Update-Personnel-info';
import { UpdateCustommerContactComponent } from './update-custommer/Update-Custommer-Contact';
import { UpdateCustommerFinancialInfoComponent } from './update-custommer/update-Custommer-FinancialInfo';
import { UpdateCustommerEmploymentComponent } from './update-custommer/Update-Custommer-Employment';
import { CustommerUpdateComponent } from './update-custommer/Custommer-Update.component';
import { CustommerProfileComponent } from './custommer-profile/custommer-profile.component';

const antdModule = [
  NzDropDownModule,
  AngularSvgIconModule.forRoot(),
  BaseChartDirective,
  NgApexchartsModule,
  NzLayoutModule,
  NzGridModule,
  NzSkeletonModule,
  CustommerRoutingModule,
  FormsModule,
  ReactiveFormsModule,
  NzInputModule,
  NzFormModule,
  NzInputNumberModule,
  NzDatePickerModule,
  NzTimePickerModule,
  NzSelectModule,
  NzUploadModule,
  NzCheckboxModule,
  NzRadioModule,
  NzTagModule,
  NzSwitchModule,
  NzSliderModule,
  NzTableModule,
  EditorModule,
  DashboardModule,

  NzProgressModule,
  NzAvatarModule,
  NzToolTipModule,
  NzStepsModule,
  GoogleMapsModule

]
@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        NzCardModule,
        HttpClientModule,
        ...antdModule
    ],
    declarations: [
       
        CustommerAddComponent,
        PersonnelInfoComponent,
        CustommerEmploymentComponent,
        CustommerContactComponent,
        CustommerFinancialInfoComponent,
        CustommerGuarantorComponent,
        CustommerListComponent,
        UpdatePersonnelInfoComponent,
        UpdateCustommerContactComponent,
        UpdateCustommerFinancialInfoComponent,
        UpdateCustommerEmploymentComponent,
        CustommerUpdateComponent,
        CustommerProfileComponent,

    ],
    providers: [
        ThemeConstantService,
        NzMessageService,
        GoogleMapsService
    ]
})

export class CustommerModule {}

import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ChartsModule } from 'ng2-charts';
import { FileUploadModule } from 'ng2-file-upload';
import { ProgressbarModule, TabsModule, TooltipModule } from 'ngx-bootstrap';
import { ToasterModule, ToasterService } from 'angular2-toaster';
import { NvD3Module } from 'ng2-nvd3';
import {
  ButtonModule,
  CalendarModule,
  ContextMenuModule,
  DialogModule,
  ToggleButtonModule,
  SharedModule,
  DropdownModule,
  MultiSelectModule,
  AutoCompleteModule,
  InputTextModule
} from 'primeng/primeng';
import { TableModule } from 'primeng/table';

import {
  AppDeviceChartComponent,
  AppFileUploadComponent,
  AppLoadingComponent,
  AppNoDataComponent,
  AppWidgetLoadingComponent,
  DeviceNotificationsComponent
} from './components';
import { AuthenticationService, FileUploadService, FeatureTogglesService } from './services';
import { FocusElementDirective, ElasticDirective } from './directives';

const SHARED_COMPONENTS = [
  AppDeviceChartComponent,
  AppFileUploadComponent,
  AppLoadingComponent,
  AppNoDataComponent,
  AppWidgetLoadingComponent,
  DeviceNotificationsComponent,
  ElasticDirective,
  FocusElementDirective
];

const PRIMENG_MODULES = [
  ButtonModule,
  CalendarModule,
  ContextMenuModule,
  DialogModule,
  DropdownModule,
  ToggleButtonModule,
  SharedModule,
  DropdownModule,
  MultiSelectModule,
  CalendarModule,
  AutoCompleteModule,
  TableModule,
  InputTextModule
];

@NgModule({
  imports: [
    ChartsModule,
    CommonModule,
    FormsModule,
    NvD3Module,
    FileUploadModule,
    ReactiveFormsModule,
    ...PRIMENG_MODULES,
    ProgressbarModule.forRoot(),
    TabsModule.forRoot(),
    TooltipModule.forRoot()
  ],
  declarations: [
    ...SHARED_COMPONENTS
  ],
  providers: [
    AuthenticationService,
    FileUploadService,
    FeatureTogglesService,
    DatePipe
  ],
  exports: [
    ChartsModule,
    CommonModule,
    ElasticDirective,
    FileUploadModule,
    FocusElementDirective,
    FormsModule,
    ReactiveFormsModule,
    ...PRIMENG_MODULES,
    ProgressbarModule,
    ...SHARED_COMPONENTS,
    TabsModule,
    TooltipModule
  ]
})
export class GlobalModule {
}

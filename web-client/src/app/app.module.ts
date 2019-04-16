import { APP_INITIALIZER, NgModule, ErrorHandler } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import '../rxjs-imports';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';

import {
  AppAsideComponent,
  AppBreadcrumbsComponent,
  AppFooterComponent,
  AppHeaderComponent,
  AppSidebarComponent,
  AppSidebarFooterComponent,
  AppSidebarFormComponent,
  AppSidebarHeaderComponent,
  AppSidebarMinimizerComponent,
  AppReloginComponent,
  APP_SIDEBAR_NAV
} from './components';

import { FullLayoutComponent } from './containers';
import { GlobalErrorHandler } from './error-handler';

import {
  AsideToggleDirective,
  NAV_DROPDOWN_DIRECTIVES,
  ReplaceDirective,
  SIDEBAR_TOGGLE_DIRECTIVES
} from './directives';

const APP_CONTAINERS = [FullLayoutComponent];
const APP_DIRECTIVES = [
  AsideToggleDirective,
  NAV_DROPDOWN_DIRECTIVES,
  ReplaceDirective,
  SIDEBAR_TOGGLE_DIRECTIVES
];
const APP_COMPONENTS = [
  AppAsideComponent,
  AppBreadcrumbsComponent,
  AppFooterComponent,
  AppHeaderComponent,
  AppReloginComponent,
  AppSidebarComponent,
  AppSidebarFooterComponent,
  AppSidebarFormComponent,
  AppSidebarHeaderComponent,
  AppSidebarMinimizerComponent,
  APP_SIDEBAR_NAV
];

import { AppComponent } from './app.component';
import { AppConfig } from './models';
import { AppRoutingModule } from './app.routing';
import { AuthGuard } from './guards/auth.guard';
import { ConfigService, ConfigServiceFactory, JwtOptionsFactory, StateService, ApiErrorService, ReleaseNotesService } from './services';
import { GlobalModule } from './global.module';
import { ToasterModule, ToasterService } from 'angular2-toaster';
import { Tooltip } from 'primeng/primeng';

const APP_SERVICES = [
  ConfigService,
  StateService,
  ApiErrorService
];

@NgModule({
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    GlobalModule,
    HttpClientModule,
    ToasterModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: JwtOptionsFactory,
        deps: [StateService]
      }
    })
  ],
  declarations: [
    AppComponent,
    ...APP_COMPONENTS,
    ...APP_CONTAINERS,
    ...APP_DIRECTIVES
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    {
      provide: APP_INITIALIZER,
      useFactory: ConfigServiceFactory,
      deps: [ConfigService],
      multi: true
    },
    {provide: ErrorHandler, useClass: GlobalErrorHandler},
    AppConfig,
    AuthGuard,
    ToasterService,
    ReleaseNotesService,
    ...APP_SERVICES
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {

}

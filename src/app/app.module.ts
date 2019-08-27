import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { SideNavOuterToolbarModule, SideNavInnerToolbarModule, SingleCardModule } from './layouts';
import { FooterModule, LoginFormModule } from './shared/components';
import { AuthService, ScreenService, AppInfoService } from './shared/services';
import { AppRoutingModule } from './app-routing.module';
import { TenderDetailsComponent } from './pages/tenderdetails/tenderdetails.component';
import { DisplayDataComponent } from './pages/display-data/display-data.component';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import {
  DxDataGridModule,
  DxFormModule,
  DxSelectBoxModule,
  DxCheckBoxModule,
  DxTabsModule,
  DxButtonModule,
  DxLoadPanelModule,
  DxFileUploaderModule, DxListModule
} from 'devextreme-angular';
import { Service } from './pages/home/app.service';
import { RestService } from './services/rest.service';
import { CasesComponent } from './pages/cases/cases.component';
import { PlangraphicComponent } from './pages/plangraphic/plangraphic.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { CasedetailsComponent } from './pages/casedetails/casedetails.component';
import { CaseDescriptionComponent } from './pages/casedetails/case.description/case.description.component';
import {CaseSkuComponent} from './pages/casedetails/case.sku/case.sku.component';
import { CaseHistoryComponent } from './pages/casedetails/case-history/case-history.component';
import { TenderSkuComponent } from './pages/tenderdetails/tender-sku/tender-sku.component';
import { TenderCaseComponent } from './pages/tenderdetails/tender-case/tender-case.component';
import {TenderDescriptionComponent} from './pages/tenderdetails/tender.description/tender.description.component';
import { CaseButtonsComponent } from './pages/casedetails/case-buttons/case-buttons.component';
import { TenderButtonsComponent } from './pages/tenderdetails/tender-buttons/tender-buttons.component';


@NgModule({
  declarations: [
    AppComponent,
    TenderDetailsComponent,
    HomeComponent,
    ProfileComponent,
    DisplayDataComponent,
    CasesComponent,
    CaseDescriptionComponent,
    PlangraphicComponent,
    SettingsComponent,
    CasedetailsComponent,
    CaseHistoryComponent,
    CaseSkuComponent,
    TenderDescriptionComponent,
    TenderSkuComponent,
    TenderCaseComponent,
    CaseButtonsComponent,
    TenderButtonsComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    DxSelectBoxModule,
    DxCheckBoxModule,
    DxDataGridModule,
    DxFormModule,
    DxButtonModule,
    DxLoadPanelModule,
    DxTabsModule,
    BrowserModule,
    SideNavOuterToolbarModule,
    SideNavInnerToolbarModule,
    SingleCardModule,
    FooterModule,
    LoginFormModule,
    AppRoutingModule,
    DxFileUploaderModule,
    DxListModule
  ],
  providers: [AuthService, ScreenService, AppInfoService, Service, RestService],
  bootstrap: [AppComponent]
})
export class AppModule { }

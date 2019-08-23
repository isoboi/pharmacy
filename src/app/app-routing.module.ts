import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { TenderDetailsComponent } from './pages/tenderdetails/tenderdetails.component';
import { CasedetailsComponent } from './pages/casedetails/casedetails.component';
import { CasesComponent } from './pages/cases/cases.component';
import { PlangraphicComponent } from './pages/plangraphic/plangraphic.component';
import { SettingsComponent } from './pages/settings/settings.component';

const routes: Routes = [
  {
    path: 'tender',
    component: HomeComponent
  },
  {
    path: 'cases',
    component: CasesComponent
  },
  {
    path: 'plangraphic',
    component: PlangraphicComponent
  },
  {
    path: 'settings',
    component: SettingsComponent
  },
  {
    path: 'tender/:id',
    component: TenderDetailsComponent
  },
  {
    path: 'case',
    component: CasedetailsComponent
  },
  {
    path: 'cases/:id',
    component: CasedetailsComponent
  },
  {
    path: '**',
    redirectTo: 'tender'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }

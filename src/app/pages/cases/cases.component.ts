import {NgModule, Component, ViewChild, enableProdMode} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {
  DxDataGridComponent,
  DxDataGridModule,
  DxSelectBoxModule,
  DxCheckBoxModule
} from 'devextreme-angular';

import {Tender, Service, TenderDetails} from '../home/app.service';
import {ActivatedRoute, Router} from '@angular/router';
import 'devextreme/data/odata/store';
import {version} from 'punycode';
import ODataStore from 'devextreme/data/odata/store';
import DataSource from 'devextreme/data/data_source';
import {RestService} from 'src/app/services/rest.service';
import {TenderCase} from '../../models/case.interface';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'app-cases',
  templateUrl: 'cases.component.html',
  styleUrls: ['./cases.component.scss'],
  preserveWhitespaces: true
})

export class CasesComponent {
  @ViewChild(DxDataGridComponent, {static: false}) dataGrid: DxDataGridComponent;
  currentFilter: any;
  showFilterRow: boolean;
  showHeaderFilter: boolean;
  dataSource: DataSource;
  dataSourceSKU: DataSource;
  filterValue: number;

  constructor(
    private service: Service,
    private router: Router,
    private route: ActivatedRoute,
    private restService: RestService
  ) {

    this.showFilterRow = true;
    this.showHeaderFilter = true;
    this.dataSource = this.restService.bindData(
      'https://navpharm365app.ncdev.ru/odata/TenderCase',
      ['Id'],
      {Id: 'Int32'});

    this.dataSourceSKU = this.restService.bindData(
      'https://navpharm365app.ncdev.ru/odata/TenderCaseSKU',
      ['Id'],
      {Id: 'Int32'});
    if (this.route.snapshot.params.id) {

    }
  }

  initialized() {
    this.service.setTenderDetails(this.dataSourceSKU);
  }

  onRowDblClick(e) {
    const data: TenderCase = e.data;
    console.log(data);
    this.service.setSelectedTender(data);
    this.router.navigateByUrl(`/case/${data.Id}`);
  }

  cellClick(e) {
    const tenderId = e.data.Id;
    this.filterValue = tenderId;
    this.dataSourceSKU = new DataSource(this.service.getTenderDetails(tenderId));
  }


  private static getOrderDay(rowData) {
    return (new Date(rowData.OrderDate)).getDay();
  }

  calculateFilterExpression(value, selectedFilterOperations, target) {
    let column = this as any;
    if (target === 'headerFilter' && value === 'weekends') {
      return [[CasesComponent.getOrderDay, '=', 0], 'or', [CasesComponent.getOrderDay, '=', 6]];
    }
    return column.defaultCalculateFilterExpression.apply(this, arguments);
  }

  orderHeaderFilter(data) {
    console.log('filter..');
    data.dataSource.postProcess = (results) => {
      results.push({
        text: 'Weekends',
        value: 'weekends'
      });
      return results;
    };
  }

  clearFilter() {
    this.dataGrid.instance.clearFilter();
  }
}

// @NgModule({
//     imports: [
//         BrowserModule,
//         DxDataGridModule,
//         DxSelectBoxModule,
//         DxCheckBoxModule
//     ],
//     declarations: [CasesComponent],
//     bootstrap: [CasesComponent]
// })
// export class AppModule { }

// platformBrowserDynamic().bootstrapModule(AppModule);

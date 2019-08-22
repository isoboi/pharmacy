import {Component, ViewChild, enableProdMode} from '@angular/core';
import {
  DxDataGridComponent
} from 'devextreme-angular';

import {Service} from '../home/app.service';
import {ActivatedRoute, Router} from '@angular/router';
import 'devextreme/data/odata/store';
import DataSource from 'devextreme/data/data_source';
import {RestService} from 'src/app/services/rest.service';
import {TenderCase} from '../../models/case.interface';
import {environment} from '../../../environments/environment';

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
  apiUrl = environment.apiUrl
  constructor(
    private service: Service,
    private router: Router,
    private route: ActivatedRoute,
    private restService: RestService
  ) {

    this.showFilterRow = true;
    this.showHeaderFilter = true;
    this.dataSource = this.restService.bindData(
      environment.apiUrl + '/TenderCase',
      ['Id'],
      {Id: 'Int32'});

    this.dataSourceSKU = this.restService.bindData(
      environment.apiUrl + '/TenderCaseSKU',
      ['Id'],
      {Id: 'Int32'});
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

  onSelectionChanged(e) {
    const tenderCaseId = e.selectedRowsData[0].Id;
    this.filterValue = tenderCaseId;
    this.dataSourceSKU.filter(['TenderCaseId', '=', tenderCaseId]);
    this.dataSourceSKU.load();

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

import {Component, ViewChild, enableProdMode} from '@angular/core';
import {DxDataGridComponent} from 'devextreme-angular';
import { Service} from './app.service';
import {Router} from '@angular/router';
import 'devextreme/data/odata/store';
import DataSource from 'devextreme/data/data_source';
import {RestService} from 'src/app/services/rest.service';
import {environment} from '../../../environments/environment';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'app-root',
  templateUrl: 'home.component.html',
  styleUrls: ['./home.component.scss'],
  preserveWhitespaces: true
})

export class HomeComponent {

  constructor(
    private service: Service,
    private router: Router,
    private restService: RestService
  ) {
    this.showFilterRow = true;
    this.showHeaderFilter = true;

    this.dataSource = this.restService.bindData(
      environment.apiUrl + '/Tender',
      ['Id'],
      {Id: 'Int32'}
    );

    this.dataSourceSKU = this.restService.bindData(
      environment.apiUrl + '/TenderSKU',
      ['Id'],
      {Id: 'Int32'}
    );
  }

  @ViewChild(DxDataGridComponent, {static: false}) dataGrid: DxDataGridComponent;
  currentFilter: any;
  showFilterRow: boolean;
  showHeaderFilter: boolean;
  dataSource: DataSource;
  dataSourceSKU: DataSource;
  filterValue: number;

  initialized() {
    this.service.setTenderDetails(this.dataSourceSKU);
  }

  onRowDblClick(e) {
    this.service.setSelectedTender(e.data);
    this.router.navigateByUrl(`/tender/${e.data.Id}`);
  }

  cellClick(e) {
    const tenderId = e.data.Id;
    this.filterValue = tenderId;
    this.dataSourceSKU = new DataSource(this.service.getTenderDetails(tenderId));
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
}

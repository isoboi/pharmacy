import {Component} from '@angular/core';
import {CasesService} from '../../../services/cases.service';
import {RestService} from '../../../services/rest.service';
import DataSource from 'devextreme/data/data_source';
import {HttpClient} from '@angular/common/http';


@Component({
  selector: 'app-case-sku',
  templateUrl: 'case.sku.component.html',
  styleUrls: ['case.sku.component.scss']
})

export class CaseSkuComponent {

  dataSource: DataSource;
  dataSourceSkuMg: DataSource;
  dataSourceCommercialPolicyRules;
  list;
  show = false;
  constructor(private casesService: CasesService,
              private http: HttpClient,
              private restService: RestService) {
    this.dataSource = this.restService.bindData(
      'https://navpharm365app.ncdev.ru/odata/TenderCaseSKU',
      [ 'Id' ],
      { Id: 'Int32' }
    );

    this.dataSourceSkuMg = this.restService.bindData(
      'https://navpharm365app.ncdev.ru/odata/CommercialPolicy',
      [ 'Id' ],
      { Id: 'string' }
    );


    this.dataSourceCommercialPolicyRules = this.restService.bindData(
      'https://navpharm365app.ncdev.ru/odata/CommercialPolicy',
      [ 'Id' ],
      { Id: 'string' }
    );

    this.dataSourceCommercialPolicyRules.load()
      .then(() => this.show = true)
  }

  valueChange(event, data) {
    console.log(data)
    this.dataSource.store().push([
      { type: "update", key: data, data: { count: 10 } },
    ]);
  }
  ready = false;
}

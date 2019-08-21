import {Component, Input} from '@angular/core';
import {CasesService} from '../../../services/cases.service';
import {RestService} from '../../../services/rest.service';
import DataSource from 'devextreme/data/data_source';
import {HttpClient} from '@angular/common/http';
import {TenderCase} from '../../../models/case.interface';


@Component({
  selector: 'app-case-sku',
  templateUrl: 'case.sku.component.html',
  styleUrls: ['case.sku.component.scss']
})

export class CaseSkuComponent {

  @Input() tenderCase: TenderCase;
  dataSource: DataSource;
  dataSourceSkuMg: DataSource;
  SKU_MG: DataSource;
  ProductStructure: DataSource;
  currentFilter: any;
  dataSourceCommercialPolicyRules: DataSource;
  list;

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

    this.SKU_MG = this.restService.bindData(
      'https://navpharm365app.ncdev.ru/odata/SKUMG',
      [ 'Id' ],
      { Id: 'Int32' }
    );

    this.ProductStructure = this.restService.bindData(
      'https://navpharm365app.ncdev.ru/odata/ProductStructure',
      [ 'Id' ],
      { Id: 'Int32' }
    );
  }
}

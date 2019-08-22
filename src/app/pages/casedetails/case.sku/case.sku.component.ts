import {Component, Input} from '@angular/core';
import {CasesService} from '../../../services/cases.service';
import {RestService} from '../../../services/rest.service';
import DataSource from 'devextreme/data/data_source';
import {HttpClient} from '@angular/common/http';
import {TenderCase} from '../../../models/case.interface';
import {environment} from '../../../../environments/environment';
import {ActivatedRoute} from '@angular/router';


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
  apiUrl = environment.apiUrl;
  private id;
  constructor(private casesService: CasesService,
              private http: HttpClient,
              private route: ActivatedRoute,
              private restService: RestService) {
    this.id = this.route.snapshot.params.id;
    this.dataSource = this.restService.bindData(
      this.apiUrl + `TenderCaseSKU/${this.id}`,
      [ 'Id' ],
      { Id: 'Int32' }
    );

    this.dataSourceSkuMg = this.restService.bindData(
       this.apiUrl + 'CommercialPolicy',
      [ 'Id' ],
      { Id: 'string' }
    );


    this.dataSourceCommercialPolicyRules = this.restService.bindData(
      this.apiUrl + 'CommercialPolicy',
      [ 'Id' ],
      { Id: 'string' }
    );

    this.SKU_MG = this.restService.bindData(
      this.apiUrl + 'SKUMG',
      [ 'Id' ],
      { Id: 'Int32' }
    );

    this.ProductStructure = this.restService.bindData(
      this.apiUrl + 'ProductStructure',
      [ 'Id' ],
      { Id: 'Int32' }
    );
  }
}

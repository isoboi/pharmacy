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
  productDataSource: DataSource;
  ProductStructure: DataSource;
  ProductStructureFranchise: DataSource;
  currentFilter: any;
  dataSourceCommercialPolicyRules: DataSource;
  list;
  apiUrl = environment.apiUrl;
  private readonly id;
  constructor(private casesService: CasesService,
              private http: HttpClient,
              private route: ActivatedRoute,
              private restService: RestService) {
    this.id = this.route.snapshot.params.id;
    this.dataSource = this.restService.bindData(
      this.apiUrl + `/TenderCaseSKU`,
      [ 'Id' ],
      { Id: 'Int32' }
    );

    this.dataSource.filter(['TenderCaseId', '=', Number(this.id)]);
    this.dataSource.load();

    this.dataSourceSkuMg = this.restService.bindData(
       this.apiUrl + '/CommercialPolicy',
      [ 'Id' ],
      { Id: 'String' }
    );

    this.dataSourceSkuMg.load()


    this.productDataSource = this.restService.bindData(
      this.apiUrl + '/Product',
      [ 'Id' ],
      { Id: 'Int32' }
    );

    this.ProductStructure = this.restService.bindData(
      this.apiUrl + '/ProductStructure',
      [ 'Id' ],
      { Id: 'String' }
    );

    this.ProductStructure.load();

    this.ProductStructureFranchise = this.restService.bindData(
      this.apiUrl + '/ProductStructure',
      [ 'Id' ],
      { Id: 'String' }
    );
    this.ProductStructureFranchise.load();
    this.getFilteredCities = this.getFilteredCities.bind(this);

  }

  setStateValue(rowData: any, value: any): void {
    rowData.Franchise = null;
    (this as any).defaultSetCellValue(rowData, value);
  }


  getFilteredCities(options) {
    console.log(options);
    let filter = null;
    if (options.data) {
      const bu = this.ProductStructure.items().find((item) => item.Id === options.data.ProductStructureId);
      if (bu) {
        filter = ['BU', '=', bu];
      } else {
        filter = ['BU', '=', ''];
      }
    }

    return {
      store: this.ProductStructureFranchise.items(),
      filter
    };
  }
  onInitNewRow(event) {
    event.data = {
      TenderId: Number(this.id)
    };
  }

  onRowUpdated() {
    this.dataSource.reload();
  }
}


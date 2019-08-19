import {Injectable} from '@angular/core';
import ODataStore from 'devextreme/data/odata/store';
import DataSource from 'devextreme/data/data_source';
import {RestService} from 'src/app/services/rest.service';
import {HttpClient} from '@angular/common/http';

export class Tender {
  Id: number;
  BD: string;
  DefaultField: string;
  Blocks: string;
  Title: string;
  TitleField: string;
  Description: string;
  Source: string;
  DataType: string;
}

export class TenderDetails {
  BrandId: number;
  BrandName: string;
  DiffStartAndEDL: string;
  DiffStartAndReference: string;
  ForecastedValueUSD: string;
  Id: number;
  SKUId: number;
  SKUNameRus: string;
  TenderValueUSD: string;
  TenderVolume: string;
}

let tenders: Tender[] = [];

@Injectable()
export class Service {
  tenderDetails: DataSource;

  constructor(private restService: RestService,
              private http: HttpClient) {
    // this.setTenderDetails();
  }

  selectedTender: Tender = null;

  setTenders(data) {
    tenders = data;
  }

  getTenders() {
    return tenders;
  }

  getTenderCaseSKU() {
    return this.http.get('https://navpharm365app.ncdev.ru/odata/TenderCaseSKU');
  }

  setTenderDetails(dataSource) {
    console.log('setting td');
    if (!this.tenderDetails) {
      this.tenderDetails = dataSource;
    }
  }

  getData(rowCount: number, columnCount: number): import('devextreme/bundles/dx.all').default.data.DataSource {
    throw new Error('Method not implemented.');
  }

  setSelectedTender(tenderData) {
    this.selectedTender = tenderData;
  };

  getSelectedTender() {
    return this.selectedTender;
  }

  getTenderDetails(tenderId: number): TenderDetails[] {
    console.log(this.tenderDetails.items());
    const aa = this.tenderDetails.items().filter(td => td.Id === tenderId);
    console.log(aa);
    return aa;
  }
}

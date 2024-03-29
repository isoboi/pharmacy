import {Injectable} from '@angular/core';
import ODataStore from 'devextreme/data/odata/store';
import DataSource from 'devextreme/data/data_source';
import {RestService} from 'src/app/services/rest.service';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';

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
  apiUrl = environment.apiUrl;
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

  setTenderDetails(dataSource) {
    if (!this.tenderDetails) {
      this.tenderDetails = dataSource;
    }
  }

  getData(rowCount: number, columnCount: number): import('devextreme/bundles/dx.all').default.data.DataSource {
    throw new Error('Method not implemented.');
  }

  setSelectedTender(tenderData) {
    this.selectedTender = tenderData;
  }

  getSelectedTender() {
    return this.selectedTender;
  }

  getTenderDetails(tenderId: number): Observable<any> {
    return this.http.get(this.apiUrl + `/TenderCaseSKU/${tenderId}`);
  }


}

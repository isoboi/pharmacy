import { Component, OnInit } from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import { environment } from '../../../../environments/environment';
import { RestService } from '../../../services/rest.service';

@Component({
  selector: 'app-tender-shipment-plans',
  templateUrl: './tender-shipment-plans.component.html',
  styleUrls: ['./tender-shipment-plans.component.scss']
})
export class TenderShipmentPlansComponent implements OnInit {

  currentFilter: any;
  tenderSku: DataSource;
  tenderSkuPlan: DataSource;
  tenderSKUPlanArchive: DataSource;

  constructor(
    private restService: RestService
  ) { }

  ngOnInit() {
    this.getTenderSku();
    this.getTenderSkuPlan();
    this.TenderSKUPlanArchive();
  }

  private getTenderSku() {
    this.tenderSku = this.restService.bindData(
      environment.defaultApiUrl + '/TenderManager/odata/TenderSKU',
      ['TenderId'],
      {Id: 'Int32'}
    );
  }

  private getTenderSkuPlan() {
    this.tenderSkuPlan = this.restService.bindData(
      environment.defaultApiUrl + '/TenderManager/odata/TenderSKUPlan',
      ['Id'],
      {Id: 'Int32'}
    );
  }

  private TenderSKUPlanArchive() {
    this.tenderSKUPlanArchive = this.restService.bindData(
      environment.defaultApiUrl + '/TenderManager/odata/TenderSKUPlanArchive',
      ['Id'],
      {Id: 'Int32'}
    );
  }
}

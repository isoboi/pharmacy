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

    this.TenderSKUPlanArchive();
  }

  onSelectionChanged(e) {
    const tenderSkuId = e.selectedRowsData[0].Id;
    this.getTenderSkuPlan(tenderSkuId);
  }

  private getTenderSku() {
    this.tenderSku = this.restService.bindData(
      environment.apiUrl + '/TenderSKU',
      ['TenderId'],
      {Id: 'Int32'}
    );
  }

  private getTenderSkuPlan(tenderSkuId) {
    if (!this.tenderSkuPlan) {
      this.tenderSkuPlan = this.restService.bindData(
        environment.apiUrl + '/TenderSKUPlan',
        ['Id'],
        {Id: 'Int32'}
      );
    }
    this.tenderSkuPlan.filter(['TenderSKUId', '=', tenderSkuId]);
    this.tenderSkuPlan.load();
  }

  private TenderSKUPlanArchive() {
    this.tenderSKUPlanArchive = this.restService.bindData(
      environment.apiUrl + '/TenderSKUPlanArchive',
      ['TenderId'],
      {Id: 'Int32'}
    );
  }
}

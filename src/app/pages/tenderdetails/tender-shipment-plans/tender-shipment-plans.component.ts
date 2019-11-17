import { Component, OnInit } from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import { environment } from '../../../../environments/environment';
import { RestService } from '../../../services/rest.service';
import { TenderService } from '../../../services/tender.service';

@Component({
  selector: 'app-tender-shipment-plans',
  templateUrl: './tender-shipment-plans.component.html',
  styleUrls: ['./tender-shipment-plans.component.scss']
})
export class TenderShipmentPlansComponent implements OnInit {

  currentFilter: any;
  period: any;
  periodPlan: any;
  tenderSku: DataSource;
  tenderSkuPlan: DataSource;
  tenderSKUPlanArchive: DataSource;

  constructor(
    private restService: RestService,
    private tenderService: TenderService
  ) { }

  ngOnInit() {
    this.getTenderSku();

    this.TenderSKUPlanArchive();
  }

  onSelectionChanged(e) {
    const tenderSkuId = e.selectedRowsData[0].Id;
    this.getTenderSkuPlan(tenderSkuId);
  }

  setPeriod() {
    const date = this.getDate(this.period);
    this.tenderService.setPeriod(date)
      .subscribe(console.log);
  }

  setPeriodPlan() {
    const date = this.getDate(this.periodPlan);
    this.tenderService.setPlanPeriod(date)
      .subscribe(console.log);
  }

  private getDate(dateValue: Date) {
    const date = new Date(dateValue);
    return date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();
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
    this.tenderSkuPlan.filter(['TenderSKUId', '=', 2241]);
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

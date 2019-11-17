import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import DataSource from 'devextreme/data/data_source';
import { RestService } from '../../services/rest.service';

@Component({
  selector: 'app-shipments-plan-graphic',
  templateUrl: './shipments-plan-graphic.component.html',
  styleUrls: ['./shipments-plan-graphic.component.scss']
})
export class ShipmentsPlanGraphicComponent implements OnInit {

  tenderSkuPlan: DataSource;

  constructor(private restService: RestService) { }

  ngOnInit() {
    this.getTenderSkuPlan();
  }

  customizeText(e) {
    return e.value;
  }

  private getTenderSkuPlan() {
    this.tenderSkuPlan = this.restService.bindData(
      environment.apiUrl + '/TenderSKUPlan',
      ['Id'],
      {Id: 'Int32'}
    );
  }
}

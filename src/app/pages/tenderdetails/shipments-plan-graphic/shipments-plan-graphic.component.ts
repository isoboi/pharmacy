import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import DataSource from 'devextreme/data/data_source';
import { RestService } from '../../../services/rest.service';

@Component({
  selector: 'app-shipments-plan-graphic',
  templateUrl: './shipments-plan-graphic.component.html',
  styleUrls: ['./shipments-plan-graphic.component.scss']
})
export class ShipmentsPlanGraphicComponent implements OnInit {

  tenderSkuPlan: DataSource;

  countriesInfo: any[] = [
    {
      date: '01.01.2019',
      Planned: 1009000,
      Announced: 520000,
      Alive: 600100,
      Actual: 100000,
    },
    {
      date: '01.02.2019',
      Planned: 1109000,
      Announced: 1020000,
      Alive: 1000100,
      Actual: 110000,
    },
    {
      date: '01.03.2019',
      Planned: 1009000,
      Announced: 1020000,
      Alive: 900100,
      Actual: 100000,
    },
    {
      date: '01.04.2019',
      Planned: 1109000,
      Announced: 1020000,
      Alive: 1000100,
      Actual: 190000,
    },
  ];

  energySources: any[] = [
    { value: 'Planned', name: 'Planned' },
    { value: 'Announced', name: 'Announced' },
    { value: 'Alive', name: 'Alive' },
    { value: 'Actual', name: 'Actual' }
  ];
  constructor(private restService: RestService) { }

  ngOnInit() {
    this.getTenderSkuPlan();
  }

  customizeText(e) {
    console.log(e);
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

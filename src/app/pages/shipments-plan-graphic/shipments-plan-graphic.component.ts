import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import DataSource from 'devextreme/data/data_source';
import { RestService } from '../../services/rest.service';
import { ShipmentPlanService } from '../../services/shipment-plan.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-shipments-plan-graphic',
  templateUrl: './shipments-plan-graphic.component.html',
  styleUrls: ['./shipments-plan-graphic.component.scss']
})
export class ShipmentsPlanGraphicComponent implements OnInit {

  tenderSkuPlan: DataSource;
  operators$: Observable<any[]>;
  graphicOptions: any[] = [
    {
      Id: 0,
      Value: 'шт'
    },
    {
      Id: 1,
      Value: 'USD'
    }
  ];
  graphicOption = this.graphicOptions[0];

  constructor(
    private restService: RestService,
    private shipmentPlan: ShipmentPlanService
    ) { }

  ngOnInit() {
    this.getTenderSkuPlan();
    this.getOperators();
  }

  customizeText(e) {
    return e.value;
  }

  onChangeOperator(e) {
    let params = null;
    if (e.value !== 'total') {
      params = ['TAM', '=', e.value];
    }
    this.tenderSkuPlan.filter(params);
    this.tenderSkuPlan.load();
  }

  onChangeOption(e) {
    this.graphicOption = e.value;
  }

  private getTenderSkuPlan() {
    this.tenderSkuPlan = this.restService.bindData(
      environment.apiUrl + '/TenderSKUPlan',
      ['Id'],
      {Id: 'Int32'}
    );
  }

  private getOperators() {
    this.operators$ = this.shipmentPlan.getTams()
      .pipe(map(item => {
        item.value.unshift({
          Id: 'total',
          Name: 'Все'
        });
        return item.value;
      }));
  }
}

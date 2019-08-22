import { Component, OnInit } from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import {RestService} from '../../../services/rest.service';
import {ActivatedRoute} from '@angular/router';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-tender-sku',
  templateUrl: './tender-sku.component.html',
  styleUrls: ['./tender-sku.component.scss']
})
export class TenderSkuComponent implements OnInit {

  tenderSku: DataSource;
  products: DataSource;
  skuias: DataSource;
  risk: DataSource;
  EDLPriceList: DataSource;
  ReferencePriceList: DataSource;
  ForecastPriceList: DataSource;
  currentFilter: any;
  id;
  apiUrl = environment.apiUrl;
  constructor(private restService: RestService,
              private route: ActivatedRoute) {
    this.id = this.route.snapshot.params.id;
  }

  ngOnInit() {
    this._getTenderSku();
  }

  private _getTenderSku() {
    this.tenderSku = this.restService.bindData(
      this.apiUrl + '/TenderSKU',
      ['Id'],
      {Id: 'Int32'}
    );
    this.tenderSku.filter(['TenderId', '=', Number(this.id)]);
    this.tenderSku.load();
    this.products = this.restService.bindData(
      this.apiUrl + '/Product',
      ['Id'],
      {Id: 'Int32'}
    );

    this.skuias = this.restService.bindData(
      this.apiUrl + '/SKUIAS',
      ['Id'],
      {Id: 'Int32'}
    );

    this.risk = this.restService.bindData(
      this.apiUrl + '/Risk',
      ['Id'],
      {Id: 'Int32'}
    );

    this.EDLPriceList = this.restService.bindData(
      this.apiUrl + '/EDLPriceList',
      ['Id'],
      {Id: 'decimal'}
    );

    this.ReferencePriceList = this.restService.bindData(
      this.apiUrl + '/ReferencePriceList',
      ['Id'],
      {Id: 'decimal'}
    );

    this.ForecastPriceList = this.restService.bindData(
      this.apiUrl + '/ForecastPriceList',
      ['Id'],
      {Id: 'decimal'}
    );
  }
}

import { Component, OnInit } from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import {RestService} from '../../../services/rest.service';

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

  constructor(private restService: RestService) { }

  ngOnInit() {
    this._getTenderSku();
  }

  private _getTenderSku() {
    this.tenderSku = this.restService.bindData(
      'http://navpharm365app.ncdev.ru/odata/TenderSKU',
      ['Id'],
      {Id: 'Int32'}
    );

    this.products = this.restService.bindData(
      'http://navpharm365app.ncdev.ru/odata/Product',
      ['Id'],
      {Id: 'Int32'}
    );

    this.skuias = this.restService.bindData(
      'http://navpharm365app.ncdev.ru/odata/SKUIAS',
      ['Id'],
      {Id: 'Int32'}
    );

    this.risk = this.restService.bindData(
      'http://navpharm365app.ncdev.ru/odata/Risk',
      ['Id'],
      {Id: 'Int32'}
    );

    this.EDLPriceList = this.restService.bindData(
      'http://navpharm365app.ncdev.ru/odata/EDLPriceList',
      ['Id'],
      {Id: 'decimal'}
    );

    this.ReferencePriceList = this.restService.bindData(
      'http://navpharm365app.ncdev.ru/odata/ReferencePriceList',
      ['Id'],
      {Id: 'decimal'}
    );

    this.ForecastPriceList = this.restService.bindData(
      'http://navpharm365app.ncdev.ru/odata/ForecastPriceList',
      ['Id'],
      {Id: 'decimal'}
    );
  }
}

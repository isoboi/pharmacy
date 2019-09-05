import {Component, Input, OnInit} from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import {RestService} from '../../../services/rest.service';
import {ActivatedRoute} from '@angular/router';
import {environment} from '../../../../environments/environment';
import {Tender} from '../../../models/tender';
import {TenderService} from '../../../services/tender.service';

@Component({
  selector: 'app-tender-sku',
  templateUrl: './tender-sku.component.html',
  styleUrls: ['./tender-sku.component.scss']
})
export class TenderSkuComponent implements OnInit {
  @Input()tender: Tender;
  @Input()disabled: boolean;
  tenderSku: DataSource;
  products: DataSource;
  brands: DataSource;
  skuias: DataSource;
  risk: DataSource;
  EDLPriceList: DataSource;
  ReferencePriceList: DataSource;
  ForecastPriceList: DataSource;
  currentFilter: any;
  id;
  apiUrl = environment.apiUrl;
  canCreateTenderSKU$;

  constructor(private restService: RestService,
              private tenderService: TenderService,
              private route: ActivatedRoute) {
    this.id = this.route.snapshot.params.id;
  }

  ngOnInit() {
    this.canCreateTenderSKU$ = this.tenderService.canCreateTenderSKU();
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

    this.brands = this.restService.bindData(
      this.apiUrl + '/Brand',
      ['Id'],
      {Id: 'Int32'}
    );
    this.brands.load();
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

  onInitNewRow(event) {
    event.data = {
      TenderId: this.id
    }
    console.log(event)
  }
}

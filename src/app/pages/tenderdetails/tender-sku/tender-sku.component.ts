import { Component, OnInit } from '@angular/core';
import DevExpress from 'devextreme/bundles/dx.all';
import DataSource from 'devextreme/data/data_source';

@Component({
  selector: 'app-tender-sku',
  templateUrl: './tender-sku.component.html',
  styleUrls: ['./tender-sku.component.scss']
})
export class TenderSkuComponent implements OnInit {
  dataSource: DataSource;
  constructor() { }

  ngOnInit() {
  }

}

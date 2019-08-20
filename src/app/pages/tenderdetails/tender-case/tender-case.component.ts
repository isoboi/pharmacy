import {Component, OnInit} from '@angular/core';
import {RestService} from '../../../services/rest.service';
import DataSource from 'devextreme/data/data_source';

@Component({
  selector: 'app-tender-case',
  templateUrl: './tender-case.component.html',
  styleUrls: ['./tender-case.component.scss']
})
export class TenderCaseComponent implements OnInit {

  tenderCase: DataSource;
  currentFilter: any;

  constructor(private restService: RestService) {
  }

  ngOnInit() {
    this._getTenderCase();
  }

  onRowDblClick(e) {
    console.log(e);
  }

  private _getTenderCase() {
    this.tenderCase = this.restService.bindData(
      'http://navpharm365app.ncdev.ru/odata/TenderCase',
      ['Id'],
      {Id: 'Int32'}
    );
  }

}

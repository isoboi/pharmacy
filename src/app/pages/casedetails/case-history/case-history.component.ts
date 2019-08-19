import {Component, Input, OnInit, ViewChild} from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import {RestService} from '../../../services/rest.service';
import {DxDataGridComponent} from 'devextreme-angular';
import {TenderCase} from '../../../models/case.interface';

@Component({
  selector: 'app-case-history',
  templateUrl: './case-history.component.html',
  styleUrls: ['./case-history.component.scss']
})
export class CaseHistoryComponent implements OnInit {

  @ViewChild('attachmentsGrid', {static: true}) attachmentsGrid: DxDataGridComponent;
  @Input() tenderCase: TenderCase;
  attachments: DataSource;
  getTenderCaseApproved: DataSource;
  showFilterRow = true;
  showHeaderFilter = true;
  currentFilter: any;
  RequestorComment = {RequestorComment: ''};
  ApproverComment = {ApproverComment: ''};

  constructor(private restService: RestService) {
  }

  ngOnInit() {
    this._getAttachments();
    this._getTenderCaseApproved();
  }

  onUploaded(e) {
    this.attachmentsGrid.instance.refresh();
  }

  RequestorCommentSave() {
    console.log(this.RequestorComment);
  }

  ApproverCommentSave() {
    console.log(this.ApproverComment);
  }

  private _getAttachments() {
    this.attachments = this.restService.bindData(
      'http://navpharm365app.ncdev.ru/odata/Annotation',
      ['Id'],
      {Id: 'Int32'}
    );
  }

  private _getTenderCaseApproved() {
    this.getTenderCaseApproved = this.restService.bindData(
      'http://navpharm365app.ncdev.ru/odata/TenderCaseApproved',
      ['Id'],
      {Id: 'Int32'}
    );
  }

}

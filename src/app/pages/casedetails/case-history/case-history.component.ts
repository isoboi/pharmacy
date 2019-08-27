import {Component, Input, OnInit, ViewChild} from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import {RestService} from '../../../services/rest.service';
import {DxDataGridComponent} from 'devextreme-angular';
import {CommentType, TenderCase} from '../../../models/case.interface';
import {CasesService} from '../../../services/cases.service';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import notify from 'devextreme/ui/notify';

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
  form = {RequestorComment: '', ApproverComment: ''};
  selectedRow = null;
  apiUrl = environment.apiUrl;
  canDelete$: Observable<any>;
  id;
  comment = CommentType;
  constructor(private restService: RestService,
              private route: ActivatedRoute,
              private caseService: CasesService) {
  }

  ngOnInit() {
    this.id = this.route.snapshot.params.id;
    this._getAttachments();
    this._getTenderCaseApproved();
    this.canDelete$ = this.caseService.canDelete(this.id);
  }

  onUploaded(e) {
    const file = e.value[0];
    const fileData = {
      ObjectId: this.tenderCase.Id,
      FileName: file.name,
      FileType: file.type
    };

    this.caseService.addFileData(fileData).subscribe(() => this.attachmentsGrid.instance.refresh());
  }

  onFileDelete() {
  }

  commentSave(commentType) {
    const tenderCaseApproved = this.getTenderCaseApproved.items().filter((item: any) => {
      return String(item.TenderCaseId) === this.id;
    }).sort((a, b) => {
      return b.Id - a.Id;
    });
    if (this.form[commentType]) {
      if (commentType === this.comment.approverComment) {
        this.caseService.postComment({
          Comment: this.form.ApproverComment,
          TenderCaseApprovedId: tenderCaseApproved[0].Id
        })
          .subscribe((x) => {
            notify({message: 'Approver Comment Added', position: 'top'}, 'success', 1500);
          });
      } else {
        this.caseService.patchComment({
          Id: this.tenderCase.Id,
          Comment: this.form.RequestorComment,
          TenderCaseApprovedId: tenderCaseApproved[0].Id
        })
          .subscribe((x) => {
            notify({message: 'Requestor Comment Added', position: 'top'}, 'success', 1500);
          });
      }
    }
  }



  onRowClick(evt) {
    this.selectedRow = evt;
  }

  private _getAttachments() {
    this.attachments = this.restService.bindData(
      this.apiUrl + '/Annotation',
      ['Id'],
      {Id: 'Int32'}
    );
  }

  private _getTenderCaseApproved() {
    this.getTenderCaseApproved = this.restService.bindData(
      this.apiUrl + '/TenderCaseApproved',
      ['Id'],
      {Id: 'Int32'}
    );
    this.getTenderCaseApproved.filter(['TenderCaseId', '=', Number(this.id)]);
  }

}

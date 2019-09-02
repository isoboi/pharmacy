import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import {RestService} from '../../../services/rest.service';
import {DxDataGridComponent} from 'devextreme-angular';
import {CommentType, TenderCase} from '../../../models/case.interface';
import {CasesService} from '../../../services/cases.service';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import notify from 'devextreme/ui/notify';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-case-history',
  templateUrl: './case-history.component.html',
  styleUrls: ['./case-history.component.scss']
})
export class CaseHistoryComponent implements OnInit, OnChanges {

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
  canDelete = false;
  canCreate$: Observable<any>;
  id;
  comment = CommentType;
  approverList;
  constructor(private restService: RestService,
              private route: ActivatedRoute,
              private caseService: CasesService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.tenderCase && changes.tenderCase.currentValue){
      this.caseService.getApprover(this.tenderCase.OwnerId)
        .subscribe((data) => {
          this.approverList = data;
        });
    }
  }

  ngOnInit() {
    this.id = this.route.snapshot.params.id;
    this._getAttachments();
    this._getTenderCaseApproved();
    this.canCreate$ = this.caseService.canCreateApproval();
  }

  onUploaded(e) {
    const file = e.file;
    const items = this.getTenderCaseApproved.items().sort((a, b) => b.Id - a.Id);
    if (items[0]) {
      const ObjectId = items[0].Id;
      const fileData = {
        ObjectId,
        FileName: file.name,
        FileType: file.type
      };

      this.caseService.addFileData(fileData).subscribe(() => this.attachmentsGrid.instance.refresh());
    }

  }

  onFileDelete() {
    const items = this.getTenderCaseApproved.items().sort((a, b) => b.Id - a.Id);
    if (items[0]) {
      const id = items[0].Id;
    }
    // this.caseService.deleteFile()
  }

  onSelectionChanged(e) {
    this.selectedRow = e;
    this.canDelete = false;
    const id = this.selectedRow.selectedRowsData[0].Id;
    this.caseService.canDeleteApproval(id)
      .subscribe((x: any) => {
        this.canDelete = x.value;
      });
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
            this.getTenderCaseApproved.reload();
          });
      } else {
        this.caseService.patchComment({
          Id: this.tenderCase.Id,
          Comment: this.form.RequestorComment,
          TenderCaseApprovedId: tenderCaseApproved[0].Id
        })
          .subscribe((x) => {
            notify({message: 'Requestor Comment Added', position: 'top'}, 'success', 1500);
            this.getTenderCaseApproved.reload();
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

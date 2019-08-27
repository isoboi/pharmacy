import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActionEvent, Actions, TenderCase, TenderCaseStatus} from '../../../models/case.interface';
import {ActivatedRoute} from '@angular/router';
import {CasesService} from '../../../services/cases.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-case-buttons',
  templateUrl: './case-buttons.component.html',
  styleUrls: ['./case-buttons.component.scss']
})
export class CaseButtonsComponent implements OnInit {

  @Input() tabIndex = 0;
  @Input() tenderCase: TenderCase;
  @Output() saveCase = new EventEmitter<ActionEvent>();
  tenderCaseStatus = TenderCaseStatus;
  actions = Actions;
  id: string;
  canSave: Observable<any>;
  canApprove$: Observable<any>;
  canReject$: Observable<any>;
  constructor(private activateRoute: ActivatedRoute,
              private caseService: CasesService) {
    this.id = activateRoute.snapshot.params.id;
  }

  ngOnInit() {
    if (this.id !== 'new') {
      this.canSave = this.caseService.canUpdate(this.id);
      this.canApprove$ = this.caseService.canApprove(this.id);
      this.canReject$ = this.caseService.canReject(this.id);
    } else {
      this.canSave = this.caseService.canCreate();
    }

  }

  save(action) {
    this.saveCase.emit(action);
  }
}

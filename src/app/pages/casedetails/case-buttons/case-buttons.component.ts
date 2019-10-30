import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import {ActionEvent, Actions, TenderCase, TenderCaseStatus} from '../../../models/case.interface';
import {ActivatedRoute} from '@angular/router';
import {CasesService} from '../../../services/cases.service';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-case-buttons',
  templateUrl: './case-buttons.component.html',
  styleUrls: ['./case-buttons.component.scss']
})
export class CaseButtonsComponent implements OnInit, OnDestroy {

  @Input() tabIndex = 0;
  @Input() tenderCase: TenderCase;
  @Output() saveCase = new EventEmitter<ActionEvent>();
  tenderCaseStatus = TenderCaseStatus;
  actions = Actions;
  id: string;
  canSave: Observable<any>;
  canApprove$: Observable<any>;
  canReject$: Observable<any>;
  canCreateRelatedCase$: Observable<any>;

  private destroy$ = new Subject();

  constructor(private activateRoute: ActivatedRoute,
              private caseService: CasesService) {
  }

  ngOnInit() {
    this.activateRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.id = params.id;
        if (this.id !== 'new') {
          this.canSave = this.caseService.canUpdate(this.id);
          this.canReject$ = this.caseService.canReject(this.id);
          this.canCreateRelatedCase$ = this.caseService.canCreateRelatedCase(this.id);
          if (this.tabIndex !== 2) {
            this.canApprove$ = this.caseService.canApprove(this.id);
          }
        } else {
          this.canSave = this.caseService.canCreate();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  save(action) {
    this.saveCase.emit(action);
  }
}

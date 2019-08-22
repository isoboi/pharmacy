import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActionEvent, Actions, TenderCase, TenderCaseStatus} from '../../../models/case.interface';
import {ActivatedRoute} from '@angular/router';

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
  id: number;

  constructor(private activateRoute: ActivatedRoute) {
    this.id = activateRoute.snapshot.params.id;
  }

  ngOnInit() {
    console.log(0);
  }

  save(action) {
    this.saveCase.emit(action);
  }
}

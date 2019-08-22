import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActionEvent, Actions, TenderCase, TenderCaseStatus} from '../../../models/case.interface';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-case-buttons',
  templateUrl: './case-buttons.component.html',
  styleUrls: ['./case-buttons.component.scss']
})
export class CaseButtonsComponent implements OnInit {

  @Input() tabIndex: number;
  @Input() tenderCase: TenderCase;
  @Input() selectBoxes;
  @Output() saveCase = new EventEmitter<ActionEvent>();
  tenderCaseStatus = TenderCaseStatus;
  actions = Actions;
  id;

  constructor(private activateRoute: ActivatedRoute) {
    this.id = activateRoute.snapshot.params.id;
  }

  ngOnInit() {
  }

  save(action) {
    this.saveCase.emit({tenderCase: this.tenderCase, action});
  }
}

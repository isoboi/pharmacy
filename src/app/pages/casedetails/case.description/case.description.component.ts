import {Component, EventEmitter, Input, Output, ChangeDetectorRef} from '@angular/core';
import {ActionEvent, Actions, TenderCase, TenderCaseStatus} from '../../../models/case.interface';
import {RestService} from '../../../services/rest.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-case-description',
  templateUrl: './case.description.component.html',
  styleUrls: ['./case.description.component.scss']
})
export class CaseDescriptionComponent {

  @Input()tenderCase: TenderCase;
  @Input()selectBoxes;
  showLoadPanel = true;
  tenderCaseStatus = TenderCaseStatus;
  id
  constructor(private restService: RestService,
              private route: ActivatedRoute,
              private cdr: ChangeDetectorRef) {
    this.id = this.route.snapshot.params.id;
  }

  onInitialized() {
    this.showLoadPanel = false;
    this.cdr.detectChanges();
  }
}

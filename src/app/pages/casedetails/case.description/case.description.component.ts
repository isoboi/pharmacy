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

  @Input() tenderCase: TenderCase;
  @Input() selectBoxes;
  @Output() saveCase = new EventEmitter<ActionEvent>();
  showLoadPanel = true;
  tenderCaseStatus = TenderCaseStatus;
  id: string;
  isNewCase: boolean;
  constructor(private restService: RestService,
              private route: ActivatedRoute,
              private cdr: ChangeDetectorRef) {
    this.id = this.route.snapshot.params.id;
    this.isNewCase = this.id === 'new';
  }

  onInitialized() {
    this.showLoadPanel = false;
    this.cdr.detectChanges();
    if (this.isNewCase) {
      this.tenderCase = new TenderCase();
    }
  }

  save(action) {
    console.log(this.tenderCase);
    this.saveCase.emit({tenderCase: this.tenderCase, action});
  }
}

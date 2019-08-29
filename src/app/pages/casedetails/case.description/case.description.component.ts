import {Component, EventEmitter, Input, Output, ChangeDetectorRef, OnDestroy, OnInit} from '@angular/core';
import {ActionEvent, TenderCase, TenderCaseStatus} from '../../../models/case.interface';
import {RestService} from '../../../services/rest.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-case-description',
  templateUrl: './case.description.component.html',
  styleUrls: ['./case.description.component.scss']
})
export class CaseDescriptionComponent implements OnInit{

  @Input() tenderCase: TenderCase;
  @Input() selectBoxes;
  @Output() saveCase = new EventEmitter<ActionEvent>();
  showLoadPanel = true;
  tenderCaseStatus = TenderCaseStatus;
  id: string;
  isNewCase: boolean;
  tenderId;
  constructor(private restService: RestService,
              private route: ActivatedRoute,
              private cdr: ChangeDetectorRef) {

  }

  ngOnInit() {
    this.id = this.route.snapshot.params.id;
    this.isNewCase = this.id === 'new';
    if (this.isNewCase) {
      this.tenderCase = new TenderCase();
      console.log(this.tenderCase)
      this.tenderId = this.route.snapshot.queryParams['tenderId'];
    }
  }

  onInitialized() {
    this.showLoadPanel = false;
    this.cdr.detectChanges();

  }

  save(action) {
    console.log(this.tenderCase)
    this.saveCase.emit({tenderCase: this.tenderCase, action});
  }

}

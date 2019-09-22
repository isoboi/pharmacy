import {Component, EventEmitter, Input, Output, ChangeDetectorRef, OnDestroy, OnInit} from '@angular/core';
import {ActionEvent, TenderCase, TenderCaseStatus} from '../../../models/case.interface';
import {RestService} from '../../../services/rest.service';
import {ActivatedRoute} from '@angular/router';
import {environment} from '../../../../environments/environment';
import DataSource from 'devextreme/data/data_source';
import {CasesService} from '../../../services/cases.service';

@Component({
  selector: 'app-case-description',
  templateUrl: './case.description.component.html',
  styleUrls: ['./case.description.component.scss']
})
export class CaseDescriptionComponent implements OnInit{

  @Input() tenderCase: TenderCase;
  @Output() saveCase = new EventEmitter<ActionEvent>();
  showLoadPanel = true;
  tenderCaseStatus = TenderCaseStatus;
  id: string;
  isNewCase: boolean;
  tenderId;
  relatedCaseComment: DataSource;
  distributor: DataSource;
  channel: DataSource;
  constructor(private restService: RestService,
              private casesService: CasesService,
              private route: ActivatedRoute,
              private cdr: ChangeDetectorRef) {

  }

  ngOnInit() {
    this.id = this.route.snapshot.params.id;
    this.isNewCase = this.id === 'new';
    if (this.isNewCase) {
      this.tenderCase = new TenderCase();
      this.tenderId = this.route.snapshot.queryParams['tenderId'];
    }

    this.relatedCaseComment = this.casesService.getRelatedCaseComment();
    this.distributor = this.casesService.getDistributor();
    this.channel = this.casesService.getChannel();
  }

  onInitialized() {
    this.showLoadPanel = false;
    this.cdr.detectChanges();

  }

  save(action) {
    this.saveCase.emit({tenderCase: this.tenderCase, action});
  }

}

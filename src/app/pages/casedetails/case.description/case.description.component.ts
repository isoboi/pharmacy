import {Component, EventEmitter, Input, Output, ChangeDetectorRef, OnDestroy, OnInit} from '@angular/core';
import { ActionEvent, Actions, TenderCase, TenderCaseStatus } from '../../../models/case.interface';
import {RestService} from '../../../services/rest.service';
import {ActivatedRoute} from '@angular/router';
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
  @Output() createRelatedCase = new EventEmitter<any>();
  @Output() copyCase = new EventEmitter<any>();
  showLoadPanel = true;
  showPopup = false;
  copyPopup = false;
  tenderCaseStatus = TenderCaseStatus;
  id: string;
  isNewCase: boolean;
  tenderId;
  relatedCaseComment: DataSource;
  distributor: DataSource;
  channel: DataSource;
  selectedCaseComment = null;
  caseFields = {
    DiscountNumber: true,
  };

  caseSkuFields = {
    Quantity: true,
    AddOnInvoiceDiscount: true,
    AddOffInvoiceDiscount: true,
    DemandedShelfLife: true,
    ShelfLifePercent: true,
    ShelfLifeMonth: true,
    CPCode: true,
    ProductStructureId: true,
  };

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
    if (action === Actions.copy) {
      this.copyPopup = true;
      return;
    }
    if (action === Actions.relatedCase) {
      this.showPopup = true;
      return;
    }
    this.saveCase.emit({tenderCase: this.tenderCase, action});
  }

  onChangeCaseComment(e) {
    this.selectedCaseComment = e.selectedItem;
  }

  onClosePopup(e) {
    if (e) {
      this.createRelatedCase.emit({
        caseCommentId: {RelatedCaseCommentId: this.selectedCaseComment.Id},
        Id: this.id
      });
    }
    this.showPopup = false;
  }

  onCloseSavePopup(e) {
    if (e) {
      const cases = this.getSelectedFields(this.caseFields).join(',');
      const casesSku = this.getSelectedFields(this.caseSkuFields).join(',');
      const casesData = {
        Columns: cases,
        SkuColumns: casesSku
      };

      this.copyCase.emit(casesData);
    }
    this.copyPopup = false;
  }

  private getSelectedFields(allFields) {
    const fields = [];
    for (const key in allFields) {
      if (allFields[key]) {
        fields.push(key);
      }
    }

    return fields;
  }
}

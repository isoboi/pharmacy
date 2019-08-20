import {Component, EventEmitter, Input, Output, ChangeDetectorRef} from '@angular/core';
import {TenderCase} from '../../../models/case.interface';
import {RestService} from '../../../services/rest.service';
import {CasesService} from '../../../services/cases.service';

@Component({
  selector: 'app-case-description',
  templateUrl: './case.description.component.html',
  styleUrls: ['./case.description.component.scss']
})
export class CaseDescriptionComponent {

  @Input()tenderCase: TenderCase;
  @Input()selectBoxes;
  @Output()saveCase = new EventEmitter();

  showLoadPanel = true;

  constructor(private restService: RestService,
              private cdr: ChangeDetectorRef,
              private casesService: CasesService) {
  }

  onInitialized() {
    this.showLoadPanel = false;
    this.cdr.detectChanges();
  }

  save() {
    this.saveCase.emit(this.tenderCase);
  }
}

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
  constructor(private restService: RestService,
              private cdr: ChangeDetectorRef,
              private casesService: CasesService) {
  }
  visible = true;

  onFieldDataChanged() {
    console.log(this.tenderCase);
  }
  onInitialized() {
    this.visible = false;
    this.cdr.detectChanges();
  }

  save() {
    this.saveCase.emit(this.tenderCase);
  }
}

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActionsTender, Tender} from '../../../models/tender';
import {TenderService} from '../../../services/tender.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-tender-buttons',
  templateUrl: './tender-buttons.component.html',
  styleUrls: ['./tender-buttons.component.scss']
})
export class TenderButtonsComponent implements OnInit {

  @Input() tabIndex;
  @Input()tender: Tender;
  @Output() saveTender = new EventEmitter<any>();
  actions = ActionsTender;
  canCreate$;
  canSave$;
  canDecline$;
  id;
  constructor(private tenderService: TenderService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.id = this.route.snapshot.params.id;
    this.canCreate$ = this.tenderService.canCreate();
    this.canSave$ = this.tenderService.canSave(this.id);
    this.canDecline$ = this.tenderService.canDecline(this.id);
  }

  save(event) {
    this.saveTender.emit(event);
  }
}

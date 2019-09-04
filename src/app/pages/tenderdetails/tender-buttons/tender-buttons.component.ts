import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActionsTender, Tender} from '../../../models/tender';
import {TenderService} from '../../../services/tender.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-tender-buttons',
  templateUrl: './tender-buttons.component.html',
  styleUrls: ['./tender-buttons.component.scss']
})
export class TenderButtonsComponent implements OnInit {

  @Input() tabIndex;
  @Input() disableCreate = false;
  @Input()tender: Tender;
  @Output() saveTender = new EventEmitter<any>();
  actions = ActionsTender;
  canCreateCase$;
  canSave$;
  canDecline$;
  id;
  constructor(private tenderService: TenderService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.id = this.route.snapshot.params.id;
    if (this.id !== 'new') {
      this.canCreateCase$ = this.tenderService.canCreateCase();
      this.canSave$ = this.tenderService.canUpdate(this.id);
      this.canDecline$ = this.tenderService.canDecline(this.id);
    } else {
      this.canSave$ = this.tenderService.canCreate();
    }

  }

  save(event) {
    this.saveTender.emit(event);
  }

  createCase() {
    this.router.navigate(['/cases/new'], { queryParams: { tenderId: this.id}});
  }
}

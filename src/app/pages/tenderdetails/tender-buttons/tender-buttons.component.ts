import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActionsTender} from '../../../models/tender';

@Component({
  selector: 'app-tender-buttons',
  templateUrl: './tender-buttons.component.html',
  styleUrls: ['./tender-buttons.component.scss']
})
export class TenderButtonsComponent implements OnInit {

  @Input() tabIndex;
  @Output() saveTender = new EventEmitter<any>();
  actions = ActionsTender;
  constructor() { }

  ngOnInit() {
  }

  save(event) {
    this.saveTender.emit(event);
  }
}

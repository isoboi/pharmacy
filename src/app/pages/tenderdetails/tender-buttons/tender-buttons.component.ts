import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-tender-buttons',
  templateUrl: './tender-buttons.component.html',
  styleUrls: ['./tender-buttons.component.scss']
})
export class TenderButtonsComponent implements OnInit {

  @Input() tabIndex;
  @Output() saveTender = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    console.log(this.tabIndex)
  }

  save() {
    this.saveTender.emit();
  }
}

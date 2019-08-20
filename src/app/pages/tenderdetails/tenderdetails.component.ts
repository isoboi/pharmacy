import { Component, OnInit, Input } from '@angular/core';
import { Tender, Service } from '../home/app.service';
import { Router } from '@angular/router';
import {TenderService} from '../../services/tender.service';

@Component({
  selector: 'app-tenderdetails',
  templateUrl: './tenderdetails.component.html',
  styleUrls: ['./tenderdetails.component.scss']
})
export class TenderdetailsComponent implements OnInit {

  tender: Tender;
  tabs;
  tabIndex = 1;
  constructor(
    private service: Service,
    private router: Router,
    private tenderService: TenderService
  ) {
     
  }

  ngOnInit() {
    this.tender = this.service.getSelectedTender();
    this.tabs = this.tenderService.getTabs();
  }

  selectTab(e) {
    this.tabIndex = e.itemIndex;
  }

}

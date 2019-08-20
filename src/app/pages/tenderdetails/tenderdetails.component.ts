import { Component, OnInit } from '@angular/core';
import { Service } from '../home/app.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TenderService } from '../../services/tender.service';

@Component({
  selector: 'app-tenderdetails',
  templateUrl: './tenderdetails.component.html',
  styleUrls: ['./tenderdetails.component.scss']
})
export class TenderdetailsComponent implements OnInit {

  tender;
  tabs;
  tabIndex = 0;
  constructor(
    private service: Service,
    private router: Router,
    private route: ActivatedRoute,
    private tenderService: TenderService
  ) {

  }

  ngOnInit() {
    this.tender = this.tenderService.getTender(this.route.snapshot.params.id);
    this.tabs = this.tenderService.getTabs();
  }

  selectTab(e) {
    this.tabIndex = e.itemIndex;
  }
}
